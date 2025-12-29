"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

const LOADING_STATES = [
  "Initializing Visualizer...",
  "Allocating Memory Nodes...",
  "Balancing Binary Tree...",
  "Optimizing Search Algorithms...",
  "Ready to Visualize...",
]

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState(LOADING_STATES[0])

  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
  }, [])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        const increment = Math.random() * 4
        return Math.min(prev + increment, 100)
      })
    }, 50)

    const textInterval = setInterval(() => {
      setProgress((currentProgress) => {
        const index = Math.floor((currentProgress / 100) * (LOADING_STATES.length - 1))
        setLoadingText(LOADING_STATES[index])
        return currentProgress
      })
    }, 100)

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onComplete(), 800)
    }, 4500)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [onComplete])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: { duration: 0.8 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white text-[#12284C]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* --- BACKGROUND FX --- */}
          <div className="absolute inset-0 z-0">
            {/* Grid Pattern using Brand Color at 3% opacity */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#12284C08_1px,transparent_1px),linear-gradient(to_bottom,#12284C08_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />

            {particles.map((p) => (
              <motion.div
                key={p.id}
                // Particles are a mix of Brand Blue and Data Green
                className={`absolute w-2 h-2 rounded-full blur-[1px] ${p.id % 2 === 0 ? "bg-[#12284C]/10" : "bg-emerald-500/20"
                  }`}
                style={{ left: p.left, top: p.top }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: p.delay,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* --- MAIN CONTENT --- */}
          <motion.div
            className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Logo Container */}
            <motion.div variants={itemVariants} className="relative group">
              <motion.div
                // Glow effect using the Brand Blue
                className="absolute -inset-4 bg-linear-to-r from-[#12284C]/10 via-[#184076]/10 to-[#12284C]/10 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />
              <div className="relative bg-white/60 backdrop-blur-xl border border-[#12284C]/10 rounded-2xl p-6 shadow-xl ring-1 ring-[#12284C]/5">
                <Image
                  src="/cadt-logo.png"
                  alt="CADT Logo"
                  width={240}
                  height={120}
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Title Section */}
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-[#12284C] drop-shadow-sm">
                Binary Search Tree
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-linear-to-r from-transparent to-green-600" />
                <span className="text-sm font-mono text-green-600 tracking-[0.2em] uppercase font-bold">Visualizer</span>
                <div className="h-px w-12 bg-linear-to-l from-transparent to-green-600" />
              </div>
            </motion.div>

            {/* Team Card */}
            <motion.div
              variants={itemVariants}
              className="w-full bg-white/40 backdrop-blur-md border border-[#12284C]/10 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="bg-[#12284C]/5 border-b border-[#12284C]/10 px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-mono text-[#12284C]/60">/// SYSTEM_USERS</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-center text-xl font-bold text-[#12284C] mb-6 tracking-wide">
                  <span className="text-green-600">&lt;</span> TEAM 01 <span className="text-green-600">/&gt;</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Pun Solita", role: "Dev" },
                    { name: "Meng Oudom", role: "Lead" },
                    { name: "Khoun Sovansunchhay", role: "Dev" },
                  ].map((member, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                      className="group relative bg-white/50 rounded-lg p-3 border border-[#12284C]/10 hover:border-[#12284C]/30 hover:shadow-md transition-all cursor-default"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#12284C] mb-2 group-hover:scale-125 transition-all" />
                        <p className="text-sm font-bold text-[#12284C]">{member.name}</p>
                        <p className="text-[10px] text-[#12284C]/60 font-mono mt-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                          {member.role}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Loading Bar */}
            <motion.div variants={itemVariants} className="w-full max-w-md space-y-3">
              <div className="flex justify-between items-end px-1">
                <span className="text-xs font-mono text-[#12284C] font-semibold min-w-[200px]">
                  &gt; {loadingText}
                </span>
                <span className="text-xs font-mono text-[#12284C]/60">{Math.round(progress)}%</span>
              </div>

              <div className="h-1 w-full bg-[#12284C]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-green-600 to-emerald-400 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-[20px] bg-white/40 blur-[2px]" />
                </motion.div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}