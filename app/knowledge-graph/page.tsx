"use client"

import React, { useState, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Download,
  Share,
  Maximize,
  FileText,
  Tag,
  Users,
  Eye,
} from "lucide-react"

// Mock data for knowledge graph
const mockNodes = [
  { id: "doc1", label: "锅炉安全标准", type: "document", category: "safety", connections: 8 },
  { id: "doc2", label: "技术规范", type: "document", category: "technical", connections: 12 },
  { id: "doc3", label: "维护手册", type: "document", category: "maintenance", connections: 6 },
  { id: "concept1", label: "安全协议", type: "concept", category: "safety", connections: 15 },
  { id: "concept2", label: "温度控制", type: "concept", category: "technical", connections: 9 },
  { id: "concept3", label: "压力系统", type: "concept", category: "technical", connections: 11 },
  { id: "entity1", label: "A型锅炉", type: "entity", category: "equipment", connections: 7 },
  { id: "entity2", label: "控制系统", type: "entity", category: "equipment", connections: 5 },
  { id: "person1", label: "张伟", type: "person", category: "expert", connections: 4 },
  { id: "person2", label: "李明", type: "person", category: "expert", connections: 6 },
]

const mockConnections = [
  { from: "doc1", to: "concept1", strength: 0.9, type: "包含" },
  { from: "doc2", to: "concept2", strength: 0.8, type: "描述" },
  { from: "doc2", to: "concept3", strength: 0.7, type: "描述" },
  { from: "concept1", to: "entity1", strength: 0.6, type: "适用于" },
  { from: "concept2", to: "entity1", strength: 0.8, type: "控制" },
  { from: "concept3", to: "entity2", strength: 0.7, type: "管理" },
  { from: "doc3", to: "person1", strength: 0.5, type: "作者" },
  { from: "person1", to: "concept1", strength: 0.6, type: "专家领域" },
  { from: "person2", to: "concept2", strength: 0.7, type: "专家领域" },
]

const getNodeColor = (type: string) => {
  switch (type) {
    case "document":
      return "bg-primary text-primary-foreground"
    case "concept":
      return "bg-secondary text-secondary-foreground"
    case "entity":
      return "bg-accent text-accent-foreground"
    case "person":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case "document":
      return <FileText className="h-3 w-3" />
    case "concept":
      return <Tag className="h-3 w-3" />
    case "entity":
      return <Settings className="h-3 w-3" />
    case "person":
      return <Users className="h-3 w-3" />
    default:
      return <Network className="h-3 w-3" />
  }
}

