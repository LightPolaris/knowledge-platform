"use client"

import React, { useState } from "react"
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
  Filter,
  Trash2,
  TrendingUp,
  MessageCircle,
} from "lucide-react"

export default function QAPage() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [activeTab, setActiveTab] = useState("intelligent-dialogue")
  const [messages, setMessages] = useState<Array<{
    id: number;
    type: string;
    content: string;
    timestamp: string;
    feedback: string | null;
  }>>([
    {
      id: 1,
      type: "assistant",
      content: "您好！我是东方电气集团的智能助手。我可以帮您解答关于锅炉技术、安全规范、维护流程等方面的问题。请问有什么可以帮助您的吗？",
      timestamp: "11:04:30",
      feedback: null,
    },
  ])

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

  const handleFeedbackSubmit = (feedbackData: { type: string, content: string }) => {
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
                        <div className="absolute bottom-4 left-6 p-4 max-w-sm">
                          <div className="space-y-2">
                            {recommendedQuestions.map((question, index) => (
                              <button
                                key={index}
                                onClick={() => handleRecommendedQuestion(question)}
                                className="flex items-center w-full text-left p-2 hover:bg-gray-100 transition-colors"
                              >
                                <TrendingUp className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm text-gray-700">{question}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {messages.map((message) => (
                              <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                                {message.type === 'assistant' && (
                            <Avatar className="w-10 h-10 bg-green-100">
                              <AvatarFallback className="bg-green-600 text-white">
                                <Bot className="w-5 h-5" />
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                                      <div className={`flex-1 max-w-[85%] ${message.type === 'user' ? 'flex flex-col items-end' : ''}`}>
                            <div className={`rounded-2xl p-4 ${
                                    message.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200 shadow-sm'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>

                                    {/* Feedback buttons for assistant messages */}
                                    {message.type === 'assistant' && (
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                      className={`h-8 px-3 rounded-full ${message.feedback === 'thumbsUp' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
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
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 px-3 rounded-full text-gray-500 hover:text-gray-700"
                                      onClick={() => {
                                        setFeedbackMessageId(message.id)
                                        setShowFeedbackDialog(true)
                                      }}
                                    >
                                      <MessageCircle className="w-4 h-4" />
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
                          <Avatar className="w-10 h-10 bg-green-100">
                            <AvatarFallback className="bg-green-600 text-white">
                              <Bot className="w-5 h-5" />
                                  </AvatarFallback>
                                </Avatar>
                          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
                                  <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 animate-spin text-green-600" />
                                    <span className="text-sm">正在思考...</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                  </div>
                </div>

                {/* Bottom Input Area */}
                <div className="border-t border-gray-200 bg-white p-6 flex-shrink-0 min-h-[149px]">
                  <div className="w-full">
                    <div className="space-y-4">
                      {/* Main Input Row */}
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                          <Textarea
                            placeholder="请输入您的问题，或从上方选择热门问题..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                              }
                            }}
                            className="min-h-12 max-h-32 text-base border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-0 resize-none"
                            rows={1}
                          />
                        </div>
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={!question.trim() || isLoading}
                          className="h-12 w-12 rounded-xl bg-green-600 hover:bg-green-700 shadow-md"
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Bottom Controls Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {/* Knowledge Domain Selection */}
                          <div className="flex items-center space-x-1">
                            <Popover open={domainOpen} onOpenChange={setDomainOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  role="combobox"
                                  aria-expanded={domainOpen}
                                  className="w-32 h-8 justify-between text-sm font-medium"
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
                          <div className="flex items-center space-x-1">
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                              <SelectTrigger className="w-36 h-8 border-0 bg-transparent text-sm font-medium">
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
                            className={`h-8 px-3 rounded-full text-sm ${deepThinkingEnabled ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
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
                                className="h-8 px-3 rounded-full text-sm text-gray-600 hover:bg-gray-100"
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
                                className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
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
                            </DropdownMenuContent>
                          </DropdownMenu>


                        </div>

                        <div className="text-xs text-gray-500">
                          内容由AI生成，仅供参考
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}



            {activeTab === "dialogue-history" && (
              <div className="flex-1 p-6">
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
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        筛选
                      </Button>
                    </div>
                  </div>

                  {/* 对话历史列表 */}
                  <div className="space-y-4">
                    {mockChatHistory.map((conversation) => (
                      <div key={conversation.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-900">
                                  {conversation.title}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {conversation.messageCount} 条消息
                              </Badge>
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
function FeedbackForm({ onSubmit, onCancel }: { onSubmit: (data: { type: string, content: string }) => void, onCancel: () => void }) {
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