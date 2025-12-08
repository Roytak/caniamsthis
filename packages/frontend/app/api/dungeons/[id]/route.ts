import { type NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/config";
import type { Instance } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // `params` may be a Promise in Next.js route handlers — await it
  // before accessing properties to avoid the sync-dynamic-apis error.
  const { id } = await params as { id: string };
  const response = await fetch(`${APP_CONFIG.API_BASE_URL}/dungeons/${id}`);
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json({ error: "Dungeon not found" }, { status: 404 });
  }

  return NextResponse.json(data as Instance);
}
