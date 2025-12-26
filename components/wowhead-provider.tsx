"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function WowheadProvider() {
  const pathname = usePathname()

  useEffect(() => {
    let attempts = 0
    const tryRefresh = () => {
      const wh = (window as any).$WowheadPower
      if (wh?.refreshLinks) {
        wh.refreshLinks()
        return true
      }
      return false
    }

    // Try immediately
    if (tryRefresh()) return

    // Keep retrying for a few seconds until the script attaches
    const timer = setInterval(() => {
      attempts += 1
      if (tryRefresh() || attempts > 40) {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [pathname])

  return null
}
