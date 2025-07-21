import { Suspense } from "react"
import { notFound } from "next/navigation"
import { RaidDetails } from "@/components/raid-details"
import { PageHeader } from "@/components/page-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { mockInstances } from "@/lib/mock-data"

interface RaidPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return mockInstances.raids.map((raid) => ({
    id: raid.id,
  }))
}

export async function generateMetadata({ params }: RaidPageProps) {
  const raid = mockInstances.raids.find((r) => r.id === params.id)

  if (!raid) {
    return {
      title: "Raid Not Found - Can I AMS This?",
    }
  }

  return {
    title: `${raid.name} - Can I AMS This?`,
    description: `Check which boss spells in ${raid.name} can be immuned with Death Knight Anti-Magic Shell`,
  }
}

export default function RaidPage({ params }: RaidPageProps) {
  const raid = mockInstances.raids.find((r) => r.id === params.id)

  if (!raid) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <RaidDetails raidId={params.id} />
        </Suspense>
      </main>
    </div>
  )
}
