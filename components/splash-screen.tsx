"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 30)

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onComplete(), 500)
    }, 3500)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 -right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          <motion.div
            className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-2xl px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* School Logo with Glow Effect */}
            <motion.div variants={logoVariants} className="relative">
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <div className="relative w-72 h-36 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-2xl">
                <Image
                  src="/cadt-logo.png"
                  alt="Cambodia Academy of Digital Technology"
                  width={288}
                  height={144}
                  priority
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Project Title */}
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-green-500 to-primary bg-clip-text text-transparent">
                Binary Search Tree Visualizer
              </h2>
            </motion.div>

            {/* Team Label with Card */}
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl px-8 py-4 border border-border/50 shadow-xl">
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
                  Team 01
                </h1>
              </div>
            </motion.div>

            {/* Team Members with Enhanced Cards */}
            <motion.div variants={itemVariants} className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {[
                  { name: "Pun Solita", delay: 0 },
                  { name: "Meng Oudom", delay: 0.1 },
                  { name: "Khoun Sovansunchhay", delay: 0.2 },
                ].map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + member.delay, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-card/60 backdrop-blur-sm rounded-lg px-6 py-4 border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-base font-semibold text-foreground text-center">
                        {member.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div variants={itemVariants} className="w-full max-w-md space-y-2">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-linear-to-r from-primary via-green-500 to-primary rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <motion.span
                  key={progress}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Loading... {progress}%
                </motion.span>
              </div>
            </motion.div>

            {/* Animated Dots */}
            <motion.div variants={itemVariants} className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-green-500 shadow-lg"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}