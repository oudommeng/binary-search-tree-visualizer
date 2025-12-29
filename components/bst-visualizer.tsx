"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  AlertCircle, RotateCcw, Trash2,
  Play, Pause, Menu, Maximize
} from "lucide-react"

// --- BST LOGIC (Unchanged) ---
class TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(value: number) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class BinarySearchTree {
  root: TreeNode | null = null

  insert(value: number): boolean {
    const newNode = new TreeNode(value)
    if (!this.root) {
      this.root = newNode
      return true
    }
    let current = this.root
    while (true) {
      if (value === current.value) return false
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode
          return true
        }
        current = current.left
      } else {
        if (!current.right) {
          current.right = newNode
          return true
        }
        current = current.right
      }
    }
  }

  delete(value: number): boolean {
    const found = this.find(value)
    this.root = this._deleteNode(this.root, value)
    return found
  }

  private _deleteNode(node: TreeNode | null, key: number): TreeNode | null {
    if (!node) return null
    if (key < node.value) {
      node.left = this._deleteNode(node.left, key)
      return node
    } else if (key > node.value) {
      node.right = this._deleteNode(node.right, key)
      return node
    } else {
      if (!node.left && !node.right) return null
      if (!node.left) return node.right
      if (!node.right) return node.left
      let minRight = node.right
      while (minRight.left) minRight = minRight.left
      node.value = minRight.value
      node.right = this._deleteNode(node.right, minRight.value)
      return node
    }
  }

  find(value: number): boolean {
    let current = this.root
    while (current) {
      if (current.value === value) return true
      current = value < current.value ? current.left : current.right
    }
    return false
  }

  getPreOrder(node = this.root, result: number[] = []): number[] {
    if (node) {
      result.push(node.value)
      this.getPreOrder(node.left, result)
      this.getPreOrder(node.right, result)
    }
    return result
  }

  getInOrder(node = this.root, result: number[] = []): number[] {
    if (node) {
      this.getInOrder(node.left, result)
      result.push(node.value)
      this.getInOrder(node.right, result)
    }
    return result
  }

  getPostOrder(node = this.root, result: number[] = []): number[] {
    if (node) {
      this.getPostOrder(node.left, result)
      this.getPostOrder(node.right, result)
      result.push(node.value)
    }
    return result
  }
}

// --- VISUALIZER THEME ---
interface NodePosition {
  x: number
  y: number
  value: number
}

const THEME = {
  navy: "#12284C",
  navyLight: "rgba(18, 40, 76, 0.1)",
  emerald: "#10b981",
  white: "#ffffff",
  orange: "#f59e0b",
}

