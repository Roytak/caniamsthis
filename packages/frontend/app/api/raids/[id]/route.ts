import { type NextRequest, NextResponse } from "next/server"
import { mockInstances } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const raid = mockInstances.raids.find((r) => r.id === id)

  if (!raid) {
    return NextResponse.json({ error: "Raid not found" }, { status: 404 })
  }

  return NextResponse.json(raid)
}
