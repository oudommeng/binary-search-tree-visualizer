"use client"

import { useState, useEffect } from "react"
import { BSTVisualizer } from "@/components/bst-visualizer"
import { SplashScreen } from "@/components/splash-screen"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="w-full h-screen">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {!showSplash && <BSTVisualizer />}
    </main>
  )
}
