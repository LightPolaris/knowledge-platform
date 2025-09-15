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
  BookOpen,
  Wrench,
  AlertTriangle,
} from "lucide-react"

// 模拟手册数据
const mockManuals = {
  "1": {
    id: "1",
    title: "锅炉水压试验操作规程",
    type: "manual",
    category: "工艺技术导则",
    subCategory: "操作手册",
    source: "工艺技术导则",
    content: `
# 锅炉水压试验操作规程

## 1. 目的和范围

### 1.1 目的
本规程规定了锅炉水压试验的操作程序、安全要求和验收标准，确保锅炉水压试验的安全进行。

### 1.2 适用范围
本规程适用于工业锅炉的水压试验操作。

## 2. 引用标准

- GB/T 16507-2022 水管锅炉
- GB/T 150-2011 压力容器
- TSG 21-2016 固定式压力容器安全技术监察规程

## 3. 术语和定义

### 3.1 水压试验
用水作为试验介质，对锅炉受压元件进行的压力试验。

### 3.2 试验压力
水压试验时施加的压力。

### 3.3 保压时间
试验压力保持的时间。

## 4. 试验前准备

### 4.1 人员要求

4.1.1 试验人员应经过专业培训，持证上岗。

4.1.2 试验现场应配备安全员。

4.1.3 试验人员应熟悉本规程。

### 4.2 设备检查

4.2.1 检查试验设备是否完好。

4.2.2 检查压力表是否在有效期内。

4.2.3 检查安全阀是否正常。

### 4.3 环境要求

4.3.1 试验环境温度应不低于5℃。

4.3.2 试验现场应清洁，无杂物。

4.3.3 试验现场应设置安全警戒线。

## 5. 试验程序

### 5.1 注水

5.1.1 缓慢向锅炉内注水。

5.1.2 注水过程中应排尽空气。

5.1.3 注水至锅炉最高点。

### 5.2 升压

5.2.1 缓慢升压至试验压力。

5.2.2 升压速度应控制在0.1MPa/min以内。

5.2.3 升压过程中应密切观察。

### 5.3 保压

5.3.1 达到试验压力后开始保压。

5.3.2 保压时间不少于30分钟。

5.3.3 保压过程中应检查有无渗漏。

### 5.4 降压

5.4.1 保压结束后缓慢降压。

5.4.2 降压速度应控制在0.1MPa/min以内。

5.4.3 降压至零后排水。

## 6. 安全要求

### 6.1 一般要求

6.1.1 试验过程中严禁人员靠近。

6.1.2 试验现场应设置安全警示标志。

6.1.3 试验人员应佩戴安全防护用品。

### 6.2 应急处理

6.2.1 发现异常情况应立即停止试验。

6.2.2 发生泄漏时应立即降压。

6.2.3 发生事故时应立即报告。

## 7. 验收标准

### 7.1 外观检查

7.1.1 试验过程中不得有渗漏现象。

7.1.2 试验后外观应无异常。

7.1.3 焊缝应无裂纹。

### 7.2 压力检查

7.2.1 试验压力应达到规定值。

7.2.2 保压期间压力应保持稳定。

7.2.3 降压应平稳。

## 8. 记录和报告

### 8.1 试验记录

8.1.1 试验过程应详细记录。

8.1.2 记录应包括试验参数。

8.1.3 记录应有试验人员签字。

### 8.2 试验报告

8.2.1 试验结束后应出具报告。

8.2.2 报告应包括试验结果。

8.2.3 报告应有负责人签字。

## 9. 注意事项

### 9.1 试验前

9.1.1 确认锅炉已停炉冷却。

9.1.2 确认所有阀门已关闭。

9.1.3 确认安全措施已到位。

### 9.2 试验中

9.2.1 密切观察压力变化。

9.2.2 注意听是否有异常声音。

9.2.3 发现异常立即处理。

### 9.3 试验后

9.3.1 彻底排尽试验用水。

9.3.2 检查设备状态。

9.3.3 清理试验现场。

## 10. 附录

### 附录A 试验记录表

### 附录B 安全措施检查表

### 附录C 应急处理预案
    `,
    lastUpdated: "2024-01-08",
    viewCount: 1800,
    downloadCount: 650,
    author: "工艺技术部",
    version: "2024版",
    pages: 45,
    fileSize: "1.2 MB",
    language: "中文",
    keywords: ["水压试验", "锅炉", "操作规程", "安全要求", "验收标准"],
    applicableEquipment: "工业锅炉、压力容器、换热器",
    safetyLevel: "高风险",
    relatedManuals: [
      { id: "2", title: "锅炉安全操作规程", type: "manual" },
      { id: "3", title: "压力容器维护手册", type: "manual" },
      { id: "4", title: "设备检修作业指导书", type: "manual" },
    ],
    comments: [
      {
        id: 1,
        user: "王技师",
        content: "这个规程很详细，安全要求写得特别清楚。",
        time: "2024-01-15 11:20",
        likes: 8,
      },
      {
        id: 2,
        user: "李工程师",
        content: "试验程序步骤很规范，按这个操作很安全。",
        time: "2024-01-14 16:30",
        likes: 6,
      },
    ],
  },
}

