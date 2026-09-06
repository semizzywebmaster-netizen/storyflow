import { Router } from 'express'
import { randomUUID } from 'crypto'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { authenticate, AuthRequest } from '../middleware/auth'
import { pool, query } from '../database/connection'
import { createError } from '../middleware/errorHandler'
import { creditService } from '../services/creditService'
import { storageService } from '../services/storageService'

const execFileAsync = promisify(execFile)
const router = Router()
router.use(authenticate)

const VIDEO_CREDITS = 20
const MAX_SCENES = 30
const SCENE_DURATION = 5

async function verifyProject(userId: string, projectId: string) {
  const result = await query(
    'SELECT id FROM projects WHERE id=$1 AND user_id=$2 AND deleted_at IS NULL',
    [projectId, userId]
  )
  if (!result.rows.length) throw createError('Project not found', 404)
}

async function downloadAsset(url: string, destination: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Unable to download source asset (${response.status})`)
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.startsWith('image/')) throw new Error('Video rendering requires image assets')
  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length > 25 * 1024 * 1024) throw new Error('Source image exceeds the 25MB render limit')
  await writeFile(destination, buffer)
}

router.post('/render', async (req: AuthRequest, res, next) => {
  const userId = req.user!.id
  const generationId = randomUUID()
  const workDir = await mkdtemp(join(tmpdir(), 'storyflow-video-'))

  try {
    const { projectId, sceneIds } = req.body ?? {}
    if (!projectId) return next(createError('projectId is required', 400))
    await verifyProject(userId, projectId)

    const requestedSceneIds = Array.isArray(sceneIds) ? sceneIds.filter((id: unknown) => typeof id === 'string') : []
    const params: any[] = [projectId, userId]
    let sceneFilter = ''
    if (requestedSceneIds.length) {
      params.push(requestedSceneIds.slice(0, MAX_SCENES))
      sceneFilter = 'AND s.id = ANY($3::uuid[])'
    }

    const scenes = await query(
      `SELECT s.id, s.scene_index, a.url
       FROM scenes s
       INNER JOIN projects p ON p.id=s.project_id AND p.user_id=$2 AND p.deleted_at IS NULL
       INNER JOIN LATERAL (
         SELECT url FROM assets
         WHERE scene_id=s.id AND user_id=$2 AND type='IMAGE' AND deleted_at IS NULL
         ORDER BY created_at DESC LIMIT 1
       ) a ON TRUE
       WHERE s.project_id=$1 ${sceneFilter}
       ORDER BY s.scene_index ASC
       LIMIT ${MAX_SCENES}`,
      params
    )

    if (!scenes.rows.length) {
      return next(createError('No scene images are available for this project. Generate scene images before rendering.', 400))
    }

    await query(
      `INSERT INTO generations (id,user_id,project_id,type,status,credits_reserved,metadata)
       VALUES ($1,$2,$3,'VIDEO','PENDING',$4,$5)`,
      [generationId, userId, projectId, VIDEO_CREDITS, JSON.stringify({ sceneCount: scenes.rows.length })]
    )

    await creditService.reserveCredits(userId, VIDEO_CREDITS, generationId, 'StoryFlow video render')
    await query(`UPDATE generations SET status='PROCESSING',updated_at=NOW() WHERE id=$1`, [generationId])

    const concatLines: string[] = []
    for (let i = 0; i < scenes.rows.length; i++) {
      const filename = join(workDir, `scene-${i}.jpg`)
      await downloadAsset(scenes.rows[i].url, filename)
      concatLines.push(`file '${filename.replace(/'/g, "'\\''")}'`)
      concatLines.push(`duration ${SCENE_DURATION}`)
    }
    // concat requires the final file to be repeated so the final duration is honoured.
    const lastFilename = join(workDir, `scene-${scenes.rows.length - 1}.jpg`)
    concatLines.push(`file '${lastFilename.replace(/'/g, "'\\''")}'`)

    const concatFile = join(workDir, 'inputs.txt')
    const outputFile = join(workDir, 'storyflow.mp4')
    await writeFile(concatFile, `${concatLines.join('\n')}\n`, 'utf8')

    await execFileAsync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-f', 'concat', '-safe', '0', '-i', concatFile,
      '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p',
      '-r', '30', '-movflags', '+faststart', '-c:v', 'libx264', outputFile,
    ], { timeout: 10 * 60 * 1000, maxBuffer: 1024 * 1024 * 4 })

    const output = await readFile(outputFile)
    const key = `users/${userId}/projects/${projectId}/videos/${generationId}.mp4`
    const stored = await storageService.uploadFile(output, key, 'video/mp4', { maxSize: 500 * 1024 * 1024, userId })

    await query(
      `INSERT INTO assets (user_id,project_id,type,url,file_size,mime_type,duration_seconds,model,metadata)
       VALUES ($1,$2,'VIDEO',$3,$4,'video/mp4',$5,'ffmpeg-storyflow',$6)`,
      [userId, projectId, stored.url, stored.size, scenes.rows.length * SCENE_DURATION, JSON.stringify({ generationId, sceneCount: scenes.rows.length, storageKey: key })]
    )
    await query(
      `UPDATE generations SET status='COMPLETED',credits_consumed=$2,result_url=$3,metadata=metadata || $4::jsonb,updated_at=NOW() WHERE id=$1`,
      [generationId, VIDEO_CREDITS, stored.url, JSON.stringify({ storageKey: key })]
    )
    await creditService.consumeReservedCredits(userId, generationId)

    return res.status(201).json({ success: true, data: { generationId, url: stored.url, durationSeconds: scenes.rows.length * SCENE_DURATION, sceneCount: scenes.rows.length, creditsConsumed: VIDEO_CREDITS } })
  } catch (error: any) {
    try {
      await creditService.releaseReservedCredits(userId, VIDEO_CREDITS, generationId, 'Video render failed')
      await query(`UPDATE generations SET status='FAILED',error_message=$2,updated_at=NOW() WHERE id=$1`, [generationId, String(error?.message || 'Video render failed').slice(0, 1000)])
    } catch (finalizeError) {
      console.error('[VIDEO] Failed to finalize failed generation', finalizeError)
    }
    if (String(error?.message || '').includes('ffmpeg')) {
      return next(createError('Video rendering is temporarily unavailable because FFmpeg is not installed on the server.', 503))
    }
    return next(error)
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => undefined)
  }
})

router.get('/generation/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT id,project_id AS "projectId",type,status,credits_reserved AS "creditsReserved",credits_consumed AS "creditsConsumed",result_url AS "resultUrl",error_message AS "errorMessage",metadata,created_at AS "createdAt",updated_at AS "updatedAt"
       FROM generations WHERE id=$1 AND user_id=$2 AND type='VIDEO'`,
      [req.params.id, req.user!.id]
    )
    if (!result.rows.length) return next(createError('Video generation not found', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

export const videoRoutes = router
