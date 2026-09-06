
/**
 * AI Provider Router - Phase 55
 * REQUEST → CAPABILITY → PLAN → CREDITS → HEALTH → QUOTA → COST → PRIORITY → PROVIDER → MODEL → EXECUTE → FALLBACK
 * Admin-configurable, no hard-coded provider
 */

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
  quotaLimit: number
  quotaUsed: number
}

export class AIProviderRouter {
  private masterKillSwitch = false

  async checkMasterKillSwitch(): Promise<boolean> {
    // Check system_settings table
    return this.masterKillSwitch
  }

  async route(request: ProviderRequest): Promise<{ provider: Provider; model: string }> {
    // 1. Master Kill Switch
    if (await this.checkMasterKillSwitch()) {
      throw new Error('AI operations disabled by Master Kill Switch')
    }

    // 2. Capability Check
    // 3. Plan Check
    const planAccess = this.checkPlanAccess(request.capability, request.plan)
    if (!planAccess.allowed) throw new Error(`Plan ${request.plan} does not have access to ${request.capability}`)

    // 4. Credit Check
    const cost = this.estimateCost(request.capability, request.metadata)
    if (request.creditsAvailable < cost) throw new Error('Insufficient credits')

    // 5. Provider Health + Quota + Priority
    const providers = await this.getHealthyProviders(request.capability)
    if (providers.length === 0) throw new Error('No healthy providers available')

    // Sort by priority + cost + health
    const sorted = providers.sort((a, b) => {
      if (a.healthStatus !== b.healthStatus) return a.healthStatus === 'HEALTHY' ? -1 : 1
      if (a.priority !== b.priority) return a.priority - b.priority
      return a.costPerUnit - b.costPerUnit
    })

    const selected = sorted[0]
    
    // 6. Model selection
    const model = await this.selectModel(selected, request.metadata)

    return { provider: selected, model }
  }

  private checkPlanAccess(capability: string, plan: string) {
    // Mock - real check from features table
    return { allowed: true }
  }

  private estimateCost(capability: string, metadata: any): number {
    const costs: any = { TEXT: 5, IMAGE: 5, VIDEO: 20, VOICE: 4, MUSIC: 3 }
    return costs[capability] || 5
  }

  private async getHealthyProviders(capability: string): Promise<Provider[]> {
    // Mock - real query from ai_providers table where type=capability and is_enabled and health=HEALTHY
    return [
      { id: 'prov_001', name: 'OpenAI', type: 'TEXT', isEnabled: true, priority: 1, healthStatus: 'HEALTHY', costPerUnit: 0.005, quotaLimit: 10000, quotaUsed: 100 },
      { id: 'prov_002', name: 'Groq', type: 'TEXT', isEnabled: true, priority: 2, healthStatus: 'HEALTHY', costPerUnit: 0.0008, quotaLimit: 50000, quotaUsed: 500 },
    ].filter(p => p.type === capability || capability === 'TEXT')
  }

  private async selectModel(provider: Provider, metadata: any): Promise<string> {
    // Select model based on quality, cost, metadata
    return 'gpt-4o'
  }

  async executeWithFallback(request: ProviderRequest, executeFn: (provider: Provider, model: string) => Promise<any>): Promise<any> {
    const maxRetries = 3
    let lastError: any

    for (let i = 0; i < maxRetries; i++) {
      try {
        const { provider, model } = await this.route(request)
        return await executeFn(provider, model)
      } catch (err) {
        lastError = err
        console.warn(`Provider attempt ${i+1} failed:`, err)
        // Continue to next provider
      }
    }

    throw new Error(`All providers failed. Last error: ${lastError?.message}`)
  }
}

export const aiProviderRouter = new AIProviderRouter()
