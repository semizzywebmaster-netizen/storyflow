
/**
 * Queue & Workers - Phase 57
 * REQUEST → QUEUE → WORKER → PROVIDER → PROCESSING → STORAGE → DATABASE → NOTIFICATION
 * Statuses: Pending, Processing, Completed, Failed, Cancelled, Retry
 */

interface Job {
  id: string
  type: string
  userId: string
  projectId?: string
  data: any
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  attempts: number
  maxAttempts: number
  result?: any
  error?: string
  createdAt: Date
  updatedAt: Date
}

export class QueueService {
  private jobs: Map<string, Job> = new Map()

  async addJob(type: string, data: any, options: { userId: string; projectId?: string; priority?: number } = { userId: 'unknown' }): Promise<Job> {
    const job: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId: options.userId,
      projectId: options.projectId,
      data,
      status: 'PENDING',
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.jobs.set(job.id, job)
    console.log(`[QUEUE] Job ${job.id} added: ${type} for user ${options.userId}`)

    // Simulate worker processing
    this.processJob(job.id)

    return job
  }

  private async processJob(jobId: string) {
    const job = this.jobs.get(jobId)
    if (!job) return

    job.status = 'PROCESSING'
    job.attempts++
    job.updatedAt = new Date()

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

      // Mock result based on type
      const results: any = {
        story: { storyId: 'story_123', wordCount: 2450 },
        image: { url: 'https://r2.example.com/image.jpg', width: 1024, height: 576 },
        voice: { url: 'https://r2.example.com/voice.mp3', duration: 35 },
        video: { url: 'https://r2.example.com/video.mp4', duration: 90 },
      }

      job.result = results[job.type] || { success: true }
      job.status = 'COMPLETED'
      console.log(`[QUEUE] Job ${jobId} completed`)

      // Trigger notification
      // await notificationService.send(job.userId, { type: 'GENERATION_COMPLETED', jobId })

    } catch (err: any) {
      job.error = err.message
      if (job.attempts < job.maxAttempts) {
        job.status = 'PENDING'
        console.log(`[QUEUE] Job ${jobId} failed, retrying (${job.attempts}/${job.maxAttempts})`)
        setTimeout(() => this.processJob(jobId), 5000)
      } else {
        job.status = 'FAILED'
        console.log(`[QUEUE] Job ${jobId} failed permanently`)
      }
    }

    job.updatedAt = new Date()
  }

  async getJob(jobId: string): Promise<Job | undefined> {
    return this.jobs.get(jobId)
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (job && job.status === 'PENDING') {
      job.status = 'CANCELLED'
      job.updatedAt = new Date()
    }
  }
}

export const queueService = new QueueService()
