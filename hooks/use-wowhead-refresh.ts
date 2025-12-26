import { useEffect } from "react"

export function useWowheadRefresh(deps: any[]) {
  useEffect(() => {
    let cancelled = false
    let attempts = 0

    const refresh = () => {
      if (cancelled) return
      const wh = (window as any).$WowheadPower
      if (wh?.refreshLinks) {
        wh.refreshLinks()
      }
      attempts += 1
      if (attempts < 6) {
        setTimeout(refresh, 150)
      }
    }

    refresh()

    return () => {
      cancelled = true
    }
  }, deps)
}
