import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Sword, Crown } from "lucide-react"
import Image from "next/image"
import type { SearchResult } from "@/types/api"

interface SpellSearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
}

export function SpellSearchResults({ results, isLoading }: SpellSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-green-900/30 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-green-900/30">
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <Shield className="h-8 w-8 text-green-400/50 mx-auto mb-2" />
            <p className="text-green-300/70">No spells found matching your search</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card
          key={`${result.spell.id}-${index}`}
          className="bg-gray-800/50 border-green-900/30 hover:border-green-700/50 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Spell Icon */}
              <div className="relative">
                <Image
                  src={result.spell.iconUrl || `/placeholder.svg?height=48&width=48&query=spell+${result.spell.name}`}
                  alt={result.spell.name}
                  width={48}
                  height={48}
                  className="rounded border border-green-900/30"
                />
                <div className="absolute inset-0 rounded bg-green-400/10"></div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Spell Info */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-green-200 truncate">{result.spell.name}</h3>
                  <Badge
                    variant={result.spell.type === "Magic" ? "default" : "secondary"}
                    className={
                      result.spell.type === "Magic"
                        ? "bg-blue-900/50 text-blue-300"
                        : result.spell.type === "Physical"
                          ? "bg-red-900/50 text-red-300"
                          : result.spell.type === "Disease"
                            ? "bg-yellow-900/50 text-yellow-300"
                            : "bg-purple-900/50 text-purple-300"
                    }
                  >
                    {result.spell.type}
                  </Badge>
                  <Badge
                    variant={result.spell.canImmune ? "default" : "destructive"}
                    className={
                      result.spell.canImmune
                        ? "bg-green-900/50 text-green-300 border-green-700/50"
                        : "bg-red-900/50 text-red-300 border-red-700/50"
                    }
                  >
                    {result.spell.canImmune ? "✓ Can AMS" : "✗ Cannot AMS"}
                  </Badge>
                </div>

                <p className="text-sm text-green-300/70 mb-3">{result.spell.description}</p>

                {/* NPC and Instance Info */}
                <div className="flex items-center gap-4 text-xs text-green-300/60">
                  <div className="flex items-center gap-1">
                    <Image
                      src={result.npc.iconUrl || `/placeholder.svg?height=20&width=20&query=npc+${result.npc.name}`}
                      alt={result.npc.name}
                      width={20}
                      height={20}
                      className="rounded"
                    />
                    <span>{result.npc.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        result.npc.role === "Boss"
                          ? "border-yellow-700/50 text-yellow-300 bg-yellow-900/20"
                          : result.npc.role === "Elite"
                            ? "border-red-700/50 text-red-300 bg-red-900/20"
                            : "border-gray-700/50 text-gray-300 bg-gray-900/20"
                      }`}
                    >
                      {result.npc.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {result.instance.type === "dungeon" ? <Sword className="h-3 w-3" /> : <Crown className="h-3 w-3" />}
                    <span>{result.instance.name}</span>
                    <span className="text-green-400/50">({result.instance.level})</span>
                  </div>
                </div>

                {/* Additional Spell Stats */}
                {(result.spell.damage || result.spell.castTime || result.spell.cooldown) && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-green-300/50">
                    {result.spell.damage && <span>Damage: {result.spell.damage.toLocaleString()}</span>}
                    {result.spell.castTime && <span>Cast: {result.spell.castTime}s</span>}
                    {result.spell.cooldown && <span>CD: {result.spell.cooldown}s</span>}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
