"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  MessageSquare,
  Share,
  Bookmark,
  Clock,
  FileText,
  Network,
  User,
  Filter,
  History,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Star,
  ThumbsUp,
  X,
  Calendar,
  Tag,
  Eye,
  Download,
  Copy,
  Brain,
  Zap,
  Target,
  Globe,
} from "lucide-react"

// Mock data for search functionality
const mockSearchResults = [
  {
    id: 1,
    title: "GB/T16507-2022 水管锅炉",
    type: "document",
    content: "水管锅炉的技术要求、设计规范和安全标准，包括水压试验要求、材料选择、制造工艺等详细规定...",
    source: "国家标准",
    relevance: 0.95,
    lastUpdated: "2024-01-15",
    category: "设计技术导则",
    subCategory: "锅炉",
    documentNumber: "GB/T16507-2022",
    fileType: "PDF",
    size: "2.4 MB",
    downloadCount: 1250,
    viewCount: 3200,
  },
  {
    id: 2,
    title: "ASME BPVC.1 锅炉压力容器规范",
    type: "document",
    content: "美国机械工程师学会锅炉压力容器规范，涵盖设计、制造、检验和测试要求...",
    source: "国际标准",
    relevance: 0.87,
    lastUpdated: "2024-01-14",
    category: "设计技术导则",
    subCategory: "锅炉",
    documentNumber: "ASME BPVC.1",
    fileType: "PDF",
    size: "5.2 MB",
    downloadCount: 890,
    viewCount: 2100,
  },
  {
    id: 3,
    title: "水压试验操作规程",
    type: "document",
    content: "锅炉水压试验的详细操作步骤、安全要求和验收标准，包括试验压力计算和异常处理...",
    source: "工艺技术导则",
    relevance: 0.82,
    lastUpdated: "2024-01-13",
    category: "工艺技术导则",
    subCategory: "试验检测",
    documentNumber: "Q/DF-2024-001",
    fileType: "Word",
    size: "1.8 MB",
    downloadCount: 650,
    viewCount: 1800,
  },
]

// Mock data for recommendations
const mockHotSearches = [
  { keyword: "GB/T16507-2022", clicks: 1250, searches: 890 },
  { keyword: "ASME BPVC.1", clicks: 980, searches: 720 },
  { keyword: "水压试验", clicks: 850, searches: 650 },
  { keyword: "锅炉设计", clicks: 750, searches: 580 },
  { keyword: "安全阀", clicks: 680, searches: 520 },
  { keyword: "压力容器", clicks: 620, searches: 480 },
  { keyword: "焊接工艺", clicks: 580, searches: 450 },
  { keyword: "无损检测", clicks: 520, searches: 400 },
  { keyword: "材料标准", clicks: 480, searches: 380 },
  { keyword: "检验规程", clicks: 450, searches: 350 },
]

const mockHotDocuments = [
  { title: "GB/T16508-2022 锅壳锅炉", category: "设计技术导则", views: 3200, downloads: 1250 },
  { title: "锅炉安全技术监察规程", category: "安全技术导则", views: 2800, downloads: 980 },
  { title: "压力容器定期检验规则", category: "检验技术导则", views: 2500, downloads: 850 },
  { title: "焊接工艺评定规程", category: "工艺技术导则", views: 2200, downloads: 750 },
]

const mockFeaturedQuestions = [
  { question: "质保体系审核流程是什么？", category: "质保部", likes: 45, answers: 3 },
  { question: "不合格品处理标准有哪些？", category: "质保部", likes: 38, answers: 2 },
  { question: "锅炉水压试验压力如何确定？", category: "技术部", likes: 32, answers: 4 },
  { question: "压力容器定期检验周期？", category: "检验部", likes: 28, answers: 2 },
]

const mockSearchHistory = [
  { query: "水压试验", time: "2024-01-15 14:30", results: 23 },
  { query: "锅炉设计规范", time: "2024-01-15 10:15", results: 15 },
  { query: "ASME标准", time: "2024-01-14 16:45", results: 8 },
  { query: "安全阀校验", time: "2024-01-14 09:20", results: 12 },
  { query: "焊接工艺评定", time: "2024-01-13 15:30", results: 18 },
]

const mockRelatedQuestions = [
  "水压试验压力标准",
  "水压试验不合格处理",
  "水压试验安全要求",
  "水压试验记录表格",
  "水压试验设备要求",
]



