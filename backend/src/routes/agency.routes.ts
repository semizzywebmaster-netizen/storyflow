
import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { agencyService } from '../services/agencyService'

const router = Router()

router.post('/workspaces', authenticate as any, async (req: any, res, next) => {
  try {
    const workspace = await agencyService.createWorkspace(req.user.id, req.body)
    res.json({ success: true, data: workspace })
  } catch (err) { next(err) }
})

router.get('/workspaces', authenticate as any, async (req: any, res, next) => {
  try {
    const workspaces = await agencyService.getUserWorkspaces(req.user.id)
    res.json({ success: true, data: workspaces })
  } catch (err) { next(err) }
})

router.post('/workspaces/:id/members/invite', authenticate as any, async (req: any, res, next) => {
  try {
    const result = await agencyService.inviteMember(req.params.id, req.user.id, req.body)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/workspaces/:id/clients', authenticate as any, async (req: any, res, next) => {
  try {
    const client = await agencyService.createClientWorkspace(req.params.id, req.user.id, req.body)
    res.json({ success: true, data: client })
  } catch (err) { next(err) }
})

router.get('/workspaces/:id/projects', authenticate as any, async (req: any, res, next) => {
  try {
    const projects = await agencyService.getWorkspaceProjects(req.params.id, req.user.id)
    res.json({ success: true, data: projects })
  } catch (err) { next(err) }
})

router.post('/workspaces/:id/approvals', authenticate as any, async (req: any, res, next) => {
  try {
    const approval = await agencyService.requestApproval(req.params.id, req.user.id, req.body)
    res.json({ success: true, data: approval })
  } catch (err) { next(err) }
})

export const agencyRoutes = router
