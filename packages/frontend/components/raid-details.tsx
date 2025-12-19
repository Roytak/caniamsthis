"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import Image from "next/image"
import { WoWAPIClient } from "@/lib/api-client"
import type { Instance } from "@/types/api"
import { LoadingSpinner } from "./loading-spinner"
import { useWowheadRefresh } from "@/hooks/use-wowhead-refresh"

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

  const bosses = raid?.npcs.filter((npc) => Boolean(npc.is_boss)) ?? []

  useWowheadRefresh([raid?.id, bosses.length])

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

      {bosses.length > 0 ? (
        <div className="space-y-6">
          {bosses.map((boss, bossIndex) => (
            <Card key={bossIndex} className="bg-gray-800/50 border-green-900/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Image
                    src={boss.is_boss
                      ? `https://wow.zamimg.com/images/wow/journal/ui-ej-boss-${boss.name.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-')}.png`
                      : boss.iconUrl || "/images/defaults/npc.png"}
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
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {boss.spells.map((spell, spellIndex) => (
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
