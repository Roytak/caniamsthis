import { type NextRequest, NextResponse } from "next/server"
import { mockInstances } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const dungeon = mockInstances.dungeons.find((d) => d.id === id)

  if (!dungeon) {
    return NextResponse.json({ error: "Dungeon not found" }, { status: 404 })
  }

  return NextResponse.json(dungeon)
}