export function BSTVisualizer() {
  const [bst] = useState(() => new BinarySearchTree())
  const [nodes, setNodes] = useState<NodePosition[]>([])
  const [input, setInput] = useState("")

  // States
  const [activeNode, setActiveNode] = useState<number | null>(null)
  const [highlightedPath, setHighlightedPath] = useState<Set<number>>(new Set())
  const [foundNode, setFoundNode] = useState<number | null>(null)
  const [sequenceQueue, setSequenceQueue] = useState<number[]>([])
  const [currentSeqIndex, setCurrentSeqIndex] = useState<number>(-1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Viewport
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Mobile Toggle
  const [showExtras, setShowExtras] = useState(false)

  // --- AUTO FIT LOGIC ---
  const autoFit = useCallback((currentNodes: NodePosition[]) => {
    if (!containerRef.current || currentNodes.length === 0) return

    // 1. Calculate Bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    currentNodes.forEach(n => {
      if (n.x < minX) minX = n.x
      if (n.x > maxX) maxX = n.x
      if (n.y < minY) minY = n.y
      if (n.y > maxY) maxY = n.y
    })

    // 2. Add Padding
    const padding = 80
    const treeWidth = maxX - minX + padding * 2
    const treeHeight = maxY - minY + padding * 2

    // 3. Container Dimensions
    const { clientWidth, clientHeight } = containerRef.current

    // 4. Calculate Zoom
    const scaleX = clientWidth / treeWidth
    const scaleY = clientHeight / treeHeight
    const newZoom = Math.min(Math.min(scaleX, scaleY), 1)

    // 5. Calculate Center
    const treeCenterX = (minX + maxX) / 2
    const treeCenterY = (minY + maxY) / 2

    const newPanX = (clientWidth / 2) - (treeCenterX * newZoom)
    const newPanY = (clientHeight / 2) - (treeCenterY * newZoom)

    setZoom(newZoom)
    setPan({ x: newPanX, y: newPanY })
  }, [])

  // --- NEW POSITIONING LOGIC (In-Order Layout) ---
  const calculatePositions = useCallback((root: TreeNode | null) => {
    const positions: NodePosition[] = []
    if (!root) return positions

    // We use a counter 'rank' to assign X positions based on sort order.
    // This prevents overlaps because every node gets a unique X value.
    let rank = 0

    const traverse = (node: TreeNode, depth: number) => {
      // Go Left first
      if (node.left) traverse(node.left, depth + 1)

      // Assign Position
      positions.push({
        x: rank * 60, // 60px horizontal spacing per node rank
        y: depth * 80, // 80px vertical spacing per level
        value: node.value
      })
      rank++

      // Go Right
      if (node.right) traverse(node.right, depth + 1)
    }

    traverse(root, 0)

    // Center the tree horizontally around 0
    const totalWidth = rank * 60
    const xOffset = totalWidth / 2

    return positions.map(p => ({
      ...p,
      x: p.x - xOffset
    }))
  }, [])

  const updateVisualization = useCallback((shouldAutoFit = false) => {
    const positions = calculatePositions(bst.root)
    setNodes(positions)
    setActiveNode(null)
    setHighlightedPath(new Set())
    setFoundNode(null)

    if (shouldAutoFit) {
      setTimeout(() => autoFit(positions), 50)
    }
  }, [bst, calculatePositions, autoFit])

  // Center on mount
  useEffect(() => {
    if (containerRef.current) {
      setPan({ x: containerRef.current.clientWidth / 2, y: 100 })
    }
  }, [])

  // --- INTERACTION ---
  const startDrag = (clientX: number, clientY: number) => {
    if (isProcessing) return
    setIsDragging(true)
    lastMousePos.current = { x: clientX, y: clientY }
  }

  const moveDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return
    const dx = clientX - lastMousePos.current.x
    const dy = clientY - lastMousePos.current.y
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }))
    lastMousePos.current = { x: clientX, y: clientY }
  }

  const handleMouseDown = (e: React.MouseEvent) => startDrag(e.clientX, e.clientY)
  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    moveDrag(e.clientX, e.clientY)
  }
  const handleMouseUp = () => setIsDragging(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      setZoom(prev => Math.min(Math.max(0.1, prev - e.deltaY * 0.001), 3))
    } else {
      setPan(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }))
    }
  }

  // --- CORE LOGIC ---
  const visualizeSingleInsert = async (value: number) => {
    resetError()
    setConsoleOutput(`> Processing: ${value}`)
    let current = bst.root
    const path = new Set<number>()
    while (current) {
      path.add(current.value)
      setHighlightedPath(new Set(path))
      await new Promise((r) => setTimeout(r, 400 / speed))
      if (value === current.value) {
        setError(`Node ${value} exists (Skipped)`)
        setHighlightedPath(new Set())
        return false
      }
      current = value < current.value ? current.left : current.right
    }
    if (bst.insert(value)) {
      updateVisualization(false) // Don't auto-fit mid-sequence
      setFoundNode(value)
      setTimeout(() => setFoundNode(null), 800)
      return true
    }
    return false
  }

  const handleInputSubmit = async () => {
    if (!input.trim() || isProcessing) return
    const values = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (values.length === 0) return

    if (values.length === 1) {
      const success = await visualizeSingleInsert(values[0])
      setInput("")
      if (success) updateVisualization(true)
      return
    }

    setSequenceQueue(values)
    setCurrentSeqIndex(-1)
    setIsProcessing(true)
    setInput("")

    for (let i = 0; i < values.length; i++) {
      setCurrentSeqIndex(i)
      await visualizeSingleInsert(values[i])
      await new Promise(r => setTimeout(r, 500 / speed))
    }

    setIsProcessing(false)
    setConsoleOutput("> Sequence Complete")
    updateVisualization(true) // Auto fit at the end

    setTimeout(() => {
      setSequenceQueue([])
      setCurrentSeqIndex(-1)
    }, 2000)
  }

  const handleDelete = () => {
    const value = Number.parseInt(input)
    if (isNaN(value)) return
    resetError()
    if (bst.delete(value)) {
      updateVisualization(true)
      setInput("")
      setConsoleOutput(`> Deleted node: ${value}`)
    } else {
      setError(`Node ${value} not found.`)
    }
  }

  const handleTraversal = async (type: 'pre' | 'in' | 'post') => {
    if (isProcessing) return
    updateVisualization(true)
    setIsProcessing(true)
    resetError()
    setFoundNode(null)
    setHighlightedPath(new Set())

    let result: number[] = []
    let name = ""

    if (type === 'pre') { result = bst.getPreOrder(); name = "PRE-ORDER" }
    else if (type === 'in') { result = bst.getInOrder(); name = "IN-ORDER" }
    else { result = bst.getPostOrder(); name = "POST-ORDER" }

    if (result.length === 0) {
      setConsoleOutput("> Tree is empty")
      setIsProcessing(false)
      return
    }

    let currentOutput: number[] = []
    for (const value of result) {
      setActiveNode(value)
      currentOutput.push(value)
      setConsoleOutput(`> ${name}: [ ${currentOutput.join(", ")} ]`)
      await new Promise(resolve => setTimeout(resolve, 600 / speed))
    }
    setActiveNode(null)
    setIsProcessing(false)
  }

  const handleReset = () => {
    bst.root = null
    updateVisualization(true)
    setConsoleOutput("> Tree cleared")
    setSequenceQueue([])
    setIsProcessing(false)
  }

  const resetError = () => setError(null)

  const getEdges = () => {
    const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
    const traverse = (node: TreeNode | null) => {
      if (!node) return
      const parentPos = nodes.find(n => n.value === node.value)
      if (parentPos) {
        if (node.left) {
          const child = nodes.find(n => n.value === node.left!.value)
          if (child) edges.push({ x1: parentPos.x, y1: parentPos.y, x2: child.x, y2: child.y })
          traverse(node.left)
        }
        if (node.right) {
          const child = nodes.find(n => n.value === node.right!.value)
          if (child) edges.push({ x1: parentPos.x, y1: parentPos.y, x2: child.x, y2: child.y })
          traverse(node.right)
        }
      }
    }
    traverse(bst.root)
    return edges
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-[#12284C] font-sans overflow-hidden">

      {/* --- HEADER --- */}
      <div className="flex-none h-14 md:h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-6 shadow-sm z-30">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#12284C] flex items-center justify-center text-white font-bold text-base md:text-lg">B</div>
          <div>
            <h1 className="text-sm md:text-lg font-bold tracking-tight text-[#12284C]">BST Visualizer</h1>
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Sequence Animator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => updateVisualization(true)} size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-[#12284C]" title="Auto Fit Tree">
            <Maximize className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 md:gap-3 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase">Speed</span>
            <input type="range" min="0.5" max="3" step="0.5" value={speed} onChange={(e) => setSpeed(Number.parseFloat(e.target.value))} className="w-16 md:w-24 h-1.5 accent-[#12284C] cursor-pointer" />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">

        {/* --- CANVAS --- */}
        <div
          ref={containerRef}
          className="flex-1 order-1 md:order-2 relative bg-slate-50 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `linear-gradient(${THEME.navyLight} 1px, transparent 1px), linear-gradient(90deg, ${THEME.navyLight} 1px, transparent 1px)`,
            backgroundSize: '40px 40px', backgroundPosition: `${pan.x}px ${pan.y}px`, opacity: 0.5
          }} />

          {/* Notifications */}
          <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2 pointer-events-none items-center">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 pointer-events-auto">
                  <AlertCircle className="w-4 h-4" /> <span className="text-xs font-bold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            {consoleOutput && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#12284C] text-white px-4 py-2 rounded-xl shadow-xl font-mono text-xs border border-white/10 flex items-center gap-2 pointer-events-auto text-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                {consoleOutput}
              </motion.div>
            )}
          </div>

          {/* Sequence Tape */}
          <AnimatePresence>
            {sequenceQueue.length > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute bottom-4 left-0 right-0 z-20 mx-4"
              >
                <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-slate-200 flex flex-col items-center gap-2">
                  <span className="text-[9px] font-bold text-[#12284C] uppercase tracking-widest">Queue</span>
                  <div className="flex gap-2 overflow-x-auto w-full p-1 mask-linear no-scrollbar">
                    {sequenceQueue.map((val, idx) => {
                      const isCurrent = idx === currentSeqIndex
                      const isDone = idx < currentSeqIndex
                      return (
                        <motion.div
                          key={`${val}-${idx}`}
                          animate={{
                            scale: isCurrent ? 1.1 : 1,
                            backgroundColor: isCurrent ? THEME.orange : isDone ? "#dcfce7" : "#f1f5f9",
                            color: isCurrent ? "#fff" : isDone ? "#166534" : "#64748b",
                            borderColor: isCurrent ? THEME.orange : isDone ? "#bbf7d0" : "#e2e8f0"
                          }}
                          className="w-8 h-8 min-w-[32px] rounded border flex items-center justify-center font-mono font-bold text-xs shadow-sm"
                        >
                          {val}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tree Rendering */}
          <motion.div className="absolute top-0 left-0 origin-top-left will-change-transform" style={{ x: pan.x, y: pan.y, scale: zoom }}>
            <svg className="overflow-visible" style={{ width: 1, height: 1 }}>
              {getEdges().map((edge, i) => (
                <motion.line key={`edge-${i}`}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
                  stroke={THEME.navy} strokeWidth="2" strokeOpacity={0.3}
                />
              ))}
            </svg>
            <AnimatePresence>
              {nodes.map((node) => {
                const isActive = activeNode === node.value
                const isHighlighted = highlightedPath.has(node.value)
                const isFound = foundNode === node.value
                return (
                  <motion.div
                    key={node.value}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    style={{ position: "absolute", left: node.x, top: node.y, x: "-50%", y: "-50%" }}
                  >
                    <motion.div
                      animate={{
                        backgroundColor: isFound ? THEME.emerald : isActive ? THEME.orange : isHighlighted ? THEME.navy : THEME.white,
                        color: isFound || isActive || isHighlighted ? THEME.white : THEME.navy,
                        scale: isActive || isFound ? 1.3 : 1,
                        borderColor: isActive ? THEME.orange : THEME.navy
                      }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm md:text-base shadow-lg cursor-default relative overflow-hidden transition-colors duration-300"
                    >
                      <span className="relative z-10">{node.value}</span>
                      {isActive && <div className="absolute inset-0 bg-white/20 animate-ping" />}
                    </motion.div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* --- CONTROLS --- */}
        <div className="order-2 md:order-1 flex-none w-full md:w-80 bg-white/95 backdrop-blur-sm border-t md:border-t-0 md:border-r border-slate-200 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-none">
          <div className="p-4 md:p-6 flex flex-col gap-4">

            {/* Row 1: Input + DELETE Button */}
            <div className="flex gap-2 w-full">
              <input
                type="text" inputMode="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
                placeholder="Ex: 5, 20, 15"
                disabled={isProcessing}
                className="flex-1 min-w-0 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#12284C] font-mono text-base text-[#12284C]"
              />
              {/* DELETE BUTTON */}
              <Button onClick={handleDelete} disabled={isProcessing} variant="outline" size="icon" className="border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg w-12 shrink-0">
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Row 2 (Mobile): INSERT Button + Menu */}
            <div className="flex md:hidden items-center justify-between gap-2">
              {/* INSERT BUTTON */}
              <Button onClick={handleInputSubmit} disabled={isProcessing} className="flex-1 h-10 bg-[#12284C] text-white hover:bg-[#1e3a6b] font-semibold tracking-wide">
                {isProcessing ? <Pause className="w-4 h-4 mr-2 animate-pulse" /> : <Play className="w-4 h-4 mr-2" />}
                {isProcessing ? "Running" : "Insert"}
              </Button>
              <Button onClick={() => setShowExtras(!showExtras)} variant="ghost" className="h-10 px-3 text-slate-500 hover:bg-slate-100">
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Expanded Controls */}
            <div className={`${showExtras ? 'flex' : 'hidden'} md:flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200`}>

              {/* Desktop Insert Button */}
              <div className="hidden md:block">
                <Button onClick={handleInputSubmit} disabled={isProcessing} className="w-full bg-[#12284C] text-white hover:bg-[#1e3a6b]">
                  {isProcessing ? <Pause className="w-4 h-4 mr-2 animate-pulse" /> : <Play className="w-4 h-4 mr-2" />}
                  {isProcessing ? "Running" : "Insert Node"}
                </Button>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-[#12284C] uppercase tracking-wider">Traversals</label>
                <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
                  <Button onClick={() => handleTraversal('pre')} disabled={isProcessing} variant="secondary" className="h-8 md:h-9 text-[10px] md:text-sm md:justify-start bg-slate-50 hover:bg-slate-100 text-slate-700">
                    <span className="hidden md:inline-block w-2 h-2 rounded-full bg-red-400 mr-2"></span> Pre-Order
                  </Button>
                  <Button onClick={() => handleTraversal('in')} disabled={isProcessing} variant="secondary" className="h-8 md:h-9 text-[10px] md:text-sm md:justify-start bg-slate-50 hover:bg-slate-100 text-slate-700">
                    <span className="hidden md:inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span> In-Order
                  </Button>
                  <Button onClick={() => handleTraversal('post')} disabled={isProcessing} variant="secondary" className="h-8 md:h-9 text-[10px] md:text-sm md:justify-start bg-slate-50 hover:bg-slate-100 text-slate-700">
                    <span className="hidden md:inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2"></span> Post-Order
                  </Button>
                </div>
              </div>

              <div className="md:mt-auto pt-2">
                <Button onClick={handleReset} variant="outline" className="w-full border-slate-200 text-slate-500 h-8 md:h-9 text-xs md:text-sm">
                  <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-2" /> Reset
                </Button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}