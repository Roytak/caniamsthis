import { DungeonsList } from "@/components/dungeons-list"
import { PageHeader } from "@/components/page-header"
import { getAllInstances } from "@/lib/instance-loader"

export const metadata = {
  title: "Dungeons - Can I AMS This?",
  description: "Browse World of Warcraft dungeons and check which spells can be immuned with Anti-Magic Shell",
}

export default function DungeonsPage() {
  const { dungeons } = getAllInstances()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <DungeonsList dungeons={dungeons} />
      </main>
    </div>
  )
}
