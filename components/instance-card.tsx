import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface InstanceCardProps {
  href: string
  name: string
  imageFilename?: string | null
}

export function InstanceCard({ href, name, imageFilename }: InstanceCardProps) {
  const src = imageFilename
    ? `/images/instances/${imageFilename}`
    : `/placeholder.svg?height=160&width=240&query=${encodeURIComponent(name)}`

  return (
    <Link href={href} className="group">
      <Card className="overflow-hidden bg-gray-800/50 border-green-900/30 hover:border-green-700/50 transition-colors">
        <div className="aspect-[16/9] relative">
          <Image
            src={src}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/30" />
        </div>
        <div className="px-3 py-3">
          <h3 className="text-sm sm:text-base font-medium text-green-100 group-hover:text-green-300 line-clamp-2">
            {name}
          </h3>
        </div>
      </Card>
    </Link>
  )
}
