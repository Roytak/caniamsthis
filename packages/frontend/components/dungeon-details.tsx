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

interface DungeonDetailsProps {
  dungeonId: string
}

export function DungeonDetails({ dungeonId }: DungeonDetailsProps) {
  const [dungeon, setDungeon] = useState<Instance | null>(null)
  const [showBossesOnly, setShowBossesOnly] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDungeon = async () => {
      try {
        const data = await WoWAPIClient.getDungeon(dungeonId)
        setDungeon(data)
      } catch (error) {
        console.error("Failed to load dungeon:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDungeon()
  }, [dungeonId])

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
    ? dungeon.npcs.filter((npc) => npc.role === "Boss")
    : dungeon.npcs.filter((npc) => npc.role !== "Boss")

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={dungeon.iconUrl || `/placeholder.svg?height=64&width=64&query=${dungeon.name}`}
            alt={dungeon.name}
            width={64}
            height={64}
            className="rounded"
          />
          <div>
            <h1 className="text-3xl font-bold text-green-400">{dungeon.name}</h1>
            <p className="text-green-200/70">
              {dungeon.expansion} • {dungeon.level}
            </p>
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
                  <Image
                    src={npc.iconUrl || `/placeholder.svg?height=48&width=48&query=${npc.name}`}
                    alt={npc.name}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <div>
                    <CardTitle className="text-green-300">{npc.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-green-900/30 text-green-400/70">
                        {npc.role}
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
                      <Image
                        src={spell.iconUrl || `/placeholder.svg?height=32&width=32&query=${spell.name}`}
                        alt={spell.name}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-green-200">{spell.name}</span>
                          <Badge
                            variant={spell.type === "Magic" ? "default" : "secondary"}
                            className={
                              spell.type === "Magic"
                                ? "bg-blue-900/50 text-blue-300"
                                : spell.type === "Physical"
                                  ? "bg-red-900/50 text-red-300"
                                  : spell.type === "Disease"
                                    ? "bg-yellow-900/50 text-yellow-300"
                                    : "bg-purple-900/50 text-purple-300"
                            }
                          >
                            {spell.type}
                          </Badge>
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
                      <Badge
                        variant={spell.canImmune ? "default" : "destructive"}
                        className={
                          spell.canImmune
                            ? "bg-green-900/50 text-green-300 border-green-700/50"
                            : "bg-red-900/50 text-red-300 border-red-700/50"
                        }
                      >
                        {spell.canImmune ? "✓ Can AMS" : "✗ Cannot AMS"}
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
