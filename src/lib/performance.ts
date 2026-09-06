
/**
 * Performance Utilities - Phase 77
 */

export const lazyLoad = (importFn: () => Promise<any>) => {
  return React.lazy(importFn)
}

export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number): T => {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }) as T
}

export const throttle = <T extends (...args: any[]) => any>(fn: T, limit: number): T => {
  let inThrottle: boolean
  return ((...args: any[]) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

// Pagination helper
export const paginate = (page: number, limit: number) => {
  const offset = (page - 1) * limit
  return { limit, offset }
}

// Cache helper
class SimpleCache {
  private cache = new Map<string, { data: any; expiry: number }>()
  
  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000) {
    this.cache.set(key, { data, expiry: Date.now() + ttlMs })
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }
    return entry.data
  }
  
  clear() { this.cache.clear() }
}

export const apiCache = new SimpleCache()
