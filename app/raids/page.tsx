import { RaidsList } from "@/components/raids-list"
import { getAllInstances } from "@/lib/instance-loader"

export const metadata = {
  title: "Raids - Can I AMS This?",
  description: "Browse World of Warcraft raids and check which boss spells can be immuned with Anti-Magic Shell",
}

export default function RaidsPage() {
  const { raids } = getAllInstances()

  return (
    <div className="container mx-auto px-4 py-8">
      <RaidsList raids={raids} />
    </div>
  )
}
