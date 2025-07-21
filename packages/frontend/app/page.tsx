"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Sword, Crown, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { SpellSearchResults } from "@/components/spell-search-results"
import { WoWAPIClient } from "@/lib/api-client"
import type { SearchResult, Instance } from "@/types/api"
import { useDebounce } from "@/hooks/use-debounce"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [instances, setInstances] = useState<{ dungeons: Instance[]; raids: Instance[] }>({
    dungeons: [],
    raids: [],
  })

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Search for spells
  const searchSpells = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await WoWAPIClient.searchSpells(query)
      setSearchResults(response.results)
    } catch (error) {
      console.error("Failed to search spells:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Load instances on mount
  useEffect(() => {
    const loadInstances = async () => {
      try {
        const data = await WoWAPIClient.getInstances()
        setInstances(data)
      } catch (error) {
        console.error("Failed to load instances:", error)
      }
    }

    loadInstances()
  }, [])

  // Search when debounced term changes
  useEffect(() => {
    searchSpells(debouncedSearchTerm)
  }, [debouncedSearchTerm, searchSpells])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      {/* Header */}
      <header className="border-b border-green-900/30 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Image
                src="/images/ams-icon.png"
                alt="Anti-Magic Shell"
                width={48}
                height={48}
                className="rounded-lg shadow-lg shadow-green-500/20"
              />
              <div className="absolute inset-0 rounded-lg bg-green-400/20 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-400 tracking-wide">Can I AMS This?</h1>
              <p className="text-green-200/70 text-sm">Death Knight Anti-Magic Shell Immunity Lookup</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4 animate-spin" />
            )}
            <Input
              placeholder="Search for spells..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 bg-gray-800/50 border-green-900/50 text-green-100 placeholder:text-green-300/50 focus:border-green-400"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Show search results when searching */}
        {searchTerm.trim() && (
          <div className="mb-8">
            <Card className="bg-gray-800/50 border-green-900/30 shadow-lg shadow-green-500/10">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Results
                  {searchResults.length > 0 && (
                    <Badge variant="outline" className="border-green-700/50 text-green-300">
                      {searchResults.length} spell{searchResults.length !== 1 ? "s" : ""} found
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-green-200/70">Spells matching "{searchTerm}"</CardDescription>
              </CardHeader>
              <CardContent>
                <SpellSearchResults results={searchResults} isLoading={isSearching} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content browser when not searching */}
        {!searchTerm.trim() && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Dungeons */}
            <Card className="bg-gray-800/50 border-green-900/30 shadow-lg shadow-green-500/10">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Sword className="h-5 w-5" />
                  Dungeons
                </CardTitle>
                <CardDescription className="text-green-200/70">
                  Browse dungeons to check boss and trash mob spells
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {instances.dungeons.slice(0, 5).map((dungeon) => (
                  <Link key={dungeon.id} href={`/dungeons/${dungeon.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-gray-700/50 text-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={dungeon.iconUrl || `/placeholder.svg?height=32&width=32&query=${dungeon.name}`}
                          alt={dungeon.name}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium">{dungeon.name}</div>
                          <div className="text-xs text-green-300/70">{dungeon.level}</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
                <Link href="/dungeons">
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-green-700/50 text-green-300 hover:bg-green-900/20 bg-transparent"
                  >
                    View All Dungeons
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Raids */}
            <Card className="bg-gray-800/50 border-green-900/30 shadow-lg shadow-green-500/10">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Raids
                </CardTitle>
                <CardDescription className="text-green-200/70">
                  Browse raids to check boss spells and mechanics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {instances.raids.slice(0, 5).map((raid) => (
                  <Link key={raid.id} href={`/raids/${raid.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-gray-700/50 text-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={raid.iconUrl || `/placeholder.svg?height=32&width=32&query=${raid.name}`}
                          alt={raid.name}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium">{raid.name}</div>
                          <div className="text-xs text-green-300/70">{raid.level}</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
                <Link href="/raids">
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-green-700/50 text-green-300 hover:bg-green-900/20 bg-transparent"
                  >
                    View All Raids
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legend */}
        <Card className="mt-8 bg-gray-800/50 border-green-900/30 shadow-lg shadow-green-500/10">
          <CardHeader>
            <CardTitle className="text-green-400 text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-900/50 text-green-300 border-green-700/50">✓ Can AMS</Badge>
                <span className="text-green-200/70">Spell can be immuned with Anti-Magic Shell</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="bg-red-900/50 text-red-300 border-red-700/50">
                  ✗ Cannot AMS
                </Badge>
                <span className="text-green-200/70">Spell cannot be immuned (usually physical damage)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-900/50 text-blue-300">Magic</Badge>
                <span className="text-green-200/70">Magic-based ability</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-red-900/50 text-red-300">
                  Physical
                </Badge>
                <span className="text-green-200/70">Physical-based ability</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-green-900/30 bg-black/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-green-300/50 text-sm">
            Unofficial World of Warcraft tool for Death Knight players • Not affiliated with Blizzard Entertainment
          </p>
        </div>
      </footer>
    </div>
  )
}
