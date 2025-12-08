import type {
  SpellSearchResponse,
  InstancesResponse,
  Instance,
} from "@/types/api";
import { APP_CONFIG } from "@/lib/config";

// Client-side API functions using Next.js API routes
export class WoWAPIClient {
  private static async request<T>(endpoint: string): Promise<T> {
    // Ensure server-side code uses an absolute URL. When Next.js runs
    // server-side (e.g. in `generateStaticParams` / `generateMetadata`),
    // a bare relative path like `/api/instances` cannot be parsed by
    // the Node fetch implementation. Use the app config's API base URL
    // (which defaults to `http://localhost:8000/api`) so server-side
    // requests target the FastAPI backend on port 8000 instead of the
    // Next dev server on 3000.
    let url = endpoint;
    if (endpoint.startsWith("/")) {
      if (typeof window === "undefined") {
        const base = APP_CONFIG?.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        // Avoid duplicating `/api` when both base and endpoint include it.
        if (endpoint.startsWith("/api") && base.endsWith("/api")) {
          url = `${base}${endpoint.slice(4)}`; // remove leading '/api' from endpoint
        } else {
          url = `${base}${endpoint}`;
        }
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }

  // Search for spells using Next.js API route
  static async searchSpells(
    query: string,
    page = 1,
    limit = 20
  ): Promise<SpellSearchResponse> {
    const params = new URLSearchParams({
      query: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request<SpellSearchResponse>(`/api/spells/search?${params}`);
  }

  // Get all instances using Next.js API route
  static async getInstances(): Promise<InstancesResponse> {
    return this.request<InstancesResponse>("/api/instances");
  }

  // Get specific dungeon using Next.js API route
  static async getDungeon(id: string): Promise<Instance> {
    return this.request<Instance>(`/api/dungeons/${id}`);
  }

  // Get specific raid using Next.js API route
  static async getRaid(id: string): Promise<Instance> {
    return this.request<Instance>(`/api/raids/${id}`);
  }

  // Get specific instance using Next.js API route
  static async getInstance(id: string): Promise<Instance> {
    return this.request<Instance>(`/api/instances/${id}`);
  }
}
