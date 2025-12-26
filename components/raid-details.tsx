"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import Image from "next/image"
import type { Instance } from "@/types/api"

interface RaidDetailsProps {
  raid: Instance
}

export function RaidDetails({ raid }: RaidDetailsProps) {
  if (!raid) {
    return (
      <Card className="bg-gray-800/50 border-green-900/30">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-green-300/70">Raid not found</p>
        </CardContent>
      </Card>
    )
  }

  const bosses = raid.npcs.filter((npc) => Boolean(npc.is_boss))
  const bossEncounters = bosses.reduce((acc, boss) => {
    const encounterId = boss.encounter_id ?? boss.id;
    if (!acc[encounterId]) {
        acc[encounterId] = [];
    }
    acc[encounterId].push(boss);
    return acc;
  }, {} as Record<number | string, NPC[]>);


  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={raid.image_filename ? `/images/instances/${raid.image_filename}` : `/placeholder.svg?height=64&width=64&query=${raid.name}`}
            alt={raid.name}
            width={64}
            height={64}
            className="rounded"
          />
          <div>
            <h1 className="text-3xl font-bold text-green-400">{raid.name}</h1>
          </div>
        </div>
      </div>

      {Object.values(bossEncounters).length > 0 ? (
        <div className="space-y-6">
          {Object.values(bossEncounters).map((encounter, encounterIndex) => (
            <Card key={encounterIndex} className="bg-gray-800/50 border-green-900/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {encounter.map(boss => (
                    <div key={boss.id} className="flex items-center gap-3">
                      <Image
                        src={boss.image_url ? boss.image_url : "/images/defaults/npc.png"}
                        alt={boss.name}
                        width={64}
                        height={64}
                        className="rounded w-16 h-16 object-contain bg-gray-900/40"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.src = "/images/defaults/npc.png"
                        }}
                      />
                      <div>
                        <CardTitle className="text-green-300">
                          <a
                            href={`https://www.wowhead.com/npc=${boss.id}`}
                            data-wowhead={`npc=${boss.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-200 transition-colors"
                          >
                            {boss.name}
                          </a>
                        </CardTitle>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {encounter.flatMap(boss => boss.spells).map((spell, spellIndex) => (
                    <div
                      key={spellIndex}
                      className="flex items-center gap-3 p-3 bg-gray-900/30 rounded border border-green-900/20"
                    >
                      <a
                        href={`https://www.wowhead.com/spell=${spell.id}`}
                        data-wowhead={`spell=${spell.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <span className="font-medium text-green-200">{spell.name}</span>
                      </a>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {(() => {
                            const school = spell.school
                            const schoolClass =
                              school === "Physical"
                                ? "bg-red-900/50 text-red-300"
                                : school === "Arcane"
                                  ? "bg-indigo-900/50 text-indigo-300"
                                  : school === "Fire"
                                    ? "bg-orange-900/50 text-orange-300"
                                    : school === "Frost"
                                      ? "bg-blue-900/50 text-blue-300"
                                      : school === "Nature"
                                        ? "bg-emerald-900/50 text-emerald-300"
                                        : school === "Holy"
                                          ? "bg-yellow-900/50 text-yellow-300"
                                          : school === "Shadow"
                                            ? "bg-purple-900/50 text-purple-300"
                                            : "bg-gray-800/50 text-gray-300"

                            return (
                              <Badge variant="outline" className={schoolClass}>
                                {school}
                              </Badge>
                            )
                          })()}
                        </div>
                      </div>
                      <Badge
                        variant={spell.can_immune ? "default" : "destructive"}
                        className={
                          spell.can_immune
                            ? "bg-green-900/50 text-green-300 border-green-700/50"
                            : "bg-red-900/50 text-red-300 border-red-700/50"
                        }
                      >
                        {spell.can_immune ? "✓ Can AMS" : "✗ Cannot AMS"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800/50 border-green-900/30">
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <Shield className="h-8 w-8 text-green-400/50 mx-auto mb-2" />
              <p className="text-green-300/70">No bosses available for this raid</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
