import { type NextRequest, NextResponse } from "next/server";
import { searchSpells } from "@/lib/instance-loader";
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

  const { results, total } = searchSpells(query, page, limit);

  return NextResponse.json({
    results,
    total,
    page,
    limit,
  } as SpellSearchResponse);
}
