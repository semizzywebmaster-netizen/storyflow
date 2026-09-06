import { query } from '../database/connection'

interface ProviderRequest {
  capability: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'MUSIC'
  prompt: string
  userId: string
  plan: string
  creditsAvailable: number
  metadata?: any
}

interface Provider {
  id: string
  name: string
  type: string
  isEnabled: boolean
  priority: number
  healthStatus: string
  costPerUnit: number
  quotaLimit: number | null
  quotaUsed: number
  baseUrl?: string | null
  metadata?: any
}

export class AIProviderRouter {
  async checkMasterKillSwitch(): Promise<boolean> {
    try {
      const result = await query(
        `SELECT value FROM system_settings
         WHERE key = 'MASTER_AI_KILL_SWITCH'
         LIMIT 1`
      )
      return String(result.rows[0]?.value ?? '').toLowerCase() === 'true'
    } catch {
      return false
    }
  }

  async route(request: ProviderRequest): Promise<{ provider: Provider; model: string }> {
    if (await this.checkMasterKillSwitch()) {
      throw new Error('AI operations disabled by Master Kill Switch')
    }

    const planAccess = this.checkPlanAccess(request.capability, request.plan)
    if (!planAccess.allowed) {
      throw new Error(`Plan ${request.plan} does not have access to ${request.capability}`)
    }

    const cost = this.estimateCost(request.capability, request.metadata)
    if (request.creditsAvailable < cost) throw new Error('Insufficient credits')

    const providers = await this.getHealthyProviders(request.capability)
    if (providers.length === 0) throw new Error(`No healthy ${request.capability} providers available`)

    const selected = providers.sort((a, b) => {
      if (a.healthStatus !== b.healthStatus) return a.healthStatus === 'HEALTHY' ? -1 : 1
      if (a.priority !== b.priority) return a.priority - b.priority
      return a.costPerUnit - b.costPerUnit
    })[0]

    const model = await this.selectModel(selected, request.metadata)
    return { provider: selected, model }
  }

  private checkPlanAccess(capability: string, plan: string) {
    // Capability-level entitlement remains a business rule until a dedicated
    // feature/plan entitlement table is introduced. Never bypass credit checks.
    const restricted = capability === 'VIDEO' && plan === 'FREE'
    return { allowed: !restricted }
  }

  private estimateCost(capability: string, metadata: any): number {
    const costs: Record<string, number> = { TEXT: 5, IMAGE: 5, VIDEO: 20, VOICE: 4, MUSIC: 3 }
    const requested = Number(metadata?.credits)
    return Number.isFinite(requested) && requested > 0 ? Math.ceil(requested) : (costs[capability] || 5)
  }

  private async getHealthyProviders(capability: string): Promise<Provider[]> {
    const result = await query(
      `SELECT id, name, type, is_enabled, priority, health_status,
              cost_per_unit, quota_limit, quota_used, base_url, metadata
       FROM ai_providers
       WHERE type = $1
         AND is_enabled = TRUE
         AND health_status IN ('HEALTHY', 'DEGRADED')
         AND (quota_limit IS NULL OR quota_used < quota_limit)
       ORDER BY priority ASC, cost_per_unit ASC NULLS LAST`,
      [capability]
    )

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      isEnabled: row.is_enabled,
      priority: Number(row.priority ?? 100),
      healthStatus: row.health_status,
      costPerUnit: Number(row.cost_per_unit ?? 0),
      quotaLimit: row.quota_limit == null ? null : Number(row.quota_limit),
      quotaUsed: Number(row.quota_used ?? 0),
      baseUrl: row.base_url,
      metadata: row.metadata,
    }))
  }

  private async selectModel(provider: Provider, metadata: any): Promise<string> {
    const requestedModel = typeof metadata?.model === 'string' ? metadata.model.trim() : ''

    if (requestedModel) {
      const result = await query(
        `SELECT name
         FROM ai_models
         WHERE provider_id = $1
           AND name = $2
           AND is_enabled = TRUE
         LIMIT 1`,
        [provider.id, requestedModel]
      )

      if (result.rows.length === 0) {
        throw new Error(`Model ${requestedModel} is not enabled for AI provider ${provider.name}`)
      }

      return result.rows[0].name
    }

    const defaultModel = provider.metadata?.defaultModel
    if (typeof defaultModel === 'string' && defaultModel.trim()) {
      const result = await query(
        `SELECT name
         FROM ai_models
         WHERE provider_id = $1
           AND name = $2
           AND is_enabled = TRUE
         LIMIT 1`,
        [provider.id, defaultModel.trim()]
      )

      if (result.rows.length > 0) return result.rows[0].name
    }

    const result = await query(
      `SELECT name
       FROM ai_models
       WHERE provider_id = $1
         AND is_enabled = TRUE
       ORDER BY created_at ASC
       LIMIT 1`,
      [provider.id]
    )

    if (result.rows.length === 0) {
      throw new Error(`No enabled model configured for AI provider ${provider.name}`)
    }

    return result.rows[0].name
  }

  async executeWithFallback(
    request: ProviderRequest,
    executeFn: (provider: Provider, model: string) => Promise<any>
  ): Promise<any> {
    const providers = await this.getHealthyProviders(request.capability)
    if (providers.length === 0) throw new Error(`No healthy ${request.capability} providers available`)

    let lastError: any
    for (const provider of providers.slice(0, 3)) {
      try {
        const model = await this.selectModel(provider, request.metadata)
        return await executeFn(provider, model)
      } catch (err) {
        lastError = err
        console.warn(`Provider ${provider.name} failed:`, err)
      }
    }

    throw new Error(`All providers failed. Last error: ${lastError?.message || 'unknown error'}`)
  }
}

export const aiProviderRouter = new AIProviderRouter()
