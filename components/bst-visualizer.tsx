"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BinarySearchTree, type TreeNode } from "@/lib/bst"
import { Button } from "@/components/ui/button"

interface NodePosition {
  x: number
  y: number
  value: number
}

interface TreeNodeWithPos extends TreeNode {
  x?: number
  y?: number
}

export function BSTVisualizer() {
  const [bst] = useState(() => new BinarySearchTree())
  const [nodes, setNodes] = useState<NodePosition[]>([])
  const [input, setInput] = useState("")
  const [animatingNodes, setAnimatingNodes] = useState<Set<number>>(new Set())
  const [highlightedPath, setHighlightedPath] = useState<Set<number>>(new Set())
  const [speed, setSpeed] = useState(1)
  const [preorderResult, setPreorderResult] = useState<number[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")
  const animationTimeoutRef = useRef<NodeJS.Timeout>()

  // Calculate positions for tree nodes
  const calculatePositions = useCallback(
    (node: TreeNode | null, x: number, y: number, offset: number, positions: NodePosition[] = []) => {
      if (!node) return positions

      positions.push({ x, y, value: node.value })

      const nextOffset = offset / 2
      if (node.left) {
        calculatePositions(node.left, x - offset, y + 80, nextOffset, positions)
      }
      if (node.right) {
        calculatePositions(node.right, x + offset, y + 80, nextOffset, positions)
      }

      return positions
    },
    [],
  )

  // Update visualization when tree changes
  const updateVisualization = useCallback(() => {
    const positions = calculatePositions(bst.root, 300, 40, 100)
    setNodes(positions)
    setAnimatingNodes(new Set())
    setHighlightedPath(new Set())
  }, [bst, calculatePositions])

  // Handle insert with animation
  const handleInsert = useCallback(async () => {
    const value = Number.parseInt(input)
    if (isNaN(value)) return

    // Clear any previous error
    setErrorMessage("")

    // Highlight path while inserting
    const path = new Set<number>()
    let current = bst.root

    while (current) {
      path.add(current.value)
      setHighlightedPath(new Set(path))
      await new Promise((resolve) => setTimeout(resolve, 500 / speed))

      if (value === current.value) {
        // Duplicate found - show error
        setErrorMessage(`Cannot add ${value}. This element already exists in the tree.`)
        setHighlightedPath(new Set())
        return
      } else if (value < current.value) {
        current = current.left || null
      } else {
        current = current.right || null
      }
    }

    // Insert the node
    const inserted = bst.insert(value)
    if (!inserted) {
      setErrorMessage(`Cannot add ${value}. This element already exists in the tree.`)
      setHighlightedPath(new Set())
      return
    }

    setAnimatingNodes(new Set([value]))

    await new Promise((resolve) => setTimeout(resolve, 300 / speed))
    updateVisualization()
    setInput("")
  }, [input, bst, speed, updateVisualization])

  // Handle delete
  const handleDelete = useCallback(async () => {
    const value = Number.parseInt(input)
    if (isNaN(value)) return

    bst.delete(value)
    updateVisualization()
    setInput("")
  }, [input, bst, updateVisualization])

  // Handle find
  const handleFind = useCallback(async () => {
    const value = Number.parseInt(input)
    if (isNaN(value)) return

    const path = new Set<number>()
    let current = bst.root
    let found = false

    while (current) {
      path.add(current.value)
      setHighlightedPath(new Set(path))
      await new Promise((resolve) => setTimeout(resolve, 400 / speed))

      if (current.value === value) {
        found = true
        setAnimatingNodes(new Set([value]))
        break
      }

      if (value < current.value) current = current.left || null
      else current = current.right || null
    }

    if (!found) {
      setHighlightedPath(new Set())
    }
  }, [input, bst, speed])

  // Handle print (pre-order traversal)
  const handlePrint = useCallback(() => {
    const result = bst.getPreOrder()
    setPreorderResult(result)
  }, [bst])

  // Get edges for SVG rendering
  const getEdges = useCallback(() => {
    const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = []

    const traverse = (node: TreeNode | null) => {
      if (!node) return

      const parentPos = nodes.find((n) => n.value === node.value)
      if (!parentPos) return

      if (node.left) {
        const leftPos = nodes.find((n) => n.value === node.left!.value)
        if (leftPos) {
          edges.push({ x1: parentPos.x, y1: parentPos.y, x2: leftPos.x, y2: leftPos.y })
        }
        traverse(node.left)
      }

      if (node.right) {
        const rightPos = nodes.find((n) => n.value === node.right!.value)
        if (rightPos) {
          edges.push({ x1: parentPos.x, y1: parentPos.y, x2: rightPos.x, y2: rightPos.y })
        }
        traverse(node.right)
      }
    }

    traverse(bst.root)
    return edges
  }, [nodes, bst.root])

  return (
    <div className="flex flex-col h-screen bg-white gap-6 p-6">
      {/* Header */}
      <header className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-green-700">BST Visualizer</h1>
      </header>

      {/* Control Center */}
      <div className="flex items-center gap-4 bg-green-50 rounded-3xl p-6 shadow-sm">
        {/* Input Field */}
        <div className="flex-1 max-w-xs">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleInsert()}
            placeholder="Enter value"
            className="w-full px-4 py-3 rounded-2xl border-2 border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-foreground"
          />
        </div>

        {/* Action Buttons */}
        <Button onClick={handleInsert} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
          Insert
        </Button>
        <Button onClick={handleDelete} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
          Delete
        </Button>
        <Button onClick={handleFind} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
          Find
        </Button>

        {/* Outlined Buttons */}
        <Button
          onClick={handlePrint}
          variant="outline"
          className="border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-full px-6 bg-transparent"
        >
          Print
        </Button>

        {/* Speed Slider */}
        <div className="flex items-center gap-3 ml-4">
          <label className="text-sm font-medium text-green-700">Speed:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number.parseFloat(e.target.value))}
            className="w-24 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-white rounded-3xl shadow-sm overflow-hidden border border-green-100">
        <svg className="absolute inset-0 w-full h-full">
          {/* Draw edges */}
          {getEdges().map((edge, i) => (
            <line
              key={i}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="#22c55e"
              strokeWidth="2"
              opacity="0.3"
            />
          ))}
        </svg>

        {/* Render nodes */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {nodes.map((node) => {
              const isAnimating = animatingNodes.has(node.value)
              const isHighlighted = highlightedPath.has(node.value)

              return (
                <motion.div
                  key={node.value}
                  initial={isAnimating ? { scale: 0, opacity: 0 } : { scale: 1 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 / speed }}
                  style={{
                    position: "absolute",
                    left: node.x - 20,
                    top: node.y - 20,
                  }}
                  className="pointer-events-auto"
                >
                  <motion.div
                    animate={isHighlighted ? { scale: 1.15 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-default ${isHighlighted
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-white border-2 border-green-600 text-green-700"
                      }`}
                  >
                    {node.value}
                  </motion.div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 rounded-3xl p-4 shadow-sm border-2 border-red-200">
          <p className="text-sm font-medium text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Output Area */}
      {preorderResult.length > 0 && (
        <div className="bg-green-50 rounded-3xl p-4 shadow-sm">
          <p className="text-sm font-medium text-green-700 mb-2">Pre-order Traversal:</p>
          <p className="text-foreground font-mono">{preorderResult.join(" → ")}</p>
        </div>
      )}
    </div>
  )
}
