"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FileText, ArrowLeft, Save, Loader2, Plus, Link as LinkIcon, Trash2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import MiniKnowledgeGraph from "@/components/knowledge-graph/mini-graph"

const mockDocuments: Record<string, { id: string; title: string; content: string; fileSize?: string }> = {
  "1": {
    id: "1",
    title: "GB/T16507-2022 水管锅炉",
    content: `# GB/T16507-2022 水管锅炉\n\n本标准规定了水管锅炉的技术要求、设计规范和安全标准。...`,
    fileSize: "2.8 MB",
  },
  "2": {
    id: "2",
    title: "ASME BPVC.1 锅炉压力容器规范",
    content: `# ASME BPVC.1 锅炉压力容器规范\n\nThis standard covers the design, fabrication, inspection...`,
    fileSize: "1.9 MB",
  },
}

export default function KnowledgeEditPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [graphText, setGraphText] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const id = String(params.id)
    setTimeout(() => {
      const doc = mockDocuments[id]
      setTitle(doc?.title || `文档 ${id}`)
      // 以文档内容初始生成一个简单的知识点占位
      setGraphText(`实体: ${doc?.title || `文档 ${id}`}\n关系: 参考/引用/包含（示例）`)
      setIsLoading(false)
    }, 300)
  }, [params.id])

  const handleBack = () => router.back()

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    alert("已保存知识图谱（示例）")
  }

  // 编辑栏占位操作（后续可与图组件联动）
  const handleAddNode = () => alert("新增节点（示例占位）")
  const handleAddEdge = () => alert("连接关系（示例占位）")
  const handleDelete = () => alert("删除所选（示例占位）")
  const handleZoomIn = () => alert("放大（示例占位）")
  const handleZoomOut = () => alert("缩小（示例占位）")
  const handleReset = () => alert("重置布局（示例占位）")

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="知识图谱编辑" subtitle="加载中..." />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </main>
        </div>
      </div>
    )
  }

  const pdfUrl = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="知识图谱编辑" subtitle={title} />

        <main className="flex-1 overflow-hidden p-2">
          <div className="max-w-7xl mx-auto h-full flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-1" /> 返回
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  保存
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[calc(100vh-160px)]">
              {/* 左侧：知识图谱（可编辑占位） */}
              <Card className="h-full py-2">
                <CardHeader className="py-1 px-3">
                  <CardTitle className="text-base">知识图谱</CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-40px)] p-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Button variant="outline" size="sm" onClick={handleAddNode}>
                      <Plus className="h-4 w-4 mr-1" /> 新增
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleAddEdge}>
                      <LinkIcon className="h-4 w-4 mr-1" /> 连接
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-1" /> 删除
                    </Button>
                    <div className="ml-auto flex items-center gap-1.5">
                      <Button variant="outline" size="sm" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                        保存
                      </Button>
                    </div>
                  </div>
                  <div className="h-[calc(100%-40px)] w-full border rounded-md bg-muted/30">
                    <MiniKnowledgeGraph />
                  </div>
                </CardContent>
              </Card>

              {/* 右侧：原文PDF 预览 */}
              <Card className="h-full py-2">
                <CardHeader className="py-1 px-3">
                  <CardTitle className="text-base">原文档预览（PDF）</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-40px)] overflow-hidden rounded-b-xl">
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-0"
                    title="PDF文档预览"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