export default function KnowledgeGraphPage() {
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [zoomLevel, setZoomLevel] = useState([100])
  const [layoutType, setLayoutType] = useState("force")
  const [showLabels, setShowLabels] = useState(true)
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({})
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartTime, setDragStartTime] = useState(0)
  const [isCanvasDragging, setIsCanvasDragging] = useState(false)
  const [canvasDragStart, setCanvasDragStart] = useState({ x: 0, y: 0 })
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const graphRef = useRef<HTMLDivElement>(null)

  const filteredNodes = mockNodes.filter((node) => {
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || node.type === filterType
    const matchesCategory = filterCategory === "all" || node.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  // Calculate node positions based on layout type
  const getNodePosition = (node: any, index: number) => {
    // Check if node has a custom dragged position
    if (nodePositions[node.id]) {
      return nodePositions[node.id]
    }

    const totalNodes = filteredNodes.length
    const centerX = 400
    const centerY = 300
    const radius = 200

    let position
    switch (layoutType) {
      case "circular":
        const angle = (2 * Math.PI * index) / totalNodes
        position = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        }
        break
      case "hierarchical":
        const level = Math.floor(index / 3)
        const levelIndex = index % 3
        position = {
          x: 200 + levelIndex * 300,
          y: 150 + level * 200
        }
        break
      case "grid":
        const cols = Math.ceil(Math.sqrt(totalNodes))
        const row = Math.floor(index / cols)
        const col = index % cols
        position = {
          x: 100 + col * 200,
          y: 100 + row * 150
        }
        break
      default: // force
        // Improved force-directed positioning
        const angleForce = (2 * Math.PI * index) / totalNodes + Math.random() * 0.5
        const radiusForce = 150 + Math.random() * 100
        position = {
          x: centerX + radiusForce * Math.cos(angleForce),
          y: centerY + radiusForce * Math.sin(angleForce)
        }
        break
    }

    // Store the calculated position
    if (!nodePositions[node.id]) {
      setNodePositions(prev => ({
        ...prev,
        [node.id]: position
      }))
    }

    return position
  }

  const handleNodeClick = (node: any) => {
    setSelectedNode(node)
  }

  // Drag event handlers
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    
    setDraggedNode(nodeId)
    setDragOffset({ x: offsetX, y: offsetY })
    setIsDragging(true)
    setDragStartTime(Date.now())
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode) return

    const graphRect = graphRef.current?.getBoundingClientRect()
    if (!graphRect) return

    const newX = e.clientX - graphRect.left - dragOffset.x
    const newY = e.clientY - graphRect.top - dragOffset.y

    setNodePositions(prev => ({
      ...prev,
      [draggedNode]: { x: newX, y: newY }
    }))
  }

  const handleMouseUp = () => {
    setDraggedNode(null)
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(false)
    setIsCanvasDragging(false)
  }

  // Canvas drag handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault()
      setIsCanvasDragging(true)
      setCanvasDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isCanvasDragging) {
      const deltaX = e.clientX - canvasDragStart.x
      const deltaY = e.clientY - canvasDragStart.y
      setCanvasOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      setCanvasDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Add global mouse events
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!draggedNode) return

      const graphRect = graphRef.current?.getBoundingClientRect()
      if (!graphRect) return

      const newX = e.clientX - graphRect.left - dragOffset.x
      const newY = e.clientY - graphRect.top - dragOffset.y

      setNodePositions(prev => ({
        ...prev,
        [draggedNode]: { x: newX, y: newY }
      }))
    }

    const handleGlobalMouseUp = () => {
      setDraggedNode(null)
      setDragOffset({ x: 0, y: 0 })
      setIsDragging(false)
    }

    if (draggedNode) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [draggedNode, dragOffset])

  const handleZoomIn = () => {
    setZoomLevel([Math.min(zoomLevel[0] + 25, 200)])
  }

  const handleZoomOut = () => {
    setZoomLevel([Math.max(zoomLevel[0] - 25, 25)])
  }

  const handleReset = () => {
    setZoomLevel([100])
    setSelectedNode(null)
    setNodePositions({}) // Reset all node positions
    setCanvasOffset({ x: 0, y: 0 }) // Reset canvas position
  }

  // Recalculate positions when layout changes
  const handleLayoutChange = (newLayout: string) => {
    setLayoutType(newLayout)
    setNodePositions({}) // Clear custom positions when changing layout
    // Force re-render by updating a dummy state
    setSelectedNode(selectedNode)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="知识图谱" subtitle="探索知识库中的关系和连接" />

        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Graph Visualization Area */}
            <div className="flex-1 flex flex-col">
              {/* Graph Controls */}
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索节点..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>

                    {/* Layout Type */}
                    <Select value={layoutType} onValueChange={handleLayoutChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="选择布局" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="force">力导向</SelectItem>
                        <SelectItem value="circular">环形</SelectItem>
                        <SelectItem value="hierarchical">层次</SelectItem>
                        <SelectItem value="grid">网格</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Show Labels Toggle */}
                    <div className="flex items-center space-x-2">
                      <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                      <span className="text-sm">标签</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Zoom Controls */}
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium w-12 text-center">{zoomLevel[0]}%</span>
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>

                    {/* Actions */}
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      导出
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="mr-2 h-4 w-4" />
                      分享
                    </Button>
                    <Button variant="outline" size="sm">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Graph Canvas */}
              <div className="flex-1 relative bg-muted/20" ref={graphRef}>
                <div
                  className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
                  style={{ 
                    transform: `scale(${zoomLevel[0] / 100}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`, 
                    transformOrigin: "center center" 
                  }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  {/* Mock Graph Visualization */}
                  <svg className="w-full h-full absolute inset-0 z-0">
                    {/* Arrow marker definitions */}
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#64748b"
                          opacity="0.8"
                        />
                      </marker>
                    </defs>
                    
                    {/* Connections */}
                    {mockConnections.map((connection, index) => {
                      const fromNode = filteredNodes.find((n) => n.id === connection.from)
                      const toNode = filteredNodes.find((n) => n.id === connection.to)
                      if (!fromNode || !toNode) return null

                      // Calculate positions based on filtered nodes
                      const fromIndex = filteredNodes.findIndex((n) => n.id === connection.from)
                      const toIndex = filteredNodes.findIndex((n) => n.id === connection.to)
                      
                      if (fromIndex === -1 || toIndex === -1) return null
                      
                      const fromPos = getNodePosition(fromNode, fromIndex)
                      const toPos = getNodePosition(toNode, toIndex)

                      const midX = (fromPos.x + toPos.x) / 2
                      const midY = (fromPos.y + toPos.y) / 2
                      
                      return (
                        <g key={`${connection.from}-${connection.to}`}>
                          <line
                            x1={fromPos.x}
                            y1={fromPos.y}
                            x2={toPos.x}
                            y2={toPos.y}
                            stroke="#64748b"
                            strokeWidth={Math.max(2, connection.strength * 4)}
                            strokeOpacity={0.8}
                            strokeDasharray={connection.type === "包含" ? "5,5" : "none"}
                            markerEnd="url(#arrowhead)"
                          />
                          <text
                            x={midX}
                            y={midY - 5}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#64748b"
                            className="pointer-events-none"
                          >
                            {connection.type}
                          </text>
                        </g>
                      )
                    })}
                  </svg>

                  {/* Nodes */}
                  <div className="absolute inset-0 z-10">
                    {filteredNodes.map((node, index) => {
                      // Calculate positions using the new algorithm
                      const position = getNodePosition(node, index)
                      const x = position.x
                      const y = position.y
                      const nodeIsDragging = draggedNode === node.id

                      return (
                        <div
                          key={node.id}
                          data-node-id={node.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move transition-all hover:scale-110 select-none ${
                            selectedNode?.id === node.id ? "ring-2 ring-primary" : ""
                          } ${nodeIsDragging ? "z-50 scale-110" : ""}`}
                          style={{ 
                            left: x, 
                            top: y
                          }}
                          onMouseDown={(e) => handleMouseDown(e, node.id)}
                          onClick={(e) => {
                            const clickTime = Date.now()
                            const timeDiff = clickTime - dragStartTime
                            if (!isDragging && !nodeIsDragging && timeDiff > 200) {
                              handleNodeClick(node)
                            }
                          }}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${getNodeColor(
                              node.type,
                            )} shadow-lg ${nodeIsDragging ? "shadow-2xl" : ""}`}
                          >
                            {getNodeIcon(node.type)}
                          </div>
                          {showLabels && (
                            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-xs font-medium text-center whitespace-nowrap bg-background/80 px-2 py-1 rounded shadow">
                              {node.label}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Graph Legend */}
                  <div className="absolute bottom-4 left-4 bg-background/90 p-4 rounded-lg shadow-lg">
                    <h4 className="font-medium text-sm mb-3">节点类型</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <span className="text-xs">文档</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-secondary"></div>
                        <span className="text-xs">概念</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-accent"></div>
                        <span className="text-xs">实体</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-muted"></div>
                        <span className="text-xs">人员</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l border-border bg-background">
              <Tabs defaultValue="details" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">详情</TabsTrigger>
                  <TabsTrigger value="filters">筛选</TabsTrigger>
                  <TabsTrigger value="stats">统计</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="flex-1 p-4">
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-serif font-bold text-lg">{selectedNode.label}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{selectedNode.type}</Badge>
                          <Badge variant="secondary">{selectedNode.category}</Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm">连接数</h4>
                          <p className="text-2xl font-bold text-primary">{selectedNode.connections}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">连接到</h4>
                          <ScrollArea className="h-32">
                            <div className="space-y-2">
                              {mockConnections
                                .filter((c) => c.from === selectedNode.id || c.to === selectedNode.id)
                                .map((connection, index) => {
                                  const connectedNodeId =
                                    connection.from === selectedNode.id ? connection.to : connection.from
                                  const connectedNode = mockNodes.find((n) => n.id === connectedNodeId)
                                  if (!connectedNode) return null

                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                                      onClick={() => handleNodeClick(connectedNode)}
                                    >
                                      <div className={`w-3 h-3 rounded-full ${getNodeColor(connectedNode.type)}`}></div>
                                      <span className="text-sm">{connectedNode.label}</span>
                                    </div>
                                  )
                                })}
                            </div>
                          </ScrollArea>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm">操作</h4>
                          <div className="flex flex-col space-y-2 mt-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              查看详情
                            </Button>
                            <Button variant="outline" size="sm">
                              <Network className="mr-2 h-4 w-4" />
                              展开网络
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share className="mr-2 h-4 w-4" />
                              分享节点
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Network className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">选择一个节点</h3>
                      <p className="mt-2 text-muted-foreground text-sm">点击图谱中的任意节点查看其详情和连接</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="filters" className="flex-1 p-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-sm mb-3">节点类型</h4>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有类型</SelectItem>
                          <SelectItem value="document">文档</SelectItem>
                          <SelectItem value="concept">概念</SelectItem>
                          <SelectItem value="entity">实体</SelectItem>
                          <SelectItem value="person">人员</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-3">分类</h4>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有分类</SelectItem>
                          <SelectItem value="safety">安全</SelectItem>
                          <SelectItem value="technical">技术</SelectItem>
                          <SelectItem value="maintenance">维护</SelectItem>
                          <SelectItem value="equipment">设备</SelectItem>
                          <SelectItem value="expert">专家</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-3">连接强度</h4>
                      <Slider value={[0.5]} max={1} min={0} step={0.1} className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>弱</span>
                        <span>强</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-3">可见性</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">显示孤立节点</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">显示连接标签</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">高亮集群</span>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="flex-1 p-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-sm mb-3">图谱统计</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">节点总数</span>
                          <span className="text-sm font-medium">{mockNodes.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">连接总数</span>
                          <span className="text-sm font-medium">{mockConnections.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">平均连接数</span>
                          <span className="text-sm font-medium">
                            {(mockConnections.length / mockNodes.length).toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">图谱密度</span>
                          <span className="text-sm font-medium">0.23</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-3">节点分布</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-sm">文档</span>
                          </div>
                          <span className="text-sm font-medium">
                            {mockNodes.filter((n) => n.type === "document").length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-secondary"></div>
                            <span className="text-sm">概念</span>
                          </div>
                          <span className="text-sm font-medium">
                            {mockNodes.filter((n) => n.type === "concept").length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-accent"></div>
                            <span className="text-sm">实体</span>
                          </div>
                          <span className="text-sm font-medium">
                            {mockNodes.filter((n) => n.type === "entity").length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-muted"></div>
                            <span className="text-sm">人员</span>
                          </div>
                          <span className="text-sm font-medium">
                            {mockNodes.filter((n) => n.type === "person").length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-3">连接最多</h4>
                      <div className="space-y-2">
                        {mockNodes
                          .sort((a, b) => b.connections - a.connections)
                          .slice(0, 5)
                          .map((node) => (
                            <div key={node.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getNodeColor(node.type)}`}></div>
                                <span className="text-sm truncate">{node.label}</span>
                              </div>
                              <span className="text-sm font-medium">{node.connections}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}