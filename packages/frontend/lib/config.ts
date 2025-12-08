// Configuration for switching between mock data and API
export const APP_CONFIG = {
  // Set to true to use mock data, false to use real API
  USE_MOCK_DATA: false,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
} as const
