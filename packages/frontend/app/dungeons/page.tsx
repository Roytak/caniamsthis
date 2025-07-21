import { Suspense } from "react"
import { DungeonsList } from "@/components/dungeons-list"
import { PageHeader } from "@/components/page-header"
import { LoadingSpinner } from "@/components/loading-spinner"

export const metadata = {
  title: "Dungeons - Can I AMS This?",
  description: "Browse World of Warcraft dungeons and check which spells can be immuned with Anti-Magic Shell",
}

export default function DungeonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <DungeonsList />
        </Suspense>
      </main>
    </div>
  )
}
