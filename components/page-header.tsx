import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Sword, Crown } from "lucide-react"

export function PageHeader() {
  return (
    <header className="border-b border-green-900/30 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div className="relative">
              <Image
                src="/images/ams-icon.png"
                alt="Anti-Magic Shell"
                width={48}
                height={48}
                className="rounded-lg shadow-lg shadow-green-500/20"
              />
              <div className="absolute inset-0 rounded-lg bg-green-400/20 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-400 tracking-wide">Can I AMS This?</h1>
              <p className="text-green-200/70 text-sm">Death Knight Anti-Magic Shell Immunity Lookup</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-green-300 hover:bg-green-900/20">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/dungeons">
              <Button variant="ghost" size="sm" className="text-green-300 hover:bg-green-900/20">
                <Sword className="h-4 w-4 mr-2" />
                Dungeons
              </Button>
            </Link>
            <Link href="/raids">
              <Button variant="ghost" size="sm" className="text-green-300 hover:bg-green-900/20">
                <Crown className="h-4 w-4 mr-2" />
                Raids
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
