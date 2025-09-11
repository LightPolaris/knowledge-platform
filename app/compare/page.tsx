"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Upload,
  Download,
  GitCompare,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react"

export default function ComparePage() {
  const [leftFile, setLeftFile] = useState("")
  const [rightFile, setRightFile] = useState("")
  const [comparisonResult, setComparisonResult] = useState<any>(null)
  const [selectedChange, setSelectedChange] = useState<number | null>(null)
  const [leftScrollPosition, setLeftScrollPosition] = useState(0)
  const [rightScrollPosition, setRightScrollPosition] = useState(0)

  // Mock data for available files
  const availableFiles = [
    { id: 1, name: "Boiler Safety Standards v1.0.pdf", type: "PDF", size: "2.4 MB", lastModified: "2024-01-10" },
    { id: 2, name: "Boiler Safety Standards v2.0.pdf", type: "PDF", size: "2.6 MB", lastModified: "2024-01-15" },
    { id: 3, name: "Technical Specifications.docx", type: "Word", size: "1.8 MB", lastModified: "2024-01-12" },
    { id: 4, name: "Maintenance Schedule.xlsx", type: "Excel", size: "856 KB", lastModified: "2024-01-13" },
  ]

  // Mock file content
  const mockFileContent = {
    left: [
      "锅炉安全标准 v1.0",
      "",
      "第一章 总则",
      "1.1 适用范围",
      "本标准适用于工业锅炉的安全管理。",
      "",
      "第二章 安全要求",
      "2.1 基本安全要求",
      "锅炉操作人员必须经过专业培训。",
      "锅炉房应保持通风良好。",
      "定期检查锅炉运行状态。",
      "",
      "第三章 维护流程",
      "3.1 日常维护",
      "每日检查水位和压力。",
      "每周清洁锅炉表面。",
      "每月检查安全阀。",
      "",
      "第四章 技术规格",
      "4.1 基本参数",
      "额定蒸发量：50 t/h",
      "工作压力：1.6 MPa",
      "蒸汽温度：200°C",
      "",
      "第五章 故障处理",
      "5.1 常见故障",
      "水位异常时立即停炉。",
      "压力过高时检查安全阀。",
    ],
    right: [
      "锅炉安全标准 v2.0",
      "",
      "第一章 总则",
      "1.1 适用范围",
      "本标准适用于工业锅炉的安全管理。",
      "",
      "第二章 安全要求",
      "2.1 基本安全要求",
      "锅炉操作人员必须经过专业培训。",
      "锅炉房应保持通风良好。",
      "定期检查锅炉运行状态。",
      "2.2 温度监控系统要求",
      "新增温度监控系统要求",
      "实时监控锅炉各部位温度。",
      "温度异常时自动报警。",
      "",
      "第三章 维护流程",
      "3.1 日常维护",
      "每日检查水位和压力。",
      "每月检查安全阀。",
      "",
      "第四章 技术规格",
      "4.1 基本参数",
      "额定蒸发量：50 t/h",
      "工作压力：1.8 MPa",
      "蒸汽温度：204°C",
      "",
      "第五章 故障处理",
      "5.1 常见故障",
      "水位异常时立即停炉。",
      "压力过高时检查安全阀。",
    ]
  }

  const handleCompare = () => {
    if (!leftFile || !rightFile) return

    // Mock comparison result
    setComparisonResult({
      summary: {
        totalChanges: 15,
        additions: 8,
        deletions: 5,
        modifications: 2,
      },
      changes: [
        {
          type: "addition",
          section: "安全要求",
          content: "新增温度监控系统要求",
          line: 12,
          leftLine: null,
          rightLine: 12,
        },
        {
          type: "addition",
          section: "安全要求",
          content: "实时监控锅炉各部位温度",
          line: 13,
          leftLine: null,
          rightLine: 13,
        },
        {
          type: "addition",
          section: "安全要求",
          content: "温度异常时自动报警",
          line: 14,
          leftLine: null,
          rightLine: 14,
        },
        {
          type: "deletion",
          section: "维护流程",
          content: "每周清洁锅炉表面",
          line: 18,
          leftLine: 18,
          rightLine: null,
        },
        {
          type: "modification",
          section: "技术规格",
          content: "工作压力：1.6 MPa → 1.8 MPa",
          line: 25,
          leftLine: 25,
          rightLine: 25,
        },
        {
          type: "modification",
          section: "技术规格",
          content: "蒸汽温度：200°C → 204°C",
          line: 26,
          leftLine: 26,
          rightLine: 26,
        },
      ],
    })
  }

  const handleChangeClick = (changeIndex: number) => {
    setSelectedChange(changeIndex)
    const change = comparisonResult.changes[changeIndex]
    
    // 模拟滚动到指定行
    if (change.leftLine) {
      setLeftScrollPosition(change.leftLine * 20) // 假设每行20px高度
    }
    if (change.rightLine) {
      setRightScrollPosition(change.rightLine * 20)
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "addition":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "deletion":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "modification":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="文件对比" subtitle="比较文档版本差异和变更内容" />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* File Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center">
                  <GitCompare className="mr-2 h-5 w-5" />
                  选择要对比的文件
                </CardTitle>
                <CardDescription>选择两个文档进行版本对比分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left File */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">原始文件</h3>
                    <Select value={leftFile} onValueChange={setLeftFile}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择文件..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFiles.map((file) => (
                          <SelectItem key={file.id} value={file.id.toString()}>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>{file.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {leftFile && (
                      <div className="p-3 border rounded-lg bg-muted/30">
                        {(() => {
                          const file = availableFiles.find(f => f.id.toString() === leftFile)
                          return file ? (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{file.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div>类型: {file.type}</div>
                                <div>大小: {file.size}</div>
                                <div>修改时间: {file.lastModified}</div>
                              </div>
                            </div>
                          ) : null
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Compare Button */}
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={handleCompare}
                      disabled={!leftFile || !rightFile}
                      className="px-8"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      开始对比
                    </Button>
                  </div>

                  {/* Right File */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">对比文件</h3>
                    <Select value={rightFile} onValueChange={setRightFile}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择文件..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFiles.map((file) => (
                          <SelectItem key={file.id} value={file.id.toString()}>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>{file.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {rightFile && (
                      <div className="p-3 border rounded-lg bg-muted/30">
                        {(() => {
                          const file = availableFiles.find(f => f.id.toString() === rightFile)
                          return file ? (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{file.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div>类型: {file.type}</div>
                                <div>大小: {file.size}</div>
                                <div>修改时间: {file.lastModified}</div>
                              </div>
                            </div>
                          ) : null
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Results */}
            {comparisonResult && (
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">对比摘要</CardTitle>
                    <CardDescription>版本变更统计</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{comparisonResult.summary.totalChanges}</div>
                        <div className="text-xs text-muted-foreground">总变更</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{comparisonResult.summary.additions}</div>
                        <div className="text-xs text-muted-foreground">新增</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{comparisonResult.summary.deletions}</div>
                        <div className="text-xs text-muted-foreground">删除</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{comparisonResult.summary.modifications}</div>
                        <div className="text-xs text-muted-foreground">修改</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Three-panel comparison view */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left File Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-sm">A文件预览</CardTitle>
                      <CardDescription>
                        {availableFiles.find(f => f.id.toString() === leftFile)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-muted/20">
                        <div className="space-y-1 font-mono text-sm">
                          {mockFileContent.left.map((line, index) => {
                            const change = comparisonResult.changes.find((c: any) => c.leftLine === index + 1)
                            return (
                              <div
                                key={index}
                                className={`px-2 py-1 rounded ${
                                  change?.type === "deletion" ? "bg-red-100 text-red-800" :
                                  change?.type === "modification" ? "bg-yellow-100 text-yellow-800" :
                                  "text-gray-700"
                                }`}
                              >
                                <span className="text-gray-400 mr-2">{String(index + 1).padStart(2, '0')}</span>
                                {line}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right File Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-sm">B文件预览</CardTitle>
                      <CardDescription>
                        {availableFiles.find(f => f.id.toString() === rightFile)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-muted/20">
                        <div className="space-y-1 font-mono text-sm">
                          {mockFileContent.right.map((line, index) => {
                            const change = comparisonResult.changes.find((c: any) => c.rightLine === index + 1)
                            return (
                              <div
                                key={index}
                                className={`px-2 py-1 rounded ${
                                  change?.type === "addition" ? "bg-green-100 text-green-800" :
                                  change?.type === "modification" ? "bg-yellow-100 text-yellow-800" :
                                  "text-gray-700"
                                }`}
                              >
                                <span className="text-gray-400 mr-2">{String(index + 1).padStart(2, '0')}</span>
                                {line}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Differences Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-sm">差异对比</CardTitle>
                      <CardDescription>点击差异项定位到具体位置</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 overflow-y-auto">
                        <div className="space-y-3">
                          {comparisonResult.changes.map((change: any, index: number) => (
                            <div
                              key={index}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedChange === index 
                                  ? "border-primary bg-primary/5" 
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() => handleChangeClick(index)}
                            >
                              <div className="flex items-start space-x-3">
                                {getChangeIcon(change.type)}
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm">{change.section}</h4>
                                    <Badge variant={
                                      change.type === "addition" ? "default" :
                                      change.type === "deletion" ? "destructive" :
                                      "secondary"
                                    }>
                                      {change.type === "addition" ? "新增" :
                                       change.type === "deletion" ? "删除" : "修改"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{change.content}</p>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    {change.leftLine && `A文件第${change.leftLine}行`}
                                    {change.leftLine && change.rightLine && " | "}
                                    {change.rightLine && `B文件第${change.rightLine}行`}
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Actions */}
            {comparisonResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">操作</CardTitle>
                  <CardDescription>导出对比结果或执行其他操作</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      导出对比报告
                    </Button>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      保存对比结果
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
