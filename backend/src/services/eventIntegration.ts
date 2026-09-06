
/**
 * Event Integration - Phase 75
 * Connects notification engine to actual application events
 * Generation completed → notification, Payment confirmed → notification, etc.
 * Respects user preferences, channel fallback, retries, delivery logging
 */

import { notificationService } from './notificationService'

export class EventIntegration {
  async onGenerationCompleted(userId: string, data: { type: string; projectId?: string; jobId: string; resultUrl?: string }): Promise<void> {
    await notificationService.send(userId, {
      type: 'GENERATION_COMPLETED',
      data: { type: data.type, projectId: data.projectId, jobId: data.jobId, resultUrl: data.resultUrl },
      deduplicationKey: `gen_completed_${data.jobId}`,
    })

    // Specific type notifications
    if (data.type === 'IMAGE') {
      await notificationService.send(userId, { type: 'IMAGE_READY', data, deduplicationKey: `image_ready_${data.jobId}` })
    } else if (data.type === 'VOICE') {
      await notificationService.send(userId, { type: 'VOICE_READY', data, deduplicationKey: `voice_ready_${data.jobId}` })
    } else if (data.type === 'VIDEO') {
      await notificationService.send(userId, { type: 'VIDEO_READY', data: { projectTitle: data.projectId, ...data }, deduplicationKey: `video_ready_${data.jobId}`, priority: 'HIGH' as any })
    }
  }

  async onGenerationFailed(userId: string, data: { type: string; jobId: string; error: string }): Promise<void> {
    await notificationService.send(userId, {
      type: 'GENERATION_FAILED',
      data,
      deduplicationKey: `gen_failed_${data.jobId}`,
    })
  }

  async onPaymentConfirmed(userId: string, data: { amount: number; reference: string; creditsAdded?: number; type: string }): Promise<void> {
    await notificationService.send(userId, {
      type: 'PAYMENT_CONFIRMED',
      data,
      deduplicationKey: `payment_${data.reference}`,
      priority: 'HIGH' as any,
    })
  }

  async onWalletFunded(userId: string, data: { amount: number }): Promise<void> {
    await notificationService.send(userId, { type: 'WALLET_FUNDED', data })
  }

  async onCreditsPurchased(userId: string, data: { credits: number; amount: number }): Promise<void> {
    await notificationService.send(userId, { type: 'CREDITS_PURCHASED', data })
  }

  async onSubscriptionChanged(userId: string, data: { plan: string; previousPlan?: string }): Promise<void> {
    await notificationService.send(userId, { type: 'SUBSCRIPTION_CHANGED', data, priority: 'HIGH' as any })
  }

  async onVideoExported(userId: string, data: { projectId: string; exportUrl: string }): Promise<void> {
    await notificationService.send(userId, { type: 'EXPORT_COMPLETED', data, priority: 'MEDIUM' as any })
  }

  async onSecurityEvent(userId: string, data: { event: string; ip?: string; userAgent?: string }): Promise<void> {
    await notificationService.send(userId, { type: 'SECURITY_EVENT', data, priority: 'CRITICAL' as any })
  }

  async onReferralReward(userId: string, data: { credits: number; referredUserId: string }): Promise<void> {
    await notificationService.send(userId, { type: 'REFERRAL_REWARD', data })
  }

  async onProjectEvent(userId: string, data: { projectId: string; message: string }): Promise<void> {
    await notificationService.send(userId, { type: 'PROJECT_EVENT', data })
  }
}

export const eventIntegration = new EventIntegration()
