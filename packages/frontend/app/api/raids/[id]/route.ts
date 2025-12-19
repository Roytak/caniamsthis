import { type NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/config";
import type { Instance } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const response = await fetch(`${APP_CONFIG.API_BASE_URL}/raids/${id}`);
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json({ error: "Raid not found" }, { status: 404 });
  }

  return NextResponse.json(data as Instance);
}
