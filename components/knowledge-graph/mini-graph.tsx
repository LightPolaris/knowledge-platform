"use client"

import React, { useEffect, useRef, useState } from "react"

type NodeType = "document" | "concept" | "entity" | "person"

const mockNodes = [
  { id: "doc1", label: "锅炉安全标准", type: "document" as NodeType },
  { id: "doc2", label: "技术规范", type: "document" as NodeType },
  { id: "doc3", label: "维护手册", type: "document" as NodeType },
  { id: "concept1", label: "安全协议", type: "concept" as NodeType },
  { id: "concept2", label: "温度控制", type: "concept" as NodeType },
  { id: "concept3", label: "压力系统", type: "concept" as NodeType },
  { id: "entity1", label: "A型锅炉", type: "entity" as NodeType },
  { id: "entity2", label: "控制系统", type: "entity" as NodeType },
]

const mockConnections = [
  { from: "doc1", to: "concept1", type: "包含" },
  { from: "doc2", to: "concept2", type: "描述" },
  { from: "doc2", to: "concept3", type: "描述" },
  { from: "concept1", to: "entity1", type: "适用于" },
  { from: "concept2", to: "entity1", type: "控制" },
  { from: "concept3", to: "entity2", type: "管理" },
]

const getNodeColor = (type: NodeType) => {
  switch (type) {
    case "document":
      return "bg-primary text-primary-foreground"
    case "concept":
      return "bg-secondary text-secondary-foreground"
    case "entity":
      return "bg-accent text-accent-foreground"
    case "person":
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function MiniKnowledgeGraph() {
  const graphRef = useRef<HTMLDivElement>(null)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [dragged, setDragged] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // 初始环形布局
    const rect = graphRef.current?.getBoundingClientRect()
    const w = rect?.width || 800
    const h = rect?.height || 500
    const cx = w / 2
    const cy = h / 2
    const r = Math.min(w, h) / 3
    const next: Record<string, { x: number; y: number }> = {}
    mockNodes.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / mockNodes.length
      next[n.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
    })
    setPositions(next)
  }, [])

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    setDragged(id)
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragged || !graphRef.current) return
    const rect = graphRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y
    setPositions((prev) => ({ ...prev, [dragged]: { x, y } }))
  }

  const handleMouseUp = () => setDragged(null)

  return (
    <div
      ref={graphRef}
      className="relative w-full h-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <marker id="arrowhead-mini" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" opacity="0.9" />
          </marker>
        </defs>
        {mockConnections.map((c, idx) => {
          const from = positions[c.from]
          const to = positions[c.to]
          if (!from || !to) return null
          return (
            <g key={idx}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#94a3b8"
                strokeWidth={2}
                markerEnd="url(#arrowhead-mini)"
                strokeOpacity={0.8}
              />
            </g>
          )
        })}
      </svg>

      {mockNodes.map((n) => {
        const p = positions[n.id]
        if (!p) return null
        return (
          <div
            key={n.id}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-move select-none ${getNodeColor(n.type)} w-10 h-10 rounded-full flex items-center justify-center shadow`}
            style={{ left: p.x, top: p.y }}
            onMouseDown={(e) => handleMouseDown(e, n.id)}
          >
            <span className="text-xs font-medium">{n.label.slice(0, 2)}</span>
          </div>
        )
      })}
    </div>
  )
}
