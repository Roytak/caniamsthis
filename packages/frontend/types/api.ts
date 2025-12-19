// API Types for the Rust backend
export interface Spell {
  id: number | string
  name: string
  description: string
  type: "Magic" | "Physical" | "Disease" | "Poison"
  can_immune: boolean
  iconUrl?: string
  damage?: number
  castTime?: number
  cooldown?: number
  npcId: string
}

export interface NPC {
  id: string
  name: string
  iconUrl?: string
  image_url?: string
  // New authoritative flag from backend indicating boss status
  is_boss?: boolean
  role?: "Boss" | "Elite" | "Trash"
  health?: number
  level?: number
  instanceId: string
  spells: Spell[]
}

export interface Instance {
  id: string
  name: string
  type: "dungeon" | "raid"
  image_filename?: string
  iconUrl?: string
  npcs: NPC[]
}

export interface SearchResult {
  spell: Spell
  npc: NPC
  instance: Instance
}

// API Response types
export interface SpellSearchResponse {
  results: Spell[]
  total: number
  page: number
  limit: number
}

export interface InstancesResponse {
  dungeons: Instance[]
  raids: Instance[]
}
