import { type NextRequest, NextResponse } from "next/server"
import { mockInstances } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const allInstances = [...mockInstances.dungeons, ...mockInstances.raids]
  const instance = allInstances.find((i) => i.id === id)

  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 })
  }

  return NextResponse.json(instance)
}