export default function ManualViewPage() {
  const params = useParams()
  const router = useRouter()
  const [manual, setManual] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("content")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadManual = () => {
      setIsLoading(true)
      setTimeout(() => {
        const man = mockManuals[params.id as string]
        setManual(man)
        setIsLoading(false)
      }, 500)
    }

    loadManual()
  }, [params.id])

  const handleBack = () => {
    router.back()
  }

  const handleDownload = () => {
    console.log("下载手册:", manual?.title)
  }

  const handleShare = () => {
    console.log("分享手册:", manual?.title)
  }

  const handleBookmark = () => {
    console.log("收藏手册:", manual?.title)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="手册查看" subtitle="正在加载手册内容..." />
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

  if (!manual) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="手册查看" subtitle="手册未找到" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">手册未找到</h2>
              <p className="text-muted-foreground mb-4">您要查看的手册不存在或已被删除</p>
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
        <Header title="手册查看" subtitle={manual.title} />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* 返回按钮 */}
            <div className="mb-6">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
            </div>

            {/* 手册信息卡片 */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl font-serif">{manual.title}</CardTitle>
                      <Badge variant="secondary">{manual.category}</Badge>
                      <Badge variant="destructive" className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {manual.safetyLevel}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{manual.subCategory}</p>
                    
                    {/* 手册元信息 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{manual.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{manual.lastUpdated}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{manual.viewCount} 次查看</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span>{manual.downloadCount} 次下载</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleBookmark}>
                      <Star className="h-4 w-4 mr-2" />
                      收藏
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 1 5.367-2.684 3 3 0 0 1-5.367 2.684zm0 9.316a3 3 0 1 1 5.367 2.684 3 3 0 0 1-5.367-2.684z"/>
                      </svg>
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
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="content">内容</TabsTrigger>
                <TabsTrigger value="info">信息</TabsTrigger>
                <TabsTrigger value="equipment">适用设备</TabsTrigger>
                <TabsTrigger value="related">相关手册</TabsTrigger>
                <TabsTrigger value="comments">评论</TabsTrigger>
              </TabsList>

              {/* 手册内容 */}
              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>手册内容</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] w-full">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                          {manual.content}
                        </pre>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 手册信息 */}
              <TabsContent value="info" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>基本信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">版本:</span>
                        <span>{manual.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">页数:</span>
                        <span>{manual.pages} 页</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">文件大小:</span>
                        <span>{manual.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">语言:</span>
                        <span>{manual.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">来源:</span>
                        <span>{manual.source}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>关键词</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {manual.keywords.map((keyword: string, index: number) => (
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

              {/* 适用设备 */}
              <TabsContent value="equipment" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>适用设备</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        <span className="font-medium">适用设备类型:</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">{manual.applicableEquipment}</p>
                      
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span className="font-medium">安全等级:</span>
                        <Badge variant="destructive">{manual.safetyLevel}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 相关手册 */}
              <TabsContent value="related" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>相关手册</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {manual.relatedManuals.map((man: any) => (
                        <div
                          key={man.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => router.push(`/manuals/${man.id}`)}
                        >
                          <div className="flex items-center space-x-3">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{man.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {man.type === 'manual' ? '手册' : '指导书'}
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
                      {manual.comments.map((comment: any) => (
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