const getResultIcon = (type: string) => {
  switch (type) {
    case "document":
      return <FileText className="h-4 w-4 text-primary" />
    case "concept":
      return <Network className="h-4 w-4 text-secondary" />
    case "person":
      return <User className="h-4 w-4 text-accent" />
    default:
      return <Search className="h-4 w-4 text-muted-foreground" />
  }
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(mockSearchResults)
  const [isLoading, setIsLoading] = useState(false)
  const [searchMode, setSearchMode] = useState("semantic") // semantic or keyword
  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    subCategory: "all",
    dateRange: "all",
    source: "all",
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return
    setIsLoading(true)
    setHasSearched(true)
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleHotSearch = (keyword: string) => {
    setSearchQuery(keyword)
    handleSearch(keyword)
  }

  const handleHistorySearch = (query: string) => {
    setSearchQuery(query)
    handleSearch(query)
  }

  const filteredResults = searchResults.filter((result) => {
    const matchesCategory = selectedFilters.category === "all" || result.category === selectedFilters.category
    const matchesSubCategory = selectedFilters.subCategory === "all" || result.subCategory === selectedFilters.subCategory
    return matchesCategory && matchesSubCategory
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="知识搜索" subtitle="智能搜索技术文档、标准和规范" />

        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Search Bar */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索文档、标准、规范... (支持语义匹配和关键字匹配)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-10 text-base"
                    />
                  </div>
                  <Button onClick={() => handleSearch()} disabled={isLoading}>
                    {isLoading ? "搜索中..." : "搜索"}
                  </Button>
                </div>

                {/* Search Mode Toggle */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">搜索模式:</Label>
                    <Button
                      variant={searchMode === "semantic" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSearchMode("semantic")}
                    >
                      <Brain className="h-4 w-4 mr-1" />
                      语义匹配
                    </Button>
                    <Button
                      variant={searchMode === "keyword" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSearchMode("keyword")}
                    >
                      <Target className="h-4 w-4 mr-1" />
                      关键字匹配
                    </Button>
                  </div>

                  <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                    <Filter className="mr-2 h-4 w-4" />
                    范围筛选
                    {showAdvancedFilters ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">技术范围</Label>
                        <Select
                          value={selectedFilters.category}
                          onValueChange={(value) => setSelectedFilters({ ...selectedFilters, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">所有范围</SelectItem>
                            <SelectItem value="设计技术导则">设计技术导则</SelectItem>
                            <SelectItem value="工艺技术导则">工艺技术导则</SelectItem>
                            <SelectItem value="安全技术导则">安全技术导则</SelectItem>
                            <SelectItem value="检验技术导则">检验技术导则</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">专业分类</Label>
                        <Select
                          value={selectedFilters.subCategory}
                          onValueChange={(value) => setSelectedFilters({ ...selectedFilters, subCategory: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">所有分类</SelectItem>
                            <SelectItem value="锅炉">锅炉</SelectItem>
                            <SelectItem value="辅机容器">辅机容器</SelectItem>
                            <SelectItem value="试验检测">试验检测</SelectItem>
                            <SelectItem value="焊接工艺">焊接工艺</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">时间范围</Label>
                        <Select
                          value={selectedFilters.dateRange}
                          onValueChange={(value) => setSelectedFilters({ ...selectedFilters, dateRange: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部时间</SelectItem>
                            <SelectItem value="week">过去一周</SelectItem>
                            <SelectItem value="month">过去一月</SelectItem>
                            <SelectItem value="year">过去一年</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">文档来源</Label>
                        <Select
                          value={selectedFilters.source}
                          onValueChange={(value) => setSelectedFilters({ ...selectedFilters, source: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">所有来源</SelectItem>
                            <SelectItem value="国家标准">国家标准</SelectItem>
                            <SelectItem value="国际标准">国际标准</SelectItem>
                            <SelectItem value="企业标准">企业标准</SelectItem>
                            <SelectItem value="技术手册">技术手册</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Search History */}
                {!hasSearched && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">搜索历史</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSearchHistory(!showSearchHistory)}
                      >
                        {showSearchHistory ? "收起" : "展开"}
                        {showSearchHistory ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {mockSearchHistory.slice(0, showSearchHistory ? mockSearchHistory.length : 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                          onClick={() => handleHistorySearch(item.query)}
                        >
                          <div className="flex items-center space-x-2">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{item.query}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{item.time}</span>
                            <Button variant="ghost" size="sm">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {hasSearched && (
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        找到 {filteredResults.length} 个结果 {searchQuery && `关于 "${searchQuery}"`}
                      </p>
                      <Select defaultValue="relevance">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">相关性</SelectItem>
                          <SelectItem value="date">日期</SelectItem>
                          <SelectItem value="title">标题</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {filteredResults.map((result) => (
                      <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getResultIcon(result.type)}
                              <CardTitle className="text-lg font-serif">{result.title}</CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {Math.round(result.relevance * 100)}% 匹配
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{result.content}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              <span>来源: {result.source}</span>
                              <Badge variant="secondary" className="text-xs">
                                {result.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {result.subCategory}
                              </Badge>
                              <span>文档编号: {result.documentNumber}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{result.viewCount}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className="h-3 w-3" />
                                <span>{result.downloadCount}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>更新于 {result.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Related Questions */}
                    {hasSearched && (
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle className="text-base font-medium">你可能还想搜索</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {mockRelatedQuestions.map((question, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleHotSearch(question)}
                              >
                                {question}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              )}

              {/* Welcome State */}
              {!hasSearched && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">开始搜索</h3>
                    <p className="text-muted-foreground">输入关键词开始搜索技术文档和标准</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Recommendations */}
            <div className="w-80 border-l border-border bg-muted/20 p-4 overflow-y-auto">
              {/* Hot Searches */}
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    热门搜索
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockHotSearches.slice(0, 10).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                      onClick={() => handleHotSearch(item.keyword)}
                    >
                      <span className="text-sm font-medium">{item.keyword}</span>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span>{item.clicks}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Hot Documents */}
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    热门文档
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockHotDocuments.map((doc, index) => (
                    <div key={index} className="p-2 rounded hover:bg-muted cursor-pointer">
                      <p className="text-sm font-medium">{doc.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {doc.category}
                        </Badge>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{doc.views} 次查看</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Featured Questions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    精选问题
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockFeaturedQuestions.map((q, index) => (
                    <div key={index} className="p-2 rounded hover:bg-muted cursor-pointer">
                      <p className="text-sm font-medium">{q.question}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs">
                          {q.category}
                        </Badge>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{q.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
