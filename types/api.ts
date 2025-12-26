export interface Spell {
  id: number | string;
  name: string;
  school: string;
  flags: string[];
  can_immune: boolean;
}

export interface NPC {
  id: number | string;
  name: string;
  is_boss: boolean;
  encounter_id?: number;
  spells: Spell[];
  image_url: string;
}

export interface Instance {
  id: string;
  name: string;
  slug: string;
  type: "dungeon" | "raid";
  npcs: NPC[];
  image_filename?: string;
  iconUrl?: string;
}

export interface InstancesData {
  instances: {
    raids: { [key: string]: Omit<Instance, 'name' | 'type'> };
    dungeons: { [key: string]: Omit<Instance, 'name' | 'type'> };
  }
}

export interface InstancesResponse {
  dungeons: Instance[];
  raids: Instance[];
}

export interface SearchResult {
  spell: Spell;
  npc: NPC;
  instance: Instance;
}