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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"

// Mock search results
const mockSearchResults = [
  {
    id: 1,
    title: "锅炉安全标准 2024",
    type: "document",
    content:
      "锅炉操作的综合安全标准，包括温度监控、压力控制和应急程序...",
    source: "安全手册 v2.1",
    relevance: 0.95,
    lastUpdated: "2024-01-15",
    category: "Safety Standards",
  },
  {
    id: 2,
    title: "温度控制系统",
    type: "concept",
    content:
      "工业锅炉的先进温度控制机制，包括PID控制器和反馈系统...",
    source: "技术规格",
    relevance: 0.87,
    lastUpdated: "2024-01-14",
    category: "Technical",
  },
  {
    id: 3,
    title: "维护计划 2024年第一季度",
    type: "document",
    content:
      "季度维护计划，包括例行检查、组件更换和系统升级...",
    source: "维护手册",
    relevance: 0.82,
    lastUpdated: "2024-01-13",
    category: "Maintenance",
  },
  {
    id: 4,
    title: "张伟 - 安全专家",
    type: "person",
    content:
      "高级安全工程师，拥有15年锅炉安全协议和法规合规经验...",
    source: "员工目录",
    relevance: 0.76,
    lastUpdated: "2024-01-12",
    category: "Personnel",
  },
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
  const [selectedFilters, setSelectedFilters] = useState({
    type: "all",
    category: "all",
    dateRange: "all",
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }



  const filteredResults = searchResults.filter((result) => {
    const matchesType = selectedFilters.type === "all" || result.type === selectedFilters.type
    const matchesCategory = selectedFilters.category === "all" || result.category === selectedFilters.category
    return matchesType && matchesCategory
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="知识搜索与问答" subtitle="从您的知识库中查找信息并获得AI驱动的答案" />

        <main className="flex-1 overflow-hidden">
          <Tabs defaultValue="search" className="h-full">
            <div className="border-b border-border px-6">
              <TabsList>
                <TabsTrigger value="search">高级搜索</TabsTrigger>
                <TabsTrigger value="history">搜索历史</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="search" className="flex-1 overflow-hidden">
              <div className="flex h-full">
                {/* Search Results Area */}
                <div className="flex-1 flex flex-col">
                  {/* Search Bar */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="搜索文档、概念、人员..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                          className="pl-10 text-base"
                        />
                      </div>
                      <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? "搜索中..." : "搜索"}
                      </Button>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center space-x-4 mt-4">
                      <Select
                        value={selectedFilters.type}
                        onValueChange={(value) => setSelectedFilters({ ...selectedFilters, type: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有类型</SelectItem>
                          <SelectItem value="document">文档</SelectItem>
                          <SelectItem value="concept">概念</SelectItem>
                          <SelectItem value="person">人员</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedFilters.category}
                        onValueChange={(value) => setSelectedFilters({ ...selectedFilters, category: value })}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有分类</SelectItem>
                          <SelectItem value="Safety Standards">安全</SelectItem>
                          <SelectItem value="Technical">技术</SelectItem>
                          <SelectItem value="Maintenance">维护</SelectItem>
                          <SelectItem value="Personnel">人员</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                        <Filter className="mr-2 h-4 w-4" />
                        高级过滤器
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">日期范围</label>
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
                            <label className="text-sm font-medium mb-2 block">文件类型</label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="pdf" />
                                <label htmlFor="pdf" className="text-sm">
                                  PDF
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="word" />
                                <label htmlFor="word" className="text-sm">
                                  Word
                                </label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">来源</label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="manual" />
                                <label htmlFor="manual" className="text-sm">
                                  手册
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="specs" />
                                <label htmlFor="specs" className="text-sm">
                                  规格说明
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search Results */}
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
                                  <ExternalLink className="h-4 w-4" />
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
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>更新于 {result.lastUpdated}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>



            <TabsContent value="history" className="flex-1 overflow-hidden p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg mb-2">搜索历史</h3>
                  <p className="text-muted-foreground text-sm">您最近的搜索和AI对话</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-serif">最近搜索</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { query: "锅炉安全标准", time: "2小时前", results: 23 },
                          { query: "温度监控", time: "1天前", results: 15 },
                          { query: "维护计划", time: "2天前", results: 8 },
                          { query: "压力阀检查", time: "3天前", results: 12 },
                        ].map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded hover:bg-muted cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <History className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{search.query}</p>
                                <p className="text-xs text-muted-foreground">
                                  {search.results} 个结果 • {search.time}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-serif">AI对话</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { topic: "安全要求讨论", time: "1小时前", messages: 6 },
                          { topic: "维护程序问答", time: "1天前", messages: 4 },
                          { topic: "技术规格帮助", time: "2天前", messages: 8 },
                          { topic: "应急协议咨询", time: "4天前", messages: 3 },
                        ].map((conversation, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded hover:bg-muted cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{conversation.topic}</p>
                                <p className="text-xs text-muted-foreground">
                                  {conversation.messages} 条消息 • {conversation.time}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
