"use client"

import { useState } from "react"
import { BSTVisualizer } from "@/components/bst-visualizer"
import { SplashScreen } from "@/components/splash-screen"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <main className="w-full h-screen">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {!showSplash && <BSTVisualizer />}
    </main>
  )
}
