import type { Instance, NPC, Spell } from "@/types/api"

// Mock spell data
const mockSpells: Record<string, Spell> = {
  // Dungeon Boss Spells
  "harvest-essence": {
    id: "harvest-essence",
    name: "Harvest Essence",
    description: "Channels dark magic to drain the target's life essence over 3 seconds",
    type: "Magic",
    canImmune: true,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 25000,
    castTime: 3.0,
    cooldown: 15,
    npcId: "drust-harvester",
  },
  "spirit-bolt": {
    id: "spirit-bolt",
    name: "Spirit Bolt",
    description: "Hurls a bolt of spectral energy at the target",
    type: "Magic",
    canImmune: true,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 18000,
    castTime: 2.0,
    cooldown: 8,
    npcId: "drust-harvester",
  },
  "mistveil-bite": {
    id: "mistveil-bite",
    name: "Mistveil Bite",
    description: "A vicious bite that inflicts a bleeding wound",
    type: "Physical",
    canImmune: false,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 22000,
    castTime: 0,
    cooldown: 12,
    npcId: "mistveil-guardian",
  },
  "anima-injection": {
    id: "anima-injection",
    name: "Anima Injection",
    description: "Injects corrupted anima, causing magic damage over time",
    type: "Magic",
    canImmune: true,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 8000,
    castTime: 1.5,
    cooldown: 20,
    npcId: "mistveil-guardian",
  },

  // Dungeon Trash Spells
  "spear-flurry": {
    id: "spear-flurry",
    name: "Spear Flurry",
    description: "A rapid series of spear thrusts dealing physical damage",
    type: "Physical",
    canImmune: false,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 15000,
    castTime: 0,
    cooldown: 18,
    npcId: "mistveil-defender",
  },
  "drain-fluids": {
    id: "drain-fluids",
    name: "Drain Fluids",
    description: "Channels to drain bodily fluids, healing the caster",
    type: "Magic",
    canImmune: true,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 12000,
    castTime: 4.0,
    cooldown: 25,
    npcId: "corpse-harvester",
  },
  "throw-cleaver": {
    id: "throw-cleaver",
    name: "Throw Cleaver",
    description: "Hurls a heavy cleaver at a distant target",
    type: "Physical",
    canImmune: false,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 20000,
    castTime: 1.0,
    cooldown: 10,
    npcId: "corpse-harvester",
  },

  // Raid Boss Spells
  "exsanguinating-bite": {
    id: "exsanguinating-bite",
    name: "Exsanguinating Bite",
    description: "A devastating bite that causes severe bleeding",
    type: "Physical",
    canImmune: false,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 45000,
    castTime: 0,
    cooldown: 30,
    npcId: "shriekwing",
  },
  "horrifying-shriek": {
    id: "horrifying-shriek",
    name: "Horrifying Shriek",
    description: "An ear-piercing shriek that fills enemies with terror",
    type: "Magic",
    canImmune: true,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 0,
    castTime: 2.5,
    cooldown: 45,
    npcId: "shriekwing",
  },
  sinseeker: {
    id: "sinseeker",
    name: "Sinseeker",
    description: "A homing projectile that seeks out the most sinful target",
    type: "Magic",
    canImmune: true,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 35000,
    castTime: 3.0,
    cooldown: 20,
    npcId: "huntsman-altimor",
  },
  spreadshot: {
    id: "spreadshot",
    name: "Spreadshot",
    description: "Fires multiple projectiles in a cone, dealing physical damage",
    type: "Physical",
    canImmune: false,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 28000,
    castTime: 1.5,
    cooldown: 15,
    npcId: "huntsman-altimor",
  },
  "stone-shout": {
    id: "stone-shout",
    name: "Stone Shout",
    description: "A thunderous roar that deals earth magic damage",
    type: "Magic",
    canImmune: true,
    iconUrl: "/placeholder.svg?height=48&width=48",
    damage: 32000,
    castTime: 2.0,
    cooldown: 25,
    npcId: "stone-legion-general",
  },
}

