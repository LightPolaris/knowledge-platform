"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  Share,
  Bookmark,
  Eye,
  Calendar,
  User,
  FileText,
  Tag,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Copy,
  Print,
} from "lucide-react"

// 模拟文档数据
const mockDocuments = {
  "1": {
    id: "1",
    title: "GB/T16507-2022 水管锅炉",
    type: "document",
    category: "国家标准",
    subCategory: "设计技术导则",
    source: "国家标准",
    content: `
# GB/T16507-2022 水管锅炉

## 1. 范围

本标准规定了水管锅炉的技术要求、设计规范和安全标准，适用于工业锅炉的设计、制造、安装、检验和使用。

## 2. 规范性引用文件

下列文件对于本文件的应用是必不可少的。凡是注日期的引用文件，仅注日期的版本适用于本文件。

- GB/T 150-2011 压力容器
- GB/T 713-2014 锅炉和压力容器用钢板
- GB/T 3087-2008 低中压锅炉用无缝钢管

## 3. 术语和定义

### 3.1 水管锅炉
通过水管系统进行热交换的锅炉设备。

### 3.2 设计压力
锅炉在正常工作条件下能够承受的最大压力。

## 4. 技术要求

### 4.1 基本要求

4.1.1 锅炉设计应满足安全、可靠、经济、环保的要求。

4.1.2 锅炉结构应便于制造、安装、检验和维修。

4.1.3 锅炉材料应符合相关标准要求。

### 4.2 水压试验要求

4.2.1 锅炉应进行水压试验，试验压力为设计压力的1.25倍。

4.2.2 水压试验应在制造完成后进行，试验过程中不得有渗漏现象。

4.2.3 试验压力保持时间不少于30分钟。

### 4.3 材料选择

4.3.1 锅炉受压元件应采用符合GB/T 713标准的钢板。

4.3.2 锅炉管材应采用符合GB/T 3087标准的无缝钢管。

4.3.3 焊接材料应与母材相匹配。

## 5. 制造工艺

### 5.1 焊接要求

5.1.1 焊接工艺应经过评定，焊接人员应持证上岗。

5.1.2 焊缝应进行无损检测，检测比例不少于20%。

5.1.3 焊接质量应符合相关标准要求。

### 5.2 热处理

5.2.1 锅炉受压元件应进行适当的热处理。

5.2.2 热处理工艺应经过验证。

## 6. 检验和试验

### 6.1 制造检验

6.1.1 制造过程中应进行过程检验。

6.1.2 检验记录应完整保存。

### 6.2 出厂检验

6.2.1 锅炉出厂前应进行全面的检验。

6.2.2 检验合格后方可出厂。

## 7. 安装和使用

### 7.1 安装要求

7.1.1 锅炉安装应由有资质的单位进行。

7.1.2 安装过程应严格按照设计图纸进行。

### 7.2 使用要求

7.2.1 锅炉使用前应进行调试。

7.2.2 使用过程中应定期维护保养。

## 8. 安全要求

### 8.1 安全附件

8.1.1 锅炉应配备安全阀、压力表、水位计等安全附件。

8.1.2 安全附件应定期校验。

### 8.2 安全操作

8.2.1 操作人员应经过培训。

8.2.2 操作过程应严格按照规程进行。

## 9. 环保要求

### 9.1 排放标准

9.1.1 锅炉排放应符合环保要求。

9.1.2 应配备必要的环保设施。

## 10. 附录

### 附录A 设计计算示例

### 附录B 材料性能表

### 附录C 检验记录表
    `,
    lastUpdated: "2024-01-15",
    viewCount: 3200,
    downloadCount: 1250,
    author: "国家标准化管理委员会",
    version: "2022版",
    pages: 156,
    fileSize: "2.8 MB",
    language: "中文",
    keywords: ["水管锅炉", "国家标准", "设计规范", "安全标准", "水压试验"],
    relatedDocuments: [
      { id: "2", title: "GB/T 150-2011 压力容器", type: "standard" },
      { id: "3", title: "锅炉安全技术监察规程", type: "manual" },
      { id: "4", title: "锅炉水压试验操作规程", type: "manual" },
    ],
    comments: [
      {
        id: 1,
        user: "张工程师",
        content: "这个标准很全面，对锅炉设计很有指导意义。",
        time: "2024-01-20 14:30",
        likes: 12,
      },
      {
        id: 2,
        user: "李技术员",
        content: "水压试验部分写得特别详细，很实用。",
        time: "2024-01-19 09:15",
        likes: 8,
      },
    ],
  },
  "2": {
    id: "2",
    title: "ASME BPVC.1 锅炉压力容器规范",
    type: "standard",
    category: "国际标准",
    subCategory: "设计技术导则",
    source: "国际标准",
    content: `
# ASME BPVC.1 锅炉压力容器规范

## 1. Scope

This standard covers the design, fabrication, inspection, and testing requirements for boilers and pressure vessels.

## 2. General Requirements

### 2.1 Materials
All materials shall conform to the requirements specified in the applicable material specifications.

### 2.2 Design
The design shall be based on sound engineering principles and shall provide for safe operation under all anticipated conditions.

## 3. Fabrication

### 3.1 Welding
All welding shall be performed by qualified welders using qualified procedures.

### 3.2 Heat Treatment
Heat treatment shall be performed as required by the material specification.

## 4. Inspection and Testing

### 4.1 Hydrostatic Testing
All pressure vessels shall be subjected to hydrostatic testing.

### 4.2 Non-destructive Examination
Non-destructive examination shall be performed as specified.

## 5. Safety Requirements

### 5.1 Safety Valves
All boilers shall be equipped with safety valves.

### 5.2 Pressure Relief
Adequate pressure relief shall be provided.

## 6. Documentation

### 6.1 Design Reports
Design reports shall be prepared and maintained.

### 6.2 Inspection Records
Inspection records shall be maintained throughout the life of the vessel.
    `,
    lastUpdated: "2024-01-10",
    viewCount: 2100,
    downloadCount: 890,
    author: "American Society of Mechanical Engineers",
    version: "2023版",
    pages: 89,
    fileSize: "1.9 MB",
    language: "英文",
    keywords: ["ASME", "锅炉", "压力容器", "国际标准", "设计规范"],
    relatedDocuments: [
      { id: "1", title: "GB/T16507-2022 水管锅炉", type: "document" },
      { id: "5", title: "API 510 压力容器检验规范", type: "standard" },
    ],
    comments: [
      {
        id: 1,
        user: "王工程师",
        content: "ASME标准是国际权威，对设计很有参考价值。",
        time: "2024-01-18 16:45",
        likes: 15,
      },
    ],
  },
}

