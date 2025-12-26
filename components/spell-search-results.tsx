import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import type { SearchResult } from "@/types/api"
import Link from "next/link"

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
      {results.map(({ spell, npc, instance }, index) => (
        <Card
          key={`${spell.id}-${index}`}
          className="bg-gray-800/50 border-green-900/30 hover:border-green-700/50 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                {spell.id && (
                  <a
                    href={`https://www.wowhead.com/spell=${spell.id}`}
                    data-wowhead={`spell=${spell.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <span className="sr-only">{spell.name}</span>
                  </a>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-green-200 truncate">{spell.name}</h3>
                  <Badge
                    variant={spell.school === "Physical" ? "secondary" : "default"}
                    className={
                      spell.school === "Physical"
                        ? "bg-red-900/50 text-red-300"
                        : "bg-blue-900/50 text-blue-300"
                    }
                  >
                    {spell.school}
                  </Badge>
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

                <div className="text-sm text-green-300/70">
                  From{" "}
                  <Link href={`/${instance.type}s/${instance.id}`} className="font-semibold hover:underline">
                    {npc.name} in {instance.name}
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
