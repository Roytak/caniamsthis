import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WowheadProvider } from "@/components/wowhead-provider"
import { PageHeader } from "@/components/page-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Can I AMS This? - Death Knight Anti-Magic Shell Lookup",
  description: "World of Warcraft Death Knight tool for checking Anti-Magic Shell immunity against enemy spells",
  keywords: ["World of Warcraft", "Death Knight", "Anti-Magic Shell", "WoW", "Spells", "Immunity"]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="wowhead-config" strategy="afterInteractive">
          {`const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true};`}
        </Script>
        <Script src="https://wow.zamimg.com/js/tooltips.js" strategy="afterInteractive" />
      </head>
      <body className={`${inter.className} bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-dvh flex flex-col">
            <PageHeader />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-green-900/30 bg-black/50 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-6 text-center">
                <p className="text-green-300/50 text-sm">
                  Unofficial World of Warcraft tool for Death Knight players.
                </p>
              </div>
            </footer>
          </div>
          <WowheadProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