// Mock NPC data
const mockNPCs: Record<string, NPC> = {
  // Dungeon Bosses
  "drust-harvester": {
    id: "drust-harvester",
    name: "Drust Harvester",
    iconUrl: "/placeholder.svg?height=48&width=48",
    role: "Boss",
    health: 2500000,
    level: 73,
    instanceId: "mists-of-tirna-scithe",
    spells: [mockSpells["harvest-essence"], mockSpells["spirit-bolt"]],
  },
  "mistveil-guardian": {
    id: "mistveil-guardian",
    name: "Mistveil Guardian",
    iconUrl: "/placeholder.svg?height=48&width=48",
    role: "Boss",
    health: 2800000,
    level: 73,
    instanceId: "mists-of-tirna-scithe",
    spells: [mockSpells["mistveil-bite"], mockSpells["anima-injection"]],
  },

  // Dungeon Trash
  "mistveil-defender": {
    id: "mistveil-defender",
    name: "Mistveil Defender",
    iconUrl: "/placeholder.svg?height=48&width=48",
    role: "Elite",
    health: 450000,
    level: 72,
    instanceId: "mists-of-tirna-scithe",
    spells: [mockSpells["spear-flurry"], mockSpells["anima-injection"]],
  },
  "corpse-harvester": {
    id: "corpse-harvester",
    name: "Corpse Harvester",
    iconUrl: "/placeholder.svg?height=48&width=48",
    role: "Elite",
    health: 380000,
    level: 72,
    instanceId: "necrotic-wake",
    spells: [mockSpells["drain-fluids"], mockSpells["throw-cleaver"]],
  },

  // Raid Bosses
  shriekwing: {
    id: "shriekwing",
    name: "Shriekwing",
    iconUrl: "/placeholder.svg?height=48&width=48",
    role: "Boss",
    health: 15000000,
    level: 83,
    instanceId: "castle-nathria",
    spells: [mockSpells["exsanguinating-bite"], mockSpells["horrifying-shriek"]],
  },
  "huntsman-altimor": {
    id: "huntsman-altimor",
    name: "Huntsman Altimor",
    iconUrl: "/placeholder.svg?height=48&width=48",
    role: "Boss",
    health: 18000000,
    level: 83,
    instanceId: "castle-nathria",
    spells: [mockSpells["sinseeker"], mockSpells["spreadshot"]],
  },
  "stone-legion-general": {
    id: "stone-legion-general",
    name: "Stone Legion General",
    iconUrl: "/placeholder.svg?height=48&width=48",
    role: "Boss",
    health: 22000000,
    level: 83,
    instanceId: "castle-nathria",
    spells: [mockSpells["stone-shout"]],
  },
}

// Mock instance data
export const mockInstances: { dungeons: Instance[]; raids: Instance[] } = {
  dungeons: [
    {
      id: "mists-of-tirna-scithe",
      name: "Mists of Tirna Scithe",
      type: "dungeon",
      level: "Mythic+",
      expansion: "Shadowlands",
      iconUrl: "/placeholder.svg?height=48&width=48",
      npcs: [mockNPCs["drust-harvester"], mockNPCs["mistveil-guardian"], mockNPCs["mistveil-defender"]],
    },
    {
      id: "necrotic-wake",
      name: "The Necrotic Wake",
      type: "dungeon",
      level: "Mythic+",
      expansion: "Shadowlands",
      iconUrl: "/placeholder.svg?height=48&width=48",
      npcs: [mockNPCs["corpse-harvester"]],
    },
    {
      id: "plaguefall",
      name: "Plaguefall",
      type: "dungeon",
      level: "Mythic+",
      expansion: "Shadowlands",
      iconUrl: "/placeholder.svg?height=48&width=48",
      npcs: [],
    },
  ],
  raids: [
    {
      id: "castle-nathria",
      name: "Castle Nathria",
      type: "raid",
      level: "Mythic",
      expansion: "Shadowlands",
      iconUrl: "/placeholder.svg?height=48&width=48",
      npcs: [mockNPCs["shriekwing"], mockNPCs["huntsman-altimor"], mockNPCs["stone-legion-general"]],
    },
    {
      id: "sanctum-of-domination",
      name: "Sanctum of Domination",
      type: "raid",
      level: "Mythic",
      expansion: "Shadowlands",
      iconUrl: "/placeholder.svg?height=48&width=48",
      npcs: [],
    },
  ],
}

// Create search results from mock data
export function createMockSearchResults(query: string): Array<{
  spell: Spell
  npc: NPC
  instance: Instance
}> {
  const results: Array<{ spell: Spell; npc: NPC; instance: Instance }> = []
  const allInstances = [...mockInstances.dungeons, ...mockInstances.raids]

  for (const instance of allInstances) {
    for (const npc of instance.npcs) {
      for (const spell of npc.spells) {
        if (
          spell.name.toLowerCase().includes(query.toLowerCase()) ||
          spell.description.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({ spell, npc, instance })
        }
      }
    }
  }

  return results
}
