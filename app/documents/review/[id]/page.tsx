"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Save,
  Download,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  FileText,
  File,
  Clock,
  User,
  Calendar,
} from "lucide-react"

// Mock data for document review
const mockDocumentData: Record<number, any> = {
  1: {
    id: 1,
    name: "锅炉安全标准 2024.pdf",
    originalPdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    parsedMarkdown: `# 锅炉安全标准 2024

## 概述
本标准规定了锅炉设备的安全操作、维护和检验要求。

## 安全要求
- 操作人员必须持证上岗
- 定期进行安全培训
- 严格执行操作规程

## 维护保养
- 每日检查设备状态
- 定期更换易损件
- 保持设备清洁`,
    status: "已解析未审核",
    uploadedBy: "张伟",
    uploadDate: "2024-01-15",
    category: "机械安全",
    size: "2.4 MB",
    type: "PDF"
  },
  2: {
    id: 2,
    name: "技术规格说明书.docx",
    originalPdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    parsedMarkdown: `# 技术规格说明书

## 设备概述
本设备为高性能工业设备，具有以下特点：
- 高效率
- 低能耗
- 易维护

## 技术参数
- 功率：100kW
- 电压：380V
- 频率：50Hz`,
    status: "已解析未审核",
    uploadedBy: "李明",
    uploadDate: "2024-01-14",
    category: "设备规格",
    size: "1.8 MB",
    type: "Word"
  },
  69: {
    id: 69,
    name: "会议纪要 2024-01-19.pdf",
    originalPdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    parsedMarkdown: `# 会议纪要

## 会议基本信息
- **会议主题**: 项目进度讨论
- **会议时间**: 2024年1月19日 14:00-16:00
- **会议地点**: 会议室A
- **主持人**: 张经理
- **参会人员**: 李工程师、王秘书、陈主管、刘采购

## 会议议程

### 1. 项目进度汇报
- 当前项目完成度：75%
- 主要里程碑已达成
- 下一阶段目标：完成剩余25%的工作

### 2. 技术问题讨论
- 设备配置问题已解决
- 需要进一步优化性能
- 建议增加测试用例

### 3. 资源分配
- 人力资源充足
- 预算使用正常
- 需要采购新的测试设备

## 决议事项

1. **技术优化**: 由李工程师负责，预计2周内完成
2. **设备采购**: 刘采购负责，预算5万元
3. **测试计划**: 陈主管制定详细测试方案

## 下次会议
- 时间：2024年1月26日 14:00
- 地点：会议室A
- 议题：技术优化进展汇报

---
*会议记录人：王秘书*`,
    status: "已解析未审核",
    uploadedBy: "王秘书",
    uploadDate: "2024-01-19",
    category: "会议记录",
    size: "856 KB",
    type: "PDF"
  },
  70: {
    id: 70,
    name: "设备故障报告.xlsx",
    originalPdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    parsedMarkdown: `# 设备故障报告

## 故障概述
设备编号：EQ-001
故障时间：2024-01-18 10:30
故障类型：电气故障

## 故障现象
- 设备无法启动
- 指示灯不亮
- 无电源输出

## 处理措施
1. 立即断电
2. 检查电源线路
3. 更换损坏部件

## 预防措施
- 加强日常巡检
- 定期维护保养
- 建立故障档案`,
    status: "已导入未审核",
    uploadedBy: "张技师",
    uploadDate: "2024-01-18",
    category: "设备维护",
    size: "1.5 MB",
    type: "Excel"
  },
  71: {
    id: 71,
    name: "新员工培训资料.pptx",
    originalPdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    parsedMarkdown: `# 新员工培训资料

## 培训目标
- 了解公司文化
- 掌握基本技能
- 熟悉工作流程

## 培训内容
### 第一天：公司介绍
- 公司历史
- 组织架构
- 企业文化

### 第二天：岗位培训
- 工作职责
- 操作规范
- 安全要求

### 第三天：实践操作
- 实际操作
- 问题解答
- 考核评估`,
    status: "未解析",
    uploadedBy: "陈主管",
    uploadDate: "2024-01-17",
    category: "培训资料",
    size: "3.2 MB",
    type: "PowerPoint"
  },
  72: {
    id: 72,
    name: "供应商评估表.pdf",
    originalPdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    parsedMarkdown: `# 供应商评估表

## 供应商基本信息
- 公司名称：XX科技有限公司
- 联系人：李经理
- 联系电话：138-0000-0000

## 评估项目
### 质量能力 (40%)
- 产品质量：优秀
- 质量管理体系：完善
- 质量认证：ISO9001

### 交付能力 (30%)
- 交期准确性：良好
- 交付及时性：优秀
- 库存管理：完善

### 服务能力 (20%)
- 技术支持：优秀
- 售后服务：良好
- 响应速度：快速

### 价格竞争力 (10%)
- 价格水平：合理
- 性价比：高
- 付款条件：灵活

## 综合评分
总分：85分
评级：A级
建议：继续合作`,
    status: "已解析已审核",
    uploadedBy: "刘采购",
    uploadDate: "2024-01-16",
    category: "采购管理",
    size: "2.1 MB",
    type: "PDF"
  },
  27: {
    id: 27,
    name: "技术交流会议记录.docx",
    originalPdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    parsedMarkdown: `# 技术交流会议记录

## 会议信息
- 时间：2024年1月14日
- 地点：技术部会议室
- 主持人：技术总监

## 讨论议题
1. 新技术应用
2. 设备升级方案
3. 技术培训计划

## 决议
- 采用新技术方案
- 制定升级时间表
- 安排培训课程`,
    status: "已解析未审核",
    uploadedBy: "孙工程师",
    uploadDate: "2024-01-14",
    category: "技术交流",
    size: "1.4 MB",
    type: "Word"
  },
  28: {
    id: 28,
    name: "设备运行数据.txt",
    originalPdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    parsedMarkdown: `# 设备运行数据

## 运行参数
- 温度：75°C
- 压力：2.5MPa
- 流量：100L/min
- 功率：50kW

## 运行状态
- 正常
- 稳定
- 高效

## 维护记录
- 上次维护：2024-01-10
- 下次维护：2024-02-10
- 维护人员：张技师`,
    status: "未解析",
    uploadedBy: "周操作员",
    uploadDate: "2024-01-13",
    category: "运行数据",
    size: "512 KB",
    type: "Text"
  }
}

