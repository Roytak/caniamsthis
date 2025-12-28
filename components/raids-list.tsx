import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Instance } from "@/types/api"

export function RaidsList({ raids }: { raids: Instance[] }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400 mb-2 flex items-center gap-2">
          <Crown className="h-8 w-8" />
          Raids
        </h1>
        <p className="text-green-200/70">
          Browse raids to check boss spells and mechanics that can be immuned with Anti-Magic Shell
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {raids.map((raid) => (
          <Card
            key={raid.id}
            className="bg-gray-800/50 border-green-900/30 hover:border-green-700/50 transition-colors"
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <Image
                  src={raid.image_filename ? `/images/instances/${raid.image_filename}` : `/placeholder.svg?height=64&width=64&query=${raid.name}`}
                  alt={raid.name}
                  width={64}
                  height={64}
                  className="rounded"
                />
                <div>
                  <CardTitle className="text-green-300">{raid.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/raids/${raid.id}`}>
                <Button className="w-full bg-green-900/50 text-green-300 border border-green-700/50 hover:bg-green-800/50">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
