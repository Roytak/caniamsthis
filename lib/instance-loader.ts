// packages/frontend/lib/instance-loader.ts
import fs from 'fs';
import path from 'path';
import { Instance, InstancesData, InstancesResponse, SearchResult, Spell, NPC } from '@/types/api';

const dataPath = path.join(process.cwd(), 'data', 'instances.json');

let instancesCache: InstancesResponse | null = null;

function loadInstances(): InstancesResponse {
  if (instancesCache) {
    return instancesCache;
  }

  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const data: InstancesData = JSON.parse(fileContents);

  const slugify = (name: string) => name.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const raids: Instance[] = Object.entries(data.instances.raids).map(([name, raidData]) => {
    const slug = slugify(name);
    return {
      ...raidData,
      name,
      slug,
      type: 'raid',
      id: raidData.id.toString(),
      image_filename: `${slug}.jpg`,
      npcs: raidData.npcs.map((npc) => ({
        ...npc,
        id: npc.id.toString(),
        spells: npc.spells.map((spell) => ({
          ...spell,
          id: spell.id.toString(),
        })),
      })),
    }
  });

  const dungeons: Instance[] = Object.entries(data.instances.dungeons).map(([name, dungeonData]) => {
    const slug = slugify(name);
    return {
      ...dungeonData,
      name,
      slug,
      type: 'dungeon',
      id: dungeonData.id.toString(),
      image_filename: `${slug}.jpg`,
      npcs: dungeonData.npcs.map((npc) => ({
        ...npc,
        id: npc.id.toString(),
        spells: npc.spells.map((spell) => ({
          ...spell,
          id: spell.id.toString(),
        })),
      })),
    }
  });

  instancesCache = { raids, dungeons };
  return instancesCache;
}

export function getAllInstances(): InstancesResponse {
  return loadInstances();
}

export function getDungeon(id: string): Instance | undefined {
  const { dungeons } = loadInstances();
  return dungeons.find(dungeon => dungeon.id === id);
}

export function getRaid(id: string): Instance | undefined {
  const { raids } = loadInstances();
  return raids.find(raid => raid.id === id);
}

export function searchSpells(query: string, page = 1, limit = 20): { results: SearchResult[], total: number } {
    if (!query) {
        return { results: [], total: 0 };
    }
    const { raids, dungeons } = loadInstances();
    const allInstances = [...raids, ...dungeons];
    const results: SearchResult[] = [];

    for (const instance of allInstances) {
        for (const npc of instance.npcs) {
            for (const spell of npc.spells) {
                if (spell.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        spell,
                        npc,
                        instance,
                    });
                }
            }
        }
    }

    const total = results.length;
    const paginatedResults = results.slice((page - 1) * limit, page * limit);

    return { results: paginatedResults, total };
}
