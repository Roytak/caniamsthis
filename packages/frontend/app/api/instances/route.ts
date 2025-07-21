import { NextResponse } from "next/server"
import { mockInstances } from "@/lib/mock-data"
import type { InstancesResponse } from "@/types/api"

export async function GET() {
  return NextResponse.json(mockInstances as InstancesResponse)
}
