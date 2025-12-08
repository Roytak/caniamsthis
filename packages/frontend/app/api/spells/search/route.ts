import { type NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/config";
import type { SpellSearchResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") || "";
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "20");

  if (!query.trim()) {
    return NextResponse.json({
      results: [],
      total: 0,
      page,
      limit,
    } as SpellSearchResponse);
  }

  const params = new URLSearchParams({
    query: query,
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await fetch(
    `${APP_CONFIG.API_BASE_URL}/spells/search?${params}`
  );
  const data = await response.json();
  return NextResponse.json(data as SpellSearchResponse);
}
