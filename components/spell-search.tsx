"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SpellSearchResults } from "@/components/spell-search-results"
import type { SearchResult, SpellSearchResponse } from "@/types/api"
import { useDebounce } from "@/hooks/use-debounce"

export function SpellSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const searchSpells = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const params = new URLSearchParams({ query });
      const response = await fetch(`/api/spells/search?${params}`);
      const data: SpellSearchResponse = await response.json();
      setSearchResults(data.results)
    } catch (error) {
      console.error("Failed to search spells:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    searchSpells(debouncedSearchTerm)
  }, [debouncedSearchTerm, searchSpells])

  return (
    <>
      <div className="relative w-full">
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

      {searchTerm.trim() && (
        <div className="mt-8">
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
    </>
  )
}
