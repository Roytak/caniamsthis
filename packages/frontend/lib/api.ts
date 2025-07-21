import type { SpellSearchResponse, InstancesResponse, Instance } from "@/types/api"
import { APP_CONFIG } from "@/lib/config"
import { mockInstances, createMockSearchResults } from "@/lib/mock-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// API functions for your Rust backend
export class WoWAPI {
  private static async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    return response.json()
  }

  // Search for spells across all content
  static async searchSpells(query: string, page = 1, limit = 20): Promise<SpellSearchResponse> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Use mock data
      const results = createMockSearchResults(query)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedResults = results.slice(startIndex, endIndex)

      return {
        results: paginatedResults,
        total: results.length,
        page,
        limit,
      }
    }

    // Use real API
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    })
    return this.request<SpellSearchResponse>(`/spells/search?${params}`)
  }

  // Get all instances (dungeons and raids)
  static async getInstances(): Promise<InstancesResponse> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      return mockInstances
    }

    return this.request<InstancesResponse>("/instances")
  }

  // Get specific dungeon with all NPCs and spells
  static async getDungeon(id: string): Promise<Instance> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      const dungeon = mockInstances.dungeons.find((d) => d.id === id)
      if (!dungeon) throw new Error(`Dungeon ${id} not found`)
      return dungeon
    }

    return this.request<Instance>(`/dungeons/${id}`)
  }

  // Get specific raid with all NPCs and spells
  static async getRaid(id: string): Promise<Instance> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      const raid = mockInstances.raids.find((r) => r.id === id)
      if (!raid) throw new Error(`Raid ${id} not found`)
      return raid
    }

    return this.request<Instance>(`/raids/${id}`)
  }

  // Get specific instance (dungeon or raid)
  static async getInstance(id: string): Promise<Instance> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      const allInstances = [...mockInstances.dungeons, ...mockInstances.raids]
      const instance = allInstances.find((i) => i.id === id)
      if (!instance) throw new Error(`Instance ${id} not found`)
      return instance
    }

    return this.request<Instance>(`/instances/${id}`)
  }
}

// API endpoints your Rust backend should implement:
/*
GET /api/spells/search?q={query}&page={page}&limit={limit}
- Search for spells by name across all dungeons and raids
- Returns: SpellSearchResponse

GET /api/instances
- Get all dungeons and raids (basic info only)
- Returns: InstancesResponse

GET /api/dungeons/{id}
- Get specific dungeon with full NPC and spell data
- Returns: Instance

GET /api/raids/{id}
- Get specific raid with full NPC and spell data  
- Returns: Instance

GET /api/instances/{id}
- Get specific instance (dungeon or raid) with full data
- Returns: Instance

Optional endpoints:
GET /api/spells/{id} - Get detailed spell information
GET /api/npcs/{id} - Get detailed NPC information
GET /api/expansions - Get list of WoW expansions
*/
