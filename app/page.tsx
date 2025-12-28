import { Sword, Crown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { getAllInstances } from "@/lib/instance-loader"
import { InstanceCard } from "@/components/instance-card"

export default function HomePage() {
  const { dungeons, raids } = getAllInstances()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Dungeons Section */}
      <section>
        <div className="mb-4">
          <h2 className="text-green-400 text-xl font-semibold flex items-center gap-2">
            <Sword className="h-5 w-5" />
            Dungeons
          </h2>
          <p className="text-green-200/70 text-sm">Browse dungeons to check boss and trash mob spells</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {dungeons.map((dungeon) => (
            <InstanceCard
              key={dungeon.id}
              href={`/dungeons/${dungeon.id}`}
              name={dungeon.name}
              imageFilename={dungeon.image_filename}
            />
          ))}
        </div>
      </section>

      {/* Raids Section */}
      <section>
        <div className="mb-4">
          <h2 className="text-green-400 text-xl font-semibold flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Raids
          </h2>
          <p className="text-green-200/70 text-sm">Browse raids to check boss spells and mechanics</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {raids.map((raid) => (
            <InstanceCard
              key={raid.id}
              href={`/raids/${raid.id}`}
              name={raid.name}
              imageFilename={raid.image_filename}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
