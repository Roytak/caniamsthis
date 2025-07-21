"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import Image from "next/image"
import { WoWAPIClient } from "@/lib/api-client"
import type { Instance } from "@/types/api"
import { LoadingSpinner } from "./loading-spinner"

interface RaidDetailsProps {
  raidId: string
}

export function RaidDetails({ raidId }: RaidDetailsProps) {
  const [raid, setRaid] = useState<Instance | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRaid = async () => {
      try {
        const data = await WoWAPIClient.getRaid(raidId)
        setRaid(data)
      } catch (error) {
        console.error("Failed to load raid:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRaid()
  }, [raidId])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!raid) {
    return (
      <Card className="bg-gray-800/50 border-green-900/30">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-green-300/70">Raid not found</p>
        </CardContent>
      </Card>
    )
  }

  const bosses = raid.npcs.filter((npc) => npc.role === "Boss")

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={raid.iconUrl || `/placeholder.svg?height=64&width=64&query=${raid.name}`}
            alt={raid.name}
            width={64}
            height={64}
            className="rounded"
          />
          <div>
            <h1 className="text-3xl font-bold text-green-400">{raid.name}</h1>
            <p className="text-green-200/70">
              {raid.expansion} • {raid.level}
            </p>
          </div>
        </div>
      </div>

      {bosses.length > 0 ? (
        <div className="space-y-6">
          {bosses.map((boss, bossIndex) => (
            <Card key={bossIndex} className="bg-gray-800/50 border-green-900/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Image
                    src={boss.iconUrl || `/placeholder.svg?height=48&width=48&query=${boss.name}`}
                    alt={boss.name}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <div>
                    <CardTitle className="text-green-300">{boss.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs border-yellow-700/50 text-yellow-300 bg-yellow-900/20"
                      >
                        {boss.role}
                      </Badge>
                      {boss.level && <span className="text-xs text-green-300/50">Level {boss.level}</span>}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {boss.spells.map((spell, spellIndex) => (
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
              <p className="text-green-300/70">No bosses available for this raid</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
