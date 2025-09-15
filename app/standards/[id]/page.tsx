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
  Award,
  Shield,
} from "lucide-react"

// 模拟标准数据
const mockStandards = {
  "1": {
    id: "1",
    title: "GB/T 150-2011 压力容器",
    type: "standard",
    category: "国家标准",
    subCategory: "安全规范",
    source: "国家标准",
    standardNumber: "GB/T 150-2011",
    publishDate: "2011-12-30",
    effectiveDate: "2012-07-01",
    status: "现行",
    content: `
# GB/T 150-2011 压力容器

## 1 范围

本标准规定了金属制压力容器的设计、制造、检验和验收要求。

## 2 规范性引用文件

下列文件对于本文件的应用是必不可少的。

- GB/T 713-2014 锅炉和压力容器用钢板
- GB/T 8163-2008 输送流体用无缝钢管
- GB/T 9948-2013 石油裂化用无缝钢管

## 3 术语和定义

### 3.1 压力容器
同时满足下列条件的容器：
a) 最高工作压力大于等于0.1MPa（表压）；
b) 内直径（非圆形截面指其最大尺寸）大于等于0.15m，且容积大于等于0.025m³；
c) 盛装介质为气体、液化气体或最高工作温度高于等于标准沸点的液体。

### 3.2 设计压力
设定的容器顶部的最高压力，与相应的设计温度一起作为设计载荷条件。

## 4 材料

### 4.1 基本要求

4.1.1 压力容器用材料应符合相应标准的规定。

4.1.2 材料应有质量证明书，并符合订货合同的要求。

4.1.3 材料应进行复验，复验项目应符合本标准的规定。

### 4.2 钢板

4.2.1 压力容器用钢板应符合GB/T 713的规定。

4.2.2 钢板应有质量证明书。

4.2.3 钢板应进行外观检查，不得有裂纹、分层、夹渣等缺陷。

### 4.3 钢管

4.3.1 压力容器用钢管应符合GB/T 8163或GB/T 9948的规定。

4.3.2 钢管应有质量证明书。

4.3.3 钢管应进行外观检查，不得有裂纹、分层、夹渣等缺陷。

## 5 设计

### 5.1 基本要求

5.1.1 压力容器的设计应满足安全、可靠、经济、合理的要求。

5.1.2 设计应考虑各种载荷的作用。

5.1.3 设计应便于制造、安装、检验和维修。

### 5.2 设计压力

5.2.1 设计压力应不小于最高工作压力。

5.2.2 对于装有安全阀的容器，设计压力应不小于安全阀的开启压力。

5.2.3 对于装有爆破片的容器，设计压力应不小于爆破片的设计爆破压力。

### 5.3 设计温度

5.3.1 设计温度应取容器在正常工作过程中，在相应设计压力下，容器壁可能达到的最高或最低温度。

5.3.2 设计温度不得低于-20℃。

### 5.4 壁厚计算

5.4.1 圆筒形壳体的壁厚应按下列公式计算：

δ = (P×D)/(2[σ]t×φ - P) + C

式中：
δ —— 计算壁厚，mm；
P —— 设计压力，MPa；
D —— 内直径，mm；
[σ]t —— 设计温度下的许用应力，MPa；
φ —— 焊接接头系数；
C —— 壁厚附加量，mm。

## 6 制造

### 6.1 基本要求

6.1.1 压力容器的制造应符合本标准的规定。

6.1.2 制造单位应具备相应的制造资质。

6.1.3 制造过程应进行质量控制。

### 6.2 焊接

6.2.1 焊接工艺应经过评定。

6.2.2 焊接人员应持证上岗。

6.2.3 焊缝应进行无损检测。

### 6.3 热处理

6.3.1 压力容器应进行适当的热处理。

6.3.2 热处理工艺应经过验证。

## 7 检验和试验

### 7.1 制造检验

7.1.1 制造过程中应进行过程检验。

7.1.2 检验记录应完整保存。

### 7.2 出厂检验

7.2.1 压力容器出厂前应进行全面的检验。

7.2.2 检验合格后方可出厂。

### 7.3 水压试验

7.3.1 压力容器应进行水压试验。

7.3.2 试验压力为设计压力的1.25倍。

7.3.3 试验过程中不得有渗漏现象。

## 8 安全附件

### 8.1 安全阀

8.1.1 压力容器应配备安全阀。

8.1.2 安全阀应定期校验。

### 8.2 压力表

8.2.1 压力容器应配备压力表。

8.2.2 压力表应定期校验。

### 8.3 液位计

8.3.1 压力容器应配备液位计。

8.3.2 液位计应定期校验。

## 9 使用和维护

### 9.1 使用要求

9.1.1 压力容器使用前应进行调试。

9.1.2 使用过程中应定期检查。

### 9.2 维护要求

9.2.1 压力容器应定期维护保养。

9.2.2 维护记录应完整保存。

## 10 附录

### 附录A 材料性能表

### 附录B 设计计算示例

### 附录C 检验记录表
    `,
    lastUpdated: "2024-01-12",
    viewCount: 4500,
    downloadCount: 2100,
    author: "国家标准化管理委员会",
    version: "2011版",
    pages: 89,
    fileSize: "1.5 MB",
    language: "中文",
    keywords: ["压力容器", "国家标准", "设计规范", "安全要求", "制造工艺"],
    scope: "本标准适用于设计压力不大于35MPa的钢制压力容器的设计、制造、检验和验收。",
    applicableScope: "石油、化工、电力、冶金、轻工、纺织、食品、医药等行业",
    relatedStandards: [
      { id: "2", title: "GB/T 151-2014 热交换器", type: "standard" },
      { id: "3", title: "GB/T 713-2014 锅炉和压力容器用钢板", type: "standard" },
      { id: "4", title: "TSG 21-2016 固定式压力容器安全技术监察规程", type: "regulation" },
    ],
    comments: [
      {
        id: 1,
        user: "刘工程师",
        content: "这是压力容器设计的基础标准，非常重要。",
        time: "2024-01-22 10:30",
        likes: 18,
      },
      {
        id: 2,
        user: "陈技术员",
        content: "壁厚计算公式很实用，经常用到。",
        time: "2024-01-21 15:45",
        likes: 12,
      },
    ],
  },
}

