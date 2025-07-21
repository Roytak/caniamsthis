import { Suspense } from "react"
import { RaidsList } from "@/components/raids-list"
import { PageHeader } from "@/components/page-header"
import { LoadingSpinner } from "@/components/loading-spinner"

export const metadata = {
  title: "Raids - Can I AMS This?",
  description: "Browse World of Warcraft raids and check which boss spells can be immuned with Anti-Magic Shell",
}

export default function RaidsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <RaidsList />
        </Suspense>
      </main>
    </div>
  )
}
