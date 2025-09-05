"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { QAHeader } from "@/components/qa-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  MessageSquare,
  Bot,
  User,
  Clock,
  Sparkles,
  RotateCcw,
  Plus,
  Globe,
  Brain,
  Zap,
  ChevronDown,
  Image,
  FileText,
  Check,
  Edit3,
  Search,
  Trash2,
  TrendingUp,
  MessageCircle,
  Star,
  FolderOpen,
  HelpCircle,
  Upload,
} from "lucide-react"

export default function QAPage() {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [question, setQuestion] = useState("")
  const [activeTab, setActiveTab] = useState("intelligent-dialogue")
  const [messages, setMessages] = useState<Array<{
    id: number;
    type: string;
    content: string;
    timestamp: string;
    feedback: string | null;
  }>>([])

  // 模拟对话历史数据
  const mockChatHistory = [
    {
      id: 1,
      title: "锅炉温度监控系统故障诊断",
      lastMessage: "根据您提供的故障现象，我建议检查温度传感器的连接线路...",
      lastActive: "2小时前",
      messageCount: 8,
      role: "故障诊断助手",
      model: "DeepSeek-V3"
    },
    {
      id: 2,
      title: "安全标准查询 - 压力容器规范",
      lastMessage: "根据GB/T 150-2011标准，压力容器的设计压力应满足以下要求...",
      lastActive: "5小时前",
      messageCount: 12,
      role: "标准查询助手",
      model: "GPT-4"
    },
    {
      id: 3,
      title: "设备维护计划制定",
      lastMessage: "基于设备运行数据，建议制定以下维护计划：1. 月度检查...",
      lastActive: "1天前",
      messageCount: 15,
      role: "维护专家",
      model: "Claude-3"
    },
    {
      id: 4,
      title: "新员工培训资料整理",
      lastMessage: "培训资料已整理完成，包括安全操作规程、设备操作手册等...",
      lastActive: "2天前",
      messageCount: 6,
      role: "培训助手",
      model: "DeepSeek-V3"
    },
    {
      id: 5,
      title: "技术文档翻译协助",
      lastMessage: "英文技术文档已翻译完成，专业术语已标注，请查收...",
      lastActive: "3天前",
      messageCount: 4,
      role: "翻译助手",
      model: "GPT-4"
    }
  ]

  // 推荐问题数据
  const recommendedQuestions = [
    "锅炉维修手册?",
    "管线生产标准?",
    "电力最新标准是什么?",
    "废水排放处理标准?"
  ]

  // 知识领域数据
  const knowledgeDomains = [
    "通用",
    "技术导则",
    "相关标准",
    "安全规范",
    "维护手册",
    "操作指南",
    "故障诊断",
    "质量控制",
    "环保要求",
    "能源管理",
    "设备选型"
  ]

  const [isLoading, setIsLoading] = useState(false)
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [deepThinkingEnabled, setDeepThinkingEnabled] = useState(false)
  const [selectedModel, setSelectedModel] = useState("deepseek")
  const [contextEnabled, setContextEnabled] = useState(true)
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [selectedRole, setSelectedRole] = useState("标准查询助手")
  const [customRoles, setCustomRoles] = useState<string[]>([])
  const [showNewRoleDialog, setShowNewRoleDialog] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState("通用")
  const [domainOpen, setDomainOpen] = useState(false)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedbackMessageId, setFeedbackMessageId] = useState<number | null>(null)
  const [showQuickFeedbackDialog, setShowQuickFeedbackDialog] = useState(false)
  const [showDocumentSelectDialog, setShowDocumentSelectDialog] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [documentSearchQuery, setDocumentSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // 模拟系统中的文档数据
  const systemDocuments = [
    { id: '1', name: '锅炉安全标准 2024.pdf', type: 'PDF', size: '2.4 MB', category: '安全规范', docNumber: 'DF-2024-001' },
    { id: '2', name: '汽轮机维护手册.pdf', type: 'PDF', size: '3.2 MB', category: '维护指南', docNumber: 'DF-2024-002' },
    { id: '3', name: '发电机技术规范.docx', type: 'DOCX', size: '1.8 MB', category: '技术规范', docNumber: 'DF-2024-003' },
    { id: '4', name: '电气安全操作规程.pdf', type: 'PDF', size: '2.1 MB', category: '操作规程', docNumber: 'DF-2024-004' },
    { id: '5', name: '设备故障诊断指南.pdf', type: 'PDF', size: '4.5 MB', category: '故障诊断', docNumber: 'DF-2024-005' },
    { id: '6', name: '环保排放标准.pdf', type: 'PDF', size: '1.2 MB', category: '环保标准', docNumber: 'DF-2024-006' },
    { id: '7', name: '质量管理体系.doc', type: 'DOC', size: '2.8 MB', category: '质量管理', docNumber: 'DF-2024-007' },
    { id: '8', name: '员工培训手册.pdf', type: 'PDF', size: '3.7 MB', category: '培训资料', docNumber: 'DF-2024-008' },
    { id: '9', name: '锅炉运行参数表.xlsx', type: 'XLSX', size: '0.8 MB', category: '技术规范', docNumber: 'DF-2024-009' },
    { id: '10', name: '安全防护用品清单.pdf', type: 'PDF', size: '1.5 MB', category: '安全规范', docNumber: 'DF-2024-010' },
  ]

  // 获取所有分类
  const categories = ['all', ...Array.from(new Set(systemDocuments.map(doc => doc.category)))]

  // 筛选文档
  const filteredDocuments = systemDocuments.filter(doc => {
    const matchesSearch = documentSearchQuery === "" || 
      doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(documentSearchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFeedback = (messageId: number, type: string) => {
    if (type === 'thumbsDown') {
      setFeedbackMessageId(messageId)
      setShowFeedbackDialog(true)
    } else {
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, feedback: type }
          : msg
      ))
    }
  }

  const handleUploadImage = () => {
    // 创建文件输入元素
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('上传图片:', file.name)
        // 这里可以添加上传逻辑
      }
    }
    input.click()
  }

  const handleUploadFile = () => {
    // 创建文件输入元素
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('上传文件:', file.name)
        // 这里可以添加上传逻辑
      }
    }
    input.click()
  }

  const handleSelectExistingDocument = () => {
    // 打开文档选择对话框
    setShowDocumentSelectDialog(true)
  }

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    )
  }

  const handleConfirmDocumentSelection = () => {
    const selectedDocs = systemDocuments.filter(doc => selectedDocuments.includes(doc.id))
    console.log('选择的文档:', selectedDocs)
    setShowDocumentSelectDialog(false)
    // 不清空selectedDocuments，保留用于显示预览
    setDocumentSearchQuery("")
    setSelectedCategory("all")
    // 这里可以将选中的文档添加到问题中
  }

  const handleCancelDocumentSelection = () => {
    setShowDocumentSelectDialog(false)
    setSelectedDocuments([])
    setDocumentSearchQuery("")
    setSelectedCategory("all")
  }

  const handleEditRole = (role: string) => {
    console.log('编辑角色:', role)
    // 这里可以添加编辑角色的逻辑，比如打开编辑对话框
  }

  const handleNewRole = () => {
    setShowNewRoleDialog(true)
  }

  const handleCreateRole = (roleName: string) => {
    setCustomRoles(prev => [...prev, roleName])
    setSelectedRole(roleName)
    setShowNewRoleDialog(false)
  }

  const isSystemRole = (role: string) => {
    return role === "故障诊断助手" || role === "标准查询助手"
  }

  const handleSendMessage = () => {
    if (!question.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString(),
      feedback: null,
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setQuestion("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "assistant",
        content: `关于"${question}"的问题，我为您找到以下答案：\n\n根据东方电气集团的技术规范，关于这个问题的详细说明如下...\n\n建议您参考相关标准文件获取更详细的信息。`,
        timestamp: new Date().toLocaleTimeString(),
        feedback: null,
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

  const handleRecommendedQuestion = (question: string) => {
    setQuestion(question)
  }

  // 检查是否有用户消息
  const hasUserMessages = messages.some(msg => msg.type === 'user')

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFeedbackSubmit = (feedbackData: { type: string, content: string, major: string }) => {
    if (feedbackMessageId) {
      setMessages(prev => prev.map(msg =>
        msg.id === feedbackMessageId
          ? { ...msg, feedback: 'thumbsDown', feedbackContent: feedbackData.content }
          : msg
      ))
    }
    setShowFeedbackDialog(false)
    setFeedbackMessageId(null)
  }

  const handleQuickFeedbackSubmit = (feedbackData: { type: string, content: string }) => {
    // 处理系统问题反馈
    console.log('系统问题反馈:', feedbackData)
    setShowQuickFeedbackDialog(false)
  }

  return (
      <div className="flex h-screen bg-background">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <QAHeader 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onFeedbackClick={() => setShowQuickFeedbackDialog(true)}
          />

        <main className="flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="h-full flex flex-col">
            {activeTab === "intelligent-dialogue" && (
              <>
                {/* Chat Messages Area */}
                <div className="flex-1 p-6 bg-gray-50 min-h-0">
                  <div className="w-full h-full relative">
                    {/* Chat Messages */}
                    <div className="h-full space-y-6 overflow-y-auto pb-6">
                      {/* 推荐问题 - 只在没有用户消息时显示 */}
                      {!hasUserMessages && (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Bot className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">您好！我是东方电气集团的智能助手</h2>
                            <p className="text-gray-600 mb-6">我可以帮您解答关于锅炉技术、安全规范、维护流程等方面的问题</p>
                          </div>
                          
                          <div className="w-full max-w-2xl">
                            <p className="text-sm text-gray-500 mb-4 text-center">推荐问题：</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {recommendedQuestions.map((question, index) => (
                                <button
                                  key={index}
                                  onClick={() => !isLoading && handleRecommendedQuestion(question)}
                                  disabled={isLoading}
                                  className="flex items-center text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white"
                                >
                                  <TrendingUp className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{question}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {messages.map((message) => (
                              <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                                {message.type === 'assistant' && (
                            <Avatar className="w-10 h-10 bg-primary/10">
                              <AvatarFallback className="bg-primary text-white">
                                <Bot className="w-5 h-5" />
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                                      <div className={`flex-1 max-w-[85%] ${message.type === 'user' ? 'flex flex-col items-end' : ''}`}>
                            <div className={`rounded-2xl p-4 ${
                                    message.type === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-white border border-primary/20 shadow-sm'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>

                                    {/* Feedback buttons for assistant messages */}
                                    {message.type === 'assistant' && (
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                      className={`h-8 px-3 rounded-full ${message.feedback === 'thumbsUp' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-primary/10'}`}
                                            onClick={() => handleFeedback(message.id, 'thumbsUp')}
                                          >
                                      <ThumbsUp className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                      className={`h-8 px-3 rounded-full ${message.feedback === 'thumbsDown' ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                                            onClick={() => handleFeedback(message.id, 'thumbsDown')}
                                          >
                                      <ThumbsDown className="w-4 h-4" />
                                          </Button>
                                        </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full text-gray-500 hover:text-gray-700">
                                      <Star className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full text-gray-500 hover:text-gray-700">
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                      </div>
                                    )}
                                  </div>
                            <div className={`text-xs text-gray-500 mt-2 flex items-center ${message.type === 'user' ? 'justify-end' : ''}`}>
                                    <Clock className="w-3 h-3 mr-1" />
                                    {message.timestamp}
                                  </div>
                                </div>
                                {message.type === 'user' && (
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gray-600 text-white">
                                <User className="w-5 h-5" />
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            ))}
                            {isLoading && (
                              <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10 bg-primary/10">
                            <AvatarFallback className="bg-primary text-white">
                              <Bot className="w-5 h-5" />
                                  </AvatarFallback>
                                </Avatar>
                          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
                                  <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-sm">正在思考...</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* 自动滚动锚点 */}
                            <div ref={messagesEndRef} />
                          </div>
                  </div>
                </div>

                {/* 选中文档预览区域 */}
                {selectedDocuments.length > 0 && (
                  <div className="border-t border-gray-200 bg-gray-50 px-3 py-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1.5 flex-1 overflow-x-auto">
                        {selectedDocuments.map(docId => {
                          const doc = systemDocuments.find(d => d.id === docId)
                          if (!doc) return null
                          return (
                            <div key={docId} className="bg-white rounded px-2 py-1 border border-gray-200 flex items-center space-x-1.5 text-xs h-6 flex-shrink-0">
                              <FileText className="w-3 h-3 text-green-600 flex-shrink-0" />
                              <span className="text-gray-900 truncate max-w-32">{doc.name}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 flex-shrink-0">
                        <span>{selectedDocuments.length}个文档</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDocuments([])}
                          className="text-xs text-gray-500 hover:text-gray-700 h-5 px-1.5"
                        >
                          清除
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Input Area */}
                <div className="bg-gray-50 p-4 flex-shrink-0 min-h-[100px]">
                  <div className="w-full">
                    <div className="space-y-3">
                      {/* Main Input Row */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                          <Textarea
                            placeholder={isLoading ? "AI正在回复中，请稍候..." : "请输入您的问题，或从上方选择热门问题..."}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && !isLoading) {
                                e.preventDefault()
                                handleSendMessage()
                              }
                            }}
                            disabled={isLoading}
                            className="min-h-12 max-h-32 text-base border-2 border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                            rows={1}
                          />
                        </div>
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={!question.trim() || isLoading}
                          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary-hover shadow-sm transition-all duration-200"
                        >
                          <Send className="w-5 h-5 text-white" />
                        </Button>
                      </div>

                      {/* Bottom Controls Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Knowledge Domain Selection */}
                          <div className="flex items-center">
                            <Popover open={domainOpen} onOpenChange={setDomainOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  role="combobox"
                                  aria-expanded={domainOpen}
                                  className="h-8 px-3 justify-between text-sm font-medium text-foreground hover:bg-accent rounded-md"
                                >
                                  {selectedDomain}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-32 p-0">
                                <Command>
                                  <CommandInput placeholder="搜索领域..." />
                                  <CommandList>
                                    <CommandEmpty>未找到相关领域</CommandEmpty>
                                    <CommandGroup>
                                      {knowledgeDomains.map((domain) => (
                                        <CommandItem
                                          key={domain}
                                          value={domain}
                                          onSelect={(currentValue) => {
                                            setSelectedDomain(currentValue === selectedDomain ? "" : currentValue)
                                            setDomainOpen(false)
                                          }}
                                        >
                                          {domain}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* Model Selection */}
                          <div className="flex items-center">
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                              <SelectTrigger className="h-8 px-3 border-0 bg-transparent text-sm font-medium text-foreground hover:bg-accent rounded-md">
                                <SelectValue placeholder="DeepSeek" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="deepseek">DeepSeek</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="r1">R1</SelectItem>
                                <SelectItem value="claude">Claude</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Deep Thinking Toggle */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeepThinkingEnabled(!deepThinkingEnabled)}
                            className={`h-8 px-3 rounded-md text-sm transition-all duration-200 ${
                              deepThinkingEnabled 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                            }`}
                          >
                            <Brain className="w-4 h-4 mr-1" />
                            深度思考
                          </Button>

                          {/* Preset Role */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                              >
                                @ 预设角色
                                <ChevronDown className="w-3 h-3 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                                预设角色
                              </div>
                              
                              {/* 系统默认角色 */}
                              <DropdownMenuItem 
                                onClick={() => setSelectedRole("故障诊断助手")} 
                                className="cursor-pointer flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  {selectedRole === "故障诊断助手" && <Check className="w-4 h-4 mr-2" />}
                                  {selectedRole !== "故障诊断助手" && <div className="w-4 h-4 mr-2" />}
                                  故障诊断助手
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditRole("故障诊断助手")
                                  }}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => setSelectedRole("标准查询助手")} 
                                className="cursor-pointer flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  {selectedRole === "标准查询助手" && <Check className="w-4 h-4 mr-2" />}
                                  {selectedRole !== "标准查询助手" && <div className="w-4 h-4 mr-2" />}
                                  标准查询助手
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditRole("标准查询助手")
                                  }}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                              </DropdownMenuItem>

                              {/* 分隔符 */}
                              <DropdownMenuSeparator />

                              {/* 用户自定义角色 */}
                              {customRoles.length > 0 && (
                                <>
                                  <div className="px-2 py-1 text-xs font-medium text-gray-400">
                                    用户自定义
                                  </div>
                                  {customRoles.map((role) => (
                                    <DropdownMenuItem 
                                      key={role}
                                      onClick={() => setSelectedRole(role)} 
                                      className="cursor-pointer flex items-center justify-between"
                                    >
                                      <div className="flex items-center">
                                        {selectedRole === role && <Check className="w-4 h-4 mr-2" />}
                                        {selectedRole !== role && <div className="w-4 h-4 mr-2" />}
                                        {role}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-gray-100"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditRole(role)
                                        }}
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </Button>
                                    </DropdownMenuItem>
                                  ))}
                                  <DropdownMenuSeparator />
                                </>
                              )}

                              {/* 新建角色 */}
                              <DropdownMenuItem 
                                onClick={handleNewRole}
                                className="cursor-pointer flex items-center text-blue-600 hover:text-blue-700"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                新建角色
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {/* Upload Options */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                              >
                                <Upload className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={handleUploadImage} className="cursor-pointer">
                                <Image className="w-4 h-4 mr-2" />
                                图片
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleUploadFile} className="cursor-pointer">
                                <FileText className="w-4 h-4 mr-2" />
                                本地文件
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleSelectExistingDocument} className="cursor-pointer">
                                <FolderOpen className="w-4 h-4 mr-2" />
                                选择已有文档
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {/* New Chat Button */}
                          <Button
                            onClick={() => {
                              setQuestion("")
                              setMessages([])
                              // 保留选中的文档，不清除
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-muted-foreground hover:bg-accent hover:text-foreground text-sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            新开对话
                          </Button>

                        </div>

                        <div className="text-xs text-muted-foreground flex items-center">
                          内容由AI生成，仅供参考
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}



            {activeTab === "dialogue-history" && (
                              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif font-bold text-lg">对话历史</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="搜索对话历史..." 
                          className="pl-10 w-64 bg-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 对话历史列表 */}
                  <div className="space-y-4">
                    {mockChatHistory.map((conversation) => (
                      <div key={conversation.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {conversation.title}
                                  </span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {conversation.messageCount} 条消息
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                                  <Star className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                                  onClick={() => {
                                    // 这里可以添加删除对话的逻辑
                                    console.log('删除对话:', conversation.id)
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-3">
                              {conversation.lastMessage}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {conversation.lastActive}
                              </div>
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {conversation.role}
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {conversation.model}
                              </div>
                            </div>
                          </div>
                          

                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 分页 */}
                  <div className="flex items-center justify-between mt-8">
                    <div className="text-sm text-gray-500">
                      显示 1-{mockChatHistory.length} 条，共 {mockChatHistory.length} 条对话
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        上一页
                      </Button>
                      <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                        1
                      </Button>
                      <Button variant="outline" size="sm">
                        2
                      </Button>
                      <Button variant="outline" size="sm">
                        下一页
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 新建角色对话框 */}
      <Dialog open={showNewRoleDialog} onOpenChange={setShowNewRoleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新建角色</DialogTitle>
          </DialogHeader>
          <NewRoleForm onCreateRole={handleCreateRole} onCancel={() => setShowNewRoleDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* 反馈提交表单对话框 */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>提交反馈</DialogTitle>
          </DialogHeader>
          <FeedbackForm onSubmit={handleFeedbackSubmit} onCancel={() => setShowFeedbackDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* 快速反馈表单对话框 */}
      <Dialog open={showQuickFeedbackDialog} onOpenChange={setShowQuickFeedbackDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>系统问题反馈</DialogTitle>
          </DialogHeader>
          <QuickFeedbackForm onSubmit={handleQuickFeedbackSubmit} onCancel={() => setShowQuickFeedbackDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* 文档选择对话框 */}
      <Dialog open={showDocumentSelectDialog} onOpenChange={setShowDocumentSelectDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>选择已有文档</DialogTitle>
            <p className="text-sm text-muted-foreground">选择您想要引用的文档进行提问</p>
          </DialogHeader>
          <div className="space-y-4">
            {/* 搜索和筛选区域 */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="搜索文档名称或编号..."
                      value={documentSearchQuery}
                      onChange={(e) => setDocumentSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分类</SelectItem>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-gray-500">
                找到 {filteredDocuments.length} 个文档
              </div>
            </div>


            {/* 文档列表 */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedDocuments.includes(doc.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDocumentToggle(doc.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => handleDocumentToggle(doc.id)}
                    className="h-4 w-4 text-primary"
                  />
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="font-mono bg-gray-100 px-1 rounded">{doc.docNumber}</span>
                      <span>•</span>
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-sm text-gray-500">
                已选择 {selectedDocuments.length} 个文档
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancelDocumentSelection}
                >
                  取消
                </Button>
                <Button
                  onClick={handleConfirmDocumentSelection}
                  disabled={selectedDocuments.length === 0}
                >
                  确认选择
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 新建角色表单组件
function NewRoleForm({ onCreateRole, onCancel }: { onCreateRole: (name: string) => void, onCancel: () => void }) {
  const [roleName, setRoleName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (roleName.trim()) {
      onCreateRole(roleName.trim())
      setRoleName("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="roleName" className="text-sm font-medium">
          角色名称
        </label>
        <Input
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="请输入角色名称"
          className="mt-1"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled={!roleName.trim()}>
          创建
        </Button>
      </div>
    </form>
  )
}

// 反馈表单组件
function FeedbackForm({ onSubmit, onCancel }: { onSubmit: (data: { type: string, content: string, major: string }) => void, onCancel: () => void }) {
  const [feedbackType, setFeedbackType] = useState("")
  const [feedbackContent, setFeedbackContent] = useState("")
  const [selectedMajor, setSelectedMajor] = useState("auto")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (feedbackType && feedbackContent.trim()) {
      onSubmit({ type: feedbackType, content: feedbackContent.trim(), major: selectedMajor })
      setFeedbackType("")
      setFeedbackContent("")
      setSelectedMajor("auto")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="selectedMajor" className="text-sm font-medium mb-2 block">
            专业领域
          </label>
          <Select value={selectedMajor} onValueChange={setSelectedMajor}>
            <SelectTrigger>
              <SelectValue placeholder="请选择专业领域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">自动分配</SelectItem>
              <SelectItem value="boiler">锅炉技术</SelectItem>
              <SelectItem value="turbine">汽轮机技术</SelectItem>
              <SelectItem value="generator">发电机技术</SelectItem>
              <SelectItem value="electrical">电气工程</SelectItem>
              <SelectItem value="mechanical">机械工程</SelectItem>
              <SelectItem value="safety">安全工程</SelectItem>
              <SelectItem value="maintenance">设备维护</SelectItem>
              <SelectItem value="quality">质量管理</SelectItem>
              <SelectItem value="environmental">环保技术</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="feedbackType" className="text-sm font-medium mb-2 block">
            反馈类型
          </label>
          <Select value={feedbackType} onValueChange={setFeedbackType}>
            <SelectTrigger>
              <SelectValue placeholder="请选择反馈类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inaccurate">回答不准确</SelectItem>
              <SelectItem value="incomplete">回答不完整</SelectItem>
              <SelectItem value="irrelevant">回答不相关</SelectItem>
              <SelectItem value="technical">技术问题</SelectItem>
              <SelectItem value="other">其他问题</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label htmlFor="feedbackContent" className="text-sm font-medium mb-2 block">
          详细说明
        </label>
        <Textarea
          id="feedbackContent"
          placeholder="请详细描述您遇到的问题或建议..."
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
          className="min-h-24"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled={!feedbackType || !feedbackContent.trim()}>
          提交反馈
        </Button>
      </div>
    </form>
  )
}

// 快速反馈表单组件
function QuickFeedbackForm({ onSubmit, onCancel }: { onSubmit: (data: { type: string, content: string }) => void, onCancel: () => void }) {
  const [feedbackType, setFeedbackType] = useState("")
  const [feedbackContent, setFeedbackContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (feedbackType && feedbackContent.trim()) {
      onSubmit({ type: feedbackType, content: feedbackContent.trim() })
      setFeedbackType("")
      setFeedbackContent("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="quickFeedbackType" className="text-sm font-medium mb-2 block">
          问题类型
        </label>
        <Select value={feedbackType} onValueChange={setFeedbackType}>
          <SelectTrigger>
            <SelectValue placeholder="请选择问题类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bug">系统错误</SelectItem>
            <SelectItem value="performance">性能问题</SelectItem>
            <SelectItem value="ui">界面问题</SelectItem>
            <SelectItem value="feature">功能建议</SelectItem>
            <SelectItem value="other">其他问题</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="quickFeedbackContent" className="text-sm font-medium mb-2 block">
          问题描述
        </label>
        <Textarea
          id="quickFeedbackContent"
          placeholder="请详细描述您遇到的问题..."
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
          className="min-h-24"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled={!feedbackType || !feedbackContent.trim()}>
          提交反馈
        </Button>
      </div>
    </form>
  )
}