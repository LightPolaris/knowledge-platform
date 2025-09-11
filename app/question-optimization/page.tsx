"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Tag,
  TrendingUp,
  BarChart3,
  Target,
  Bot,
  Zap,
  Brain,
  Settings,
  RefreshCw
} from "lucide-react"

export default function QuestionOptimizationPage() {
  const [activeTab, setActiveTab] = useState("feedback")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [processingSuggestion, setProcessingSuggestion] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editQuestion, setEditQuestion] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editTags, setEditTags] = useState("")
  const [autoScoringEnabled, setAutoScoringEnabled] = useState(true)
  const [scoringCriteria, setScoringCriteria] = useState({
    accuracy: 40,
    completeness: 30,
    clarity: 20,
    relevance: 10
  })
  const [isScoring, setIsScoring] = useState(false)
  const [selectedFeedbackIds, setSelectedFeedbackIds] = useState([])
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([])

  // 模拟数据 - 用户反馈（使用useState使其可编辑）
  const [feedbackData, setFeedbackData] = useState([
    {
      id: 1,
      question: "锅炉压力控制的最佳实践是什么？",
      answer: "锅炉压力控制需要根据具体工况调整...",
      user: "张工程师",
      feedback: "答案不够详细，缺少具体参数",
      rating: 2,
      status: "待处理",
      date: "2024-01-15",
      category: "技术问题",
      processingSuggestion: ""
    },
    {
      id: 2,
      question: "如何提高锅炉热效率？",
      answer: "提高热效率的方法包括优化燃烧...",
      user: "李技术员",
      feedback: "答案准确，但建议增加案例说明",
      rating: 3,
      status: "已处理",
      date: "2024-01-14",
      category: "优化建议",
      processingSuggestion: "已根据用户建议增加具体案例说明"
    },
    {
      id: 3,
      question: "锅炉安全阀的维护周期是多久？",
      answer: "安全阀应每季度检查一次...",
      user: "王主管",
      feedback: "答案错误，维护周期应该是每月",
      rating: 1,
      status: "处理中",
      date: "2024-01-13",
      category: "错误纠正",
      processingSuggestion: "正在核实正确的维护周期标准"
    }
  ])

  // 模拟数据 - 精选问题（使用useState使其可编辑）
  const [featuredQuestions, setFeaturedQuestions] = useState([
    {
      id: 1,
      question: "锅炉启动过程中的注意事项有哪些？",
      likes: 45,
      views: 120,
      category: "安全操作",
      author: "系统管理员",
      date: "2024-01-10",
      tags: ["锅炉", "启动", "安全"]
    },
    {
      id: 2,
      question: "如何判断锅炉是否需要清洗？",
      likes: 38,
      views: 95,
      category: "维护保养",
      author: "技术专家",
      date: "2024-01-08",
      tags: ["锅炉", "清洗", "维护"]
    },
    {
      id: 3,
      question: "锅炉水处理的标准是什么？",
      likes: 42,
      views: 110,
      category: "水质管理",
      author: "工程师",
      date: "2024-01-05",
      tags: ["锅炉", "水处理", "标准"]
    }
  ])

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback)
    setProcessingSuggestion(feedback.processingSuggestion || "")
    setShowFeedbackDialog(true)
  }

  const handleProcessFeedback = (id) => {
    setFeedbackData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, status: "处理中" }
          : item
      )
    )
    console.log("开始处理反馈:", id)
  }

  const handleSaveProcessingResult = () => {
    if (selectedFeedback) {
      setFeedbackData(prevData => 
        prevData.map(item => 
          item.id === selectedFeedback.id 
            ? { 
                ...item, 
                status: "已处理",
                processingSuggestion: processingSuggestion
              }
            : item
        )
      )
      setShowFeedbackDialog(false)
      setProcessingSuggestion("")
      setSelectedFeedback(null)
      console.log("保存处理结果:", selectedFeedback.id, processingSuggestion)
    }
  }

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question)
    setEditQuestion(question.question)
    setEditCategory(question.category)
    setEditTags(question.tags.join(", "))
    setShowEditDialog(true)
  }

  const handleSaveQuestionEdit = () => {
    if (selectedQuestion) {
      const updatedQuestion = {
        ...selectedQuestion,
        question: editQuestion,
        category: editCategory,
        tags: editTags.split(",").map(tag => tag.trim()).filter(tag => tag)
      }
      
      setFeaturedQuestions(prevData => 
        prevData.map(item => 
          item.id === selectedQuestion.id ? updatedQuestion : item
        )
      )
      
      setShowEditDialog(false)
      setSelectedQuestion(null)
      setEditQuestion("")
      setEditCategory("")
      setEditTags("")
      console.log("保存问题编辑:", updatedQuestion)
    }
  }

  // 批量操作函数
  const handleSelectFeedback = (id) => {
    setSelectedFeedbackIds(prev => 
      prev.includes(id) 
        ? prev.filter(feedbackId => feedbackId !== id)
        : [...prev, id]
    )
  }

  const handleSelectQuestion = (id) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) 
        ? prev.filter(questionId => questionId !== id)
        : [...prev, id]
    )
  }

  const handleBulkProcessFeedback = (status) => {
    setFeedbackData(prevData => 
      prevData.map(item => 
        selectedFeedbackIds.includes(item.id) 
          ? { ...item, status: status }
          : item
      )
    )
    setSelectedFeedbackIds([])
    console.log("批量处理反馈:", selectedFeedbackIds, status)
  }

  const handleBulkDeleteQuestions = () => {
    setFeaturedQuestions(prevData => 
      prevData.filter(item => !selectedQuestionIds.includes(item.id))
    )
    setSelectedQuestionIds([])
    console.log("批量删除问题:", selectedQuestionIds)
  }


  // 过滤反馈数据
  const filteredFeedbackData = feedbackData.filter(feedback => {
    const matchesSearch = searchQuery === "" || 
      feedback.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.feedback.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter
    const matchesCategory = categoryFilter === "all" || feedback.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  // 过滤精选问题数据
  const filteredFeaturedQuestions = featuredQuestions.filter(question => {
    const matchesSearch = searchQuery === "" || 
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesSearch
  })


  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="问题优化" subtitle="查看和处理用户反馈，管理精选问题" />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feedback">用户反馈</TabsTrigger>
                <TabsTrigger value="featured">精选问题</TabsTrigger>
                <TabsTrigger value="scoring">自动评分</TabsTrigger>
              </TabsList>

              {/* 用户反馈页面 */}
              <TabsContent value="feedback" className="space-y-6">
                {/* 统计信息 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-red-600">
                            {filteredFeedbackData.filter(f => f.status === "待处理").length}
                          </p>
                          <p className="text-sm text-muted-foreground">待处理</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">
                            {filteredFeedbackData.filter(f => f.status === "处理中").length}
                          </p>
                          <p className="text-sm text-muted-foreground">处理中</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {filteredFeedbackData.filter(f => f.status === "已处理").length}
                          </p>
                          <p className="text-sm text-muted-foreground">已处理</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {filteredFeedbackData.length}
                          </p>
                          <p className="text-sm text-muted-foreground">总计</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 搜索和筛选 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="搜索问题或反馈内容..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="状态筛选" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部状态</SelectItem>
                            <SelectItem value="待处理">待处理</SelectItem>
                            <SelectItem value="处理中">处理中</SelectItem>
                            <SelectItem value="已处理">已处理</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="分类筛选" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部分类</SelectItem>
                            <SelectItem value="技术问题">技术问题</SelectItem>
                            <SelectItem value="优化建议">优化建议</SelectItem>
                            <SelectItem value="错误纠正">错误纠正</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 批量操作工具栏 */}
                {selectedFeedbackIds.length > 0 && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            已选择 {selectedFeedbackIds.length} 项
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkProcessFeedback("处理中")}
                          >
                            标记为处理中
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkProcessFeedback("已处理")}
                          >
                            标记为已处理
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFeedbackIds([])}
                          >
                            取消选择
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}


                {/* 列表视图 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">列表视图</h2>
                    <div className="text-sm text-muted-foreground">
                      详细查看所有反馈信息
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredFeedbackData.map((feedback) => (
                      <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <Checkbox
                                checked={selectedFeedbackIds.includes(feedback.id)}
                                onCheckedChange={() => handleSelectFeedback(feedback.id)}
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-medium text-lg">{feedback.question}</h3>
                                  <Badge 
                                    variant={
                                      feedback.status === "待处理" ? "destructive" :
                                      feedback.status === "处理中" ? "default" : "secondary"
                                    }
                                  >
                                    {feedback.status}
                                  </Badge>
                                  <Badge variant="outline">{feedback.category}</Badge>
                                </div>
                                
                                <div className="text-sm text-muted-foreground mb-3">
                                  <p className="mb-1"><strong>原答案：</strong>{feedback.answer}</p>
                                  <p><strong>用户反馈：</strong>{feedback.feedback}</p>
                                </div>

                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <User className="h-3 w-3" />
                                    <span>{feedback.user}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{feedback.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3" />
                                    <span>评分: {feedback.rating}/5</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewFeedback(feedback)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                查看详情
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* 精选问题页面 */}
              <TabsContent value="featured" className="space-y-6">
                {/* 统计信息 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">{featuredQuestions.length}</p>
                          <p className="text-sm text-muted-foreground">精选问题</p>
                        </div>
                        <Star className="h-8 w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">125</p>
                          <p className="text-sm text-muted-foreground">总点赞数</p>
                        </div>
                        <ThumbsUp className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">325</p>
                          <p className="text-sm text-muted-foreground">总浏览量</p>
                        </div>
                        <Eye className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">4.2</p>
                          <p className="text-sm text-muted-foreground">平均评分</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 批量操作工具栏 */}
                {selectedQuestionIds.length > 0 && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            已选择 {selectedQuestionIds.length} 项
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleBulkDeleteQuestions}
                          >
                            批量删除
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedQuestionIds([])}
                          >
                            取消选择
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 精选问题列表 */}
                <div className="space-y-4">
                  {filteredFeaturedQuestions.map((question) => (
                    <Card key={question.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <Checkbox
                              checked={selectedQuestionIds.includes(question.id)}
                              onCheckedChange={() => handleSelectQuestion(question.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-lg">{question.question}</h3>
                                <Badge variant="outline">{question.category}</Badge>
                              </div>

                              <div className="flex flex-wrap gap-1 mb-3">
                                {question.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{question.likes} 点赞</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{question.views} 浏览</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <User className="h-4 w-4" />
                                  <span>{question.author}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{question.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              查看详情
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditQuestion(question)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              编辑
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* 自动评分页面 */}
              <TabsContent value="scoring" className="space-y-6">
                {/* 评分设置 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      自动评分设置
                    </CardTitle>
                    <CardDescription>配置AI自动评分规则和权重</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">启用自动评分</Label>
                        <p className="text-sm text-muted-foreground">AI将自动为问题质量进行评分</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={autoScoringEnabled}
                          onChange={(e) => setAutoScoringEnabled(e.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{autoScoringEnabled ? '已启用' : '已禁用'}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium mb-4 block">评分权重配置</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>准确性 (Accuracy)</Label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={scoringCriteria.accuracy}
                              onChange={(e) => setScoringCriteria(prev => ({...prev, accuracy: parseInt(e.target.value)}))}
                              className="flex-1"
                            />
                            <span className="w-12 text-sm font-medium">{scoringCriteria.accuracy}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>完整性 (Completeness)</Label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={scoringCriteria.completeness}
                              onChange={(e) => setScoringCriteria(prev => ({...prev, completeness: parseInt(e.target.value)}))}
                              className="flex-1"
                            />
                            <span className="w-12 text-sm font-medium">{scoringCriteria.completeness}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>清晰度 (Clarity)</Label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={scoringCriteria.clarity}
                              onChange={(e) => setScoringCriteria(prev => ({...prev, clarity: parseInt(e.target.value)}))}
                              className="flex-1"
                            />
                            <span className="w-12 text-sm font-medium">{scoringCriteria.clarity}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>相关性 (Relevance)</Label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={scoringCriteria.relevance}
                              onChange={(e) => setScoringCriteria(prev => ({...prev, relevance: parseInt(e.target.value)}))}
                              className="flex-1"
                            />
                            <span className="w-12 text-sm font-medium">{scoringCriteria.relevance}%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        总权重: {scoringCriteria.accuracy + scoringCriteria.completeness + scoringCriteria.clarity + scoringCriteria.relevance}%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* 批量评分操作 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      批量评分操作
                    </CardTitle>
                    <CardDescription>对选中的问题进行批量自动评分</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">待评分问题</p>
                        <p className="text-sm text-muted-foreground">
                          共 {feedbackData.length + featuredQuestions.length} 个问题待评分
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsScoring(true)
                            setTimeout(() => setIsScoring(false), 3000)
                          }}
                          disabled={isScoring}
                        >
                          {isScoring ? (
                            <>
                              <Brain className="h-4 w-4 mr-2 animate-spin" />
                              评分中...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              开始评分
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            // 模拟重新评分
                            console.log('重新评分所有问题')
                          }}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          重新评分
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 评分结果统计 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-600">85%</p>
                          <p className="text-sm text-muted-foreground">平均评分</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">156</p>
                          <p className="text-sm text-muted-foreground">已评分问题</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-orange-600">23</p>
                          <p className="text-sm text-muted-foreground">待评分问题</p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-purple-600">92%</p>
                          <p className="text-sm text-muted-foreground">评分准确率</p>
                        </div>
                        <Target className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 评分历史 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      评分历史记录
                    </CardTitle>
                    <CardDescription>查看最近的自动评分记录</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: 1, question: "锅炉压力控制的最佳实践是什么？", score: 85, date: "2024-01-15 14:30", status: "已完成" },
                        { id: 2, question: "如何提高锅炉热效率？", score: 92, date: "2024-01-15 14:25", status: "已完成" },
                        { id: 3, question: "锅炉安全阀的维护周期是多久？", score: 78, date: "2024-01-15 14:20", status: "已完成" },
                        { id: 4, question: "锅炉水质检测标准是什么？", score: 0, date: "2024-01-15 14:15", status: "评分中" },
                      ].map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{record.question}</p>
                            <p className="text-sm text-muted-foreground">{record.date}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            {record.score > 0 ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                {record.score}分
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                评分中
                              </Badge>
                            )}
                            <Badge variant={record.status === "已完成" ? "default" : "secondary"}>
                              {record.status}
                            </Badge>
                          </div>
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

      {/* 反馈详情对话框 */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>反馈详情</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">问题</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedFeedback.question}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">原答案</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedFeedback.answer}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">用户反馈</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedFeedback.feedback}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">处理建议</Label>
                <Textarea
                  placeholder="请输入处理建议..."
                  className="mt-1"
                  value={processingSuggestion}
                  onChange={(e) => setProcessingSuggestion(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveProcessingResult}>
                  保存处理结果
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 编辑问题对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑精选问题</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">问题内容</Label>
                <Textarea
                  placeholder="请输入问题内容..."
                  className="mt-1"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">分类</Label>
                <Input
                  placeholder="请输入分类..."
                  className="mt-1"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">标签（用逗号分隔）</Label>
                <Input
                  placeholder="锅炉, 启动, 安全"
                  className="mt-1"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveQuestionEdit}>
                  保存修改
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}