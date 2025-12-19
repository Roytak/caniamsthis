import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WowheadProvider } from "@/components/wowhead-provider"

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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <WowheadProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