export default function DocumentReviewPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const documentId = params.id as string
  
  const [document, setDocument] = useState<any>(null)
  const [markdownContent, setMarkdownContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [pdfError, setPdfError] = useState(false)

  useEffect(() => {
    // 模拟获取文档数据
    const docData = mockDocumentData[documentId as keyof typeof mockDocumentData]
    if (docData) {
      setDocument(docData)
      setMarkdownContent(docData.parsedMarkdown)
    } else {
      toast({
        title: "文档不存在",
        description: "未找到指定的文档",
        variant: "destructive"
      })
      router.push("/documents")
    }
  }, [documentId, router, toast])

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault()
            if (isEditing && hasChanges) {
              handleSave()
            }
            break
          case 'e':
            event.preventDefault()
            setIsEditing(!isEditing)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, hasChanges])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setHasChanges(false)
      setIsEditing(false)
      
      toast({
        title: "保存成功",
        description: "Markdown内容已保存"
      })
    } catch (error) {
      toast({
        title: "保存失败",
        description: "请重试",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleApprove = async () => {
    try {
      // 模拟审核通过操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "审核通过",
        description: "文档已通过审核"
      })
      
      router.push("/documents")
    } catch (error) {
      toast({
        title: "操作失败",
        description: "请重试",
        variant: "destructive"
      })
    }
  }

  const handleReject = async () => {
    try {
      // 模拟审核拒绝操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "审核拒绝",
        description: "文档已标记为需要重新解析"
      })
      
      router.push("/documents")
    } catch (error) {
      toast({
        title: "操作失败",
        description: "请重试",
        variant: "destructive"
      })
    }
  }

  const handleMarkdownChange = (value: string) => {
    setMarkdownContent(value)
    setHasChanges(true)
  }


  if (!document) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="文档审核" subtitle="审核解析后的文档内容" />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">加载中...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="文档审核" subtitle="审核解析后的文档内容" />
        
        <main className="flex-1 overflow-auto">
          <div className="min-h-full flex flex-col">
            {/* 文档信息头部 */}
            <div className="flex-shrink-0 p-6 pb-4">
              <Card>
                <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/documents")}
                      className="h-8"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      返回
                    </Button>
                    <div>
                      <CardTitle className="text-lg">{document.name}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{document.type} • {document.size}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{document.uploadedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{document.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {document.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="h-8"
                      title={isEditing ? "切换到预览模式 (Ctrl+E)" : "切换到编辑模式 (Ctrl+E)"}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? "预览" : "编辑"}
                    </Button>
                    {isEditing && hasChanges && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-8"
                        title="保存更改 (Ctrl+S)"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "保存中..." : "保存"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              </Card>
            </div>

            {/* 主要内容区域 */}
            <div className="flex-1 px-6 pb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
                {/* 左侧：PDF原文 */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <CardTitle className="text-base flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      PDF原文
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-4">
                  <div className="h-full border rounded-lg bg-muted/50">
                    {pdfError ? (
                      <div className="h-full flex items-center justify-center text-center p-8">
                        <div>
                          <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground mb-2">PDF加载失败</p>
                          <p className="text-sm text-muted-foreground">无法加载PDF文档，请检查网络连接或文档链接</p>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        src={`${document.originalPdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                        className="w-full h-full border-0 rounded-lg"
                        title="PDF文档预览"
                        onError={() => setPdfError(true)}
                      />
                    )}
                  </div>
                  </CardContent>
                </Card>

                {/* 右侧：解析后的Markdown */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <CardTitle className="text-base flex items-center">
                      <Edit3 className="h-4 w-4 mr-2" />
                      解析后的Markdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-4">
                  {isEditing ? (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-2 p-2 bg-muted/50 rounded-t-lg border-b">
                        <span className="text-xs text-muted-foreground">Markdown编辑器</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {markdownContent.length} 字符
                          </span>
                        </div>
                      </div>
                      <Textarea
                        value={markdownContent}
                        onChange={(e) => handleMarkdownChange(e.target.value)}
                        className="flex-1 resize-none font-mono text-sm border-0 rounded-t-none focus:ring-0"
                        placeholder="编辑Markdown内容..."
                      />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-2 p-2 bg-muted/50 rounded-t-lg border-b">
                        <span className="text-xs text-muted-foreground">Markdown预览</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {markdownContent.length} 字符
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto p-4 bg-background rounded-b-lg border">
                        <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                          {markdownContent}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              </div>
            </div>

            {/* 底部操作按钮 */}
            <div className="flex-shrink-0 p-6 pt-0">
              <Card>
                <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {hasChanges && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="h-8"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? "保存中..." : "保存"}
                        </Button>
                        <span className="text-sm text-muted-foreground">有未保存的更改</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleReject}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      拒绝
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      通过审核
                    </Button>
                  </div>
                </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
