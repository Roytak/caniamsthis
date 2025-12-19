"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Crown, Sword } from "lucide-react"
import Image from "next/image"
import { WoWAPIClient } from "@/lib/api-client"
import type { Instance } from "@/types/api"
import { LoadingSpinner } from "./loading-spinner"
import { useWowheadRefresh } from "@/hooks/use-wowhead-refresh"

interface DungeonDetailsProps {
  dungeonId: string
  initialDungeon?: Instance | null
}

export function DungeonDetails({ dungeonId, initialDungeon }: DungeonDetailsProps) {
  const [dungeon, setDungeon] = useState<Instance | null>(initialDungeon ?? null)
  const [showBossesOnly, setShowBossesOnly] = useState(true)
  // If we have an initial dungeon from the server, don't show the
  // loading spinner; otherwise show it until the client fetch completes.
  const [isLoading, setIsLoading] = useState<boolean>(initialDungeon ? false : true)

  useEffect(() => {
    if (initialDungeon) return // already have data from server

    let cancelled = false
    const loadDungeon = async () => {
      try {
        const data = await WoWAPIClient.getDungeon(dungeonId)
        if (!cancelled) setDungeon(data)
      } catch (error) {
        console.error("Failed to load dungeon:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadDungeon()
    return () => {
      cancelled = true
    }
  }, [dungeonId, initialDungeon])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!dungeon) {
    return (
      <Card className="bg-gray-800/50 border-green-900/30">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-green-300/70">Dungeon not found</p>
        </CardContent>
      </Card>
    )
  }

  const filteredNPCs = showBossesOnly
    ? dungeon.npcs.filter((npc) => Boolean(npc.is_boss))
    : dungeon.npcs.filter((npc) => !Boolean(npc.is_boss))

  useWowheadRefresh([dungeon?.id, showBossesOnly, filteredNPCs.length])

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={dungeon.image_filename ? `/images/instances/${dungeon.image_filename}` : `/placeholder.svg?height=64&width=64&query=${dungeon.name}`}
            alt={dungeon.name}
            width={64}
            height={64}
            className="rounded"
          />
          <div>
            <h1 className="text-3xl font-bold text-green-400">{dungeon.name}</h1>
          </div>
        </div>

        <Tabs
          value={showBossesOnly ? "bosses" : "trash"}
          onValueChange={(value) => setShowBossesOnly(value === "bosses")}
          className="w-auto"
        >
          <TabsList className="bg-gray-800/50 border border-green-900/30">
            <TabsTrigger
              value="bosses"
              className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-300"
            >
              <Crown className="h-4 w-4 mr-2" />
              Bosses
            </TabsTrigger>
            <TabsTrigger
              value="trash"
              className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-300"
            >
              <Sword className="h-4 w-4 mr-2" />
              Trash Mobs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {filteredNPCs.length > 0 ? (
        <div className="space-y-6">
          {filteredNPCs.map((npc, npcIndex) => (
            <Card key={npcIndex} className="bg-gray-800/50 border-green-900/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {!npc.is_boss && (npc.image_url || (npc as any).imageUrl) ? (
                    <Image
                      src={npc.image_url || (npc as any).imageUrl}
                      alt={npc.name}
                      width={64}
                      height={64}
                      className="rounded w-16 h-16 object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.src = "/images/defaults/npc.png"
                      }}
                    />
                  ) : (
                    <Image
                      src={npc.is_boss
                        ? `https://wow.zamimg.com/images/wow/journal/ui-ej-boss-${npc.name.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-')}.png`
                        : npc.iconUrl || "/images/defaults/npc.png"}
                      alt={npc.name}
                      width={64}
                      height={64}
                      className="rounded w-16 h-16 object-contain bg-gray-900/40"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.src = "/images/defaults/npc.png"
                      }}
                    />
                  )}
                  <div>
                    <CardTitle className="text-green-300">
                      <a
                        href={`https://www.wowhead.com/npc=${npc.id}`}
                        data-wowhead={`npc=${npc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-200 transition-colors"
                      >
                        {npc.name}
                      </a>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-green-900/30 text-green-400/70">
                        {npc.is_boss ? "Boss" : npc.role ?? "Trash"}
                      </Badge>
                      {npc.level && <span className="text-xs text-green-300/50">Level {npc.level}</span>}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {npc.spells.map((spell, spellIndex) => (
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
                            const school = (spell as any).school || spell.type
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
                                            : school === "Magic"
                                              ? "bg-blue-900/50 text-blue-300"
                                              : school === "Disease"
                                                ? "bg-yellow-900/50 text-yellow-300"
                                                : "bg-gray-800/50 text-gray-300"
                            return (
                              <Badge variant="outline" className={schoolClass}>
                                {school}
                              </Badge>
                            )
                          })()}
                        </div>
                        <p className="text-sm text-green-300/70">{spell.description}</p>
                        {(spell.damage || spell.castTime || spell.cooldown) && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-green-300/50">
                            {spell.damage && <span>Damage: {spell.damage.toLocaleString()}</span>}
                            {spell.castTime && <span>Cast: {spell.castTime}s</span>}
                            {spell.cooldown && <span>CD: {spell.cooldown}s</span>}
                          </div>
                        )}
                      </div>
                      {(() => {
                        return (
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
                        )
                      })()}
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
              <p className="text-green-300/70">
                No {showBossesOnly ? "bosses" : "trash mobs"} available for this dungeon
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
