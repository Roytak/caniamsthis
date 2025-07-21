import type { SpellSearchResponse, InstancesResponse, Instance } from "@/types/api"

// Client-side API functions using Next.js API routes
export class WoWAPIClient {
  private static async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    return response.json()
  }

  // Search for spells using Next.js API route
  static async searchSpells(query: string, page = 1, limit = 20): Promise<SpellSearchResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    })
    return this.request<SpellSearchResponse>(`/api/spells/search?${params}`)
  }

  // Get all instances using Next.js API route
  static async getInstances(): Promise<InstancesResponse> {
    return this.request<InstancesResponse>("/api/instances")
  }

  // Get specific dungeon using Next.js API route
  static async getDungeon(id: string): Promise<Instance> {
    return this.request<Instance>(`/api/dungeons/${id}`)
  }

  // Get specific raid using Next.js API route
  static async getRaid(id: string): Promise<Instance> {
    return this.request<Instance>(`/api/raids/${id}`)
  }

  // Get specific instance using Next.js API route
  static async getInstance(id: string): Promise<Instance> {
    return this.request<Instance>(`/api/instances/${id}`)
  }
}
