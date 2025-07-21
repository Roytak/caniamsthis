import { Suspense } from "react"
import { notFound } from "next/navigation"
import { DungeonDetails } from "@/components/dungeon-details"
import { PageHeader } from "@/components/page-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { mockInstances } from "@/lib/mock-data"

interface DungeonPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return mockInstances.dungeons.map((dungeon) => ({
    id: dungeon.id,
  }))
}

export async function generateMetadata({ params }: DungeonPageProps) {
  const dungeon = mockInstances.dungeons.find((d) => d.id === params.id)

  if (!dungeon) {
    return {
      title: "Dungeon Not Found - Can I AMS This?",
    }
  }

  return {
    title: `${dungeon.name} - Can I AMS This?`,
    description: `Check which spells in ${dungeon.name} can be immuned with Death Knight Anti-Magic Shell`,
  }
}

export default function DungeonPage({ params }: DungeonPageProps) {
  const dungeon = mockInstances.dungeons.find((d) => d.id === params.id)

  if (!dungeon) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <DungeonDetails dungeonId={params.id} />
        </Suspense>
      </main>
    </div>
  )
}
