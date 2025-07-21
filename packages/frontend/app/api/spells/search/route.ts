import { type NextRequest, NextResponse } from "next/server"
import { mockInstances } from "@/lib/mock-data"
import type { SpellSearchResponse, SearchResult } from "@/types/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!query.trim()) {
    return NextResponse.json({
      results: [],
      total: 0,
      page,
      limit,
    } as SpellSearchResponse)
  }

  // Search through all instances for matching spells
  const results: SearchResult[] = []
  const allInstances = [...mockInstances.dungeons, ...mockInstances.raids]

  for (const instance of allInstances) {
    for (const npc of instance.npcs) {
      for (const spell of npc.spells) {
        if (
          spell.name.toLowerCase().includes(query.toLowerCase()) ||
          spell.description.toLowerCase().includes(query.toLowerCase()) ||
          npc.name.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({ spell, npc, instance })
        }
      }
    }
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedResults = results.slice(startIndex, endIndex)

  return NextResponse.json({
    results: paginatedResults,
    total: results.length,
    page,
    limit,
  } as SpellSearchResponse)
}