export default function StandardViewPage() {
  const params = useParams()
  const router = useRouter()
  const [standard, setStandard] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("content")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStandard = () => {
      setIsLoading(true)
      setTimeout(() => {
        const std = mockStandards[params.id as string]
        setStandard(std)
        setIsLoading(false)
      }, 500)
    }

    loadStandard()
  }, [params.id])

  const handleBack = () => {
    router.back()
  }

  const handleDownload = () => {
    console.log("下载标准:", standard?.title)
  }

  const handleShare = () => {
    console.log("分享标准:", standard?.title)
  }

  const handleBookmark = () => {
    console.log("收藏标准:", standard?.title)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="标准查看" subtitle="正在加载标准内容..." />
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

  if (!standard) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="标准查看" subtitle="标准未找到" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">标准未找到</h2>
              <p className="text-muted-foreground mb-4">您要查看的标准不存在或已被删除</p>
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
        <Header title="标准查看" subtitle={standard.title} />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* 返回按钮 */}
            <div className="mb-6">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
            </div>

            {/* 标准信息卡片 */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Award className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl font-serif">{standard.title}</CardTitle>
                      <Badge variant="secondary">{standard.category}</Badge>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {standard.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{standard.subCategory}</p>
                    
                    {/* 标准编号和日期 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>标准编号: {standard.standardNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>发布日期: {standard.publishDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>实施日期: {standard.effectiveDate}</span>
                      </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{standard.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{standard.viewCount} 次查看</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span>{standard.downloadCount} 次下载</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{standard.lastUpdated}</span>
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
                <TabsTrigger value="scope">适用范围</TabsTrigger>
                <TabsTrigger value="related">相关标准</TabsTrigger>
                <TabsTrigger value="comments">评论</TabsTrigger>
              </TabsList>

              {/* 标准内容 */}
              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>标准内容</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] w-full">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                          {standard.content}
                        </pre>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 标准信息 */}
              <TabsContent value="info" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>基本信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">标准编号:</span>
                        <span>{standard.standardNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">版本:</span>
                        <span>{standard.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">状态:</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {standard.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">页数:</span>
                        <span>{standard.pages} 页</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">文件大小:</span>
                        <span>{standard.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">语言:</span>
                        <span>{standard.language}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>关键词</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {standard.keywords.map((keyword: string, index: number) => (
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

              {/* 适用范围 */}
              <TabsContent value="scope" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>适用范围</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">标准范围</h4>
                      <p className="text-sm text-muted-foreground">{standard.scope}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">适用行业</h4>
                      <p className="text-sm text-muted-foreground">{standard.applicableScope}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 相关标准 */}
              <TabsContent value="related" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>相关标准</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {standard.relatedStandards.map((std: any) => (
                        <div
                          key={std.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => router.push(`/standards/${std.id}`)}
                        >
                          <div className="flex items-center space-x-3">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{std.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {std.type === 'standard' ? '标准' : '规范'}
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
                      {standard.comments.map((comment: any) => (
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