export default function DocumentViewPage() {
  const params = useParams()
  const router = useRouter()
  const [document, setDocument] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("content")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟加载文档数据
    const loadDocument = () => {
      setIsLoading(true)
      setTimeout(() => {
        const doc = mockDocuments[params.id as string]
        setDocument(doc)
        setIsLoading(false)
      }, 500)
    }

    loadDocument()
  }, [params.id])

  const handleBack = () => {
    router.back()
  }

  const handleDownload = () => {
    console.log("下载文档:", document?.title)
    // 这里可以添加实际的下载逻辑
  }

  const handleShare = () => {
    console.log("分享文档:", document?.title)
    // 这里可以添加实际的分享逻辑
  }

  const handleBookmark = () => {
    console.log("收藏文档:", document?.title)
    // 这里可以添加实际的收藏逻辑
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="文档查看" subtitle="正在加载文档内容..." />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">加载中...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="文档查看" subtitle="文档未找到" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">文档未找到</h2>
              <p className="text-muted-foreground mb-4">您要查看的文档不存在或已被删除</p>
              <Button onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
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
        <Header title="文档查看" subtitle={document.title} />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* 返回按钮 */}
            <div className="mb-6">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
            </div>

            {/* 文档信息卡片 */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl font-serif">{document.title}</CardTitle>
                      <Badge variant="secondary">{document.category}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{document.subCategory}</p>
                    
                    {/* 文档元信息 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{document.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{document.lastUpdated}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{document.viewCount} 次查看</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span>{document.downloadCount} 次下载</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleBookmark}>
                      <Bookmark className="h-4 w-4 mr-2" />
                      收藏
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share className="h-4 w-4 mr-2" />
                      分享
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      下载
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* 内容标签页 */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">内容</TabsTrigger>
                <TabsTrigger value="info">信息</TabsTrigger>
                <TabsTrigger value="related">相关文档</TabsTrigger>
                <TabsTrigger value="comments">评论</TabsTrigger>
              </TabsList>

              {/* 文档内容 */}
              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>文档内容</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] w-full">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                          {document.content}
                        </pre>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 文档信息 */}
              <TabsContent value="info" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>基本信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">版本:</span>
                        <span>{document.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">页数:</span>
                        <span>{document.pages} 页</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">文件大小:</span>
                        <span>{document.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">语言:</span>
                        <span>{document.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">来源:</span>
                        <span>{document.source}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>关键词</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {document.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline">
                            <Tag className="h-3 w-3 mr-1" />
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 相关文档 */}
              <TabsContent value="related" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>相关文档</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {document.relatedDocuments.map((doc: any) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => router.push(`/documents/${doc.id}`)}
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{doc.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {doc.type === 'document' ? '文档' : 
                               doc.type === 'standard' ? '标准' : '手册'}
                            </Badge>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 评论 */}
              <TabsContent value="comments" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>用户评论</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {document.comments.map((comment: any) => (
                        <div key={comment.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{comment.user}</span>
                              <span className="text-sm text-muted-foreground">{comment.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {comment.likes}
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
