import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/config";
import type { InstancesResponse } from "@/types/api";

export async function GET() {
  const response = await fetch(`${APP_CONFIG.API_BASE_URL}/instances/`);
  const data = await response.json();
  return NextResponse.json(data as InstancesResponse);
}
