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

  // Mock data for available files
  const availableFiles = [
    { id: 1, name: "Boiler Safety Standards v1.0.pdf", type: "PDF", size: "2.4 MB", lastModified: "2024-01-10" },
    { id: 2, name: "Boiler Safety Standards v2.0.pdf", type: "PDF", size: "2.6 MB", lastModified: "2024-01-15" },
    { id: 3, name: "Technical Specifications.docx", type: "Word", size: "1.8 MB", lastModified: "2024-01-12" },
    { id: 4, name: "Maintenance Schedule.xlsx", type: "Excel", size: "856 KB", lastModified: "2024-01-13" },
  ]

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
          line: 45,
        },
        {
          type: "deletion",
          section: "维护流程",
          content: "删除过时的维护步骤",
          line: 78,
        },
        {
          type: "modification",
          section: "技术规格",
          content: "更新锅炉压力参数",
          line: 123,
        },
      ],
    })
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">对比摘要</CardTitle>
                    <CardDescription>版本变更统计</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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

                {/* Changes List */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="font-serif">变更详情</CardTitle>
                    <CardDescription>具体的变更内容和位置</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comparisonResult.changes.map((change: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
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
                            <div className="text-xs text-muted-foreground mt-2">第 {change.line} 行</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
