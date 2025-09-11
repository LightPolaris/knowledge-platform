"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
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
  X,
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


  // 精选问题数据
  const featuredQuestions = [
    {
      question: "质保体系审核流程是什么?",
      category: "质保部",
      likes: 45
    },
    {
      question: "不合格品处理标准有哪些?",
      category: "质保部", 
      likes: 38
    },
    {
      question: "锅炉水压试验压力如何确定?",
      category: "技术部",
      likes: 32
    },
    {
      question: "压力容器定期检验周期?",
      category: "检验部",
      likes: 28
    }
  ]

  // 三级分类知识领域数据
  const knowledgeHierarchy = {
    "全部": {
      "全部文档": ["全部标准", "基础规范", "全部流程"]
    },
    "技术导则": {
      "锅炉": ["锅炉设计", "锅炉制造", "锅炉安装", "锅炉调试"],
      "汽轮机": ["汽轮机设计", "汽轮机制造", "汽轮机维护"],
      "发电机": ["发电机设计", "发电机制造", "发电机检修"],
      "辅助设备": ["泵类设备", "阀门设备", "管道系统"]
    },
    "相关标准": {
      "国家标准": ["GB标准", "GB/T标准", "GBJ标准"],
      "行业标准": ["JB标准", "HG标准", "SH标准"],
      "国际标准": ["ISO标准", "IEC标准", "ASME标准"]
    },
    "安全规范": {
      "压力容器": ["压力容器设计", "压力容器制造", "压力容器检验"],
      "锅炉安全": ["锅炉安全技术", "锅炉安全监察", "锅炉安全运行"],
      "电气安全": ["电气安全规范", "防爆电气", "接地保护"]
    },
    "维护手册": {
      "预防性维护": ["定期检查", "润滑保养", "清洁维护"],
      "故障维修": ["故障诊断", "故障排除", "备件更换"],
      "大修指南": ["大修计划", "大修工艺", "大修验收"]
    },
    "操作指南": {
      "启动操作": ["冷态启动", "热态启动", "紧急启动"],
      "运行操作": ["正常运行", "负荷调节", "参数监控"],
      "停机操作": ["正常停机", "紧急停机", "维护停机"]
    },
    "故障诊断": {
      "机械故障": ["振动故障", "磨损故障", "密封故障"],
      "电气故障": ["电机故障", "控制故障", "保护故障"],
      "热力故障": ["传热故障", "燃烧故障", "汽水故障"]
    },
    "质量控制": {
      "材料检验": ["原材料检验", "焊接材料检验", "成品检验"],
      "工艺控制": ["焊接工艺", "热处理工艺", "机械加工工艺"],
      "质量体系": ["ISO9001", "质量审核", "质量改进"]
    },
    "环保要求": {
      "排放控制": ["大气排放", "水排放", "噪声控制"],
      "环保设备": ["除尘设备", "脱硫设备", "脱硝设备"],
      "环保监测": ["在线监测", "定期监测", "应急监测"]
    },
    "能源管理": {
      "节能技术": ["余热利用", "变频技术", "优化控制"],
      "能源监测": ["能耗统计", "能效分析", "节能评估"],
      "新能源": ["太阳能", "风能", "生物质能"]
    },
    "设备选型": {
      "锅炉选型": ["锅炉类型", "容量选择", "参数匹配"],
      "汽轮机选型": ["汽轮机类型", "功率选择", "效率优化"],
      "辅助设备选型": ["泵类选型", "阀门选型", "管道选型"]
    }
  }

  const [isLoading, setIsLoading] = useState(false)
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [deepThinkingEnabled, setDeepThinkingEnabled] = useState(false)
  const [selectedModel, setSelectedModel] = useState("deepseek")
  const [contextEnabled, setContextEnabled] = useState(true)
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [selectedRole, setSelectedRole] = useState("标准查询助手")
  const [customRoles, setCustomRoles] = useState<string[]>([])
  const [showNewRoleDialog, setShowNewRoleDialog] = useState(false)
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [domainOpen, setDomainOpen] = useState(false)
  const [currentLevel1, setCurrentLevel1] = useState<string | null>(null)
  const [currentLevel2, setCurrentLevel2] = useState<string | null>(null)
  const [showLevel2, setShowLevel2] = useState(false)
  const [showLevel3, setShowLevel3] = useState(false)
  const [selectedLevel1Categories, setSelectedLevel1Categories] = useState<string[]>([])
  const [selectedLevel2Categories, setSelectedLevel2Categories] = useState<string[]>([])
  const [isGeneralSelected, setIsGeneralSelected] = useState(false)
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedbackMessageId, setFeedbackMessageId] = useState<number | null>(null)
  const [showQuickFeedbackDialog, setShowQuickFeedbackDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("")
  const [selectedPdfTitle, setSelectedPdfTitle] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)

  // 文档引用映射
  const documentReferences = {
    "GB/T 16507-2022 水管锅炉技术条件": {
      title: "GB/T 16507-2022 水管锅炉技术条件",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      docNumber: "GB/T 16507-2022"
    },
    "东方电气集团锅炉维修标准 Q/DF-2024-001": {
      title: "东方电气集团锅炉维修标准",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      docNumber: "Q/DF-2024-001"
    },
    "ASME BPVC.1 锅炉压力容器规范": {
      title: "ASME BPVC.1 锅炉压力容器规范",
      url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      docNumber: "ASME BPVC.1"
    }
  }

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

  // 处理引用点击
  const handleReferenceClick = (referenceText: string) => {
    const docRef = documentReferences[referenceText as keyof typeof documentReferences]
    if (docRef) {
      setSelectedPdfUrl(docRef.url)
      setSelectedPdfTitle(docRef.title)
      setShowPdfViewer(true)
    }
  }

  // 搜索功能
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    
    setIsSearching(true)
    const results: string[] = []
    
    // 搜索知识领域
    Object.keys(knowledgeHierarchy).forEach(level1 => {
      if (level1.toLowerCase().includes(query.toLowerCase())) {
        results.push(level1)
      }
      
      Object.keys(knowledgeHierarchy[level1]).forEach(level2 => {
        if (level2.toLowerCase().includes(query.toLowerCase())) {
          results.push(`${level1} > ${level2}`)
        }
        
        knowledgeHierarchy[level1][level2].forEach(level3 => {
          if (level3.toLowerCase().includes(query.toLowerCase())) {
            results.push(`${level1} > ${level2} > ${level3}`)
          }
        })
      })
    })
    
    setSearchResults(results)
    setIsSearching(false)
  }

  // 处理知识领域选择
  const handleLevel1Select = (level1: string) => {
    setCurrentPath([level1])
    setIsGeneralSelected(false)
  }

  // 处理专业选择
  const handleLevel2Select = (level2: string) => {
    if (currentPath.length === 1) {
      setCurrentPath([...currentPath, level2])
    }
  }

  // 处理文档选择
  const handleLevel3Select = (level3: string) => {
    if (currentPath.length === 2) {
      const fullPath = `${currentPath[0]} > ${currentPath[1]} > ${level3}`
      setSelectedDomains(prev => {
        if (prev.includes(fullPath)) {
          return prev.filter(item => item !== fullPath)
        } else {
          return [...prev, fullPath]
        }
      })

      // 更新知识领域选择状态
      setSelectedLevel1Categories(prev => {
        if (prev.includes(currentPath[0])) {
          return prev
        } else {
          return [...prev, currentPath[0]]
        }
      })

      // 更新专业选择状态
      setSelectedLevel2Categories(prev => {
        const level2Key = `${currentPath[0]} > ${currentPath[1]}`
        if (prev.includes(level2Key)) {
          return prev
        } else {
          return [...prev, level2Key]
        }
      })
    }
  }

  // 返回上级目录
  const goBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  // 处理知识领域勾选/取消勾选
  const handleLevel1Toggle = (level1: string) => {
    setSelectedLevel1Categories(prev => {
      if (prev.includes(level1)) {
        // 取消勾选：清除该知识领域下的所有选择
        setSelectedDomains(prevDomains =>
          prevDomains.filter(domain => !domain.startsWith(level1))
        )
        setSelectedLevel2Categories(prevLevel2 =>
          prevLevel2.filter(cat => !cat.startsWith(level1))
        )
        return prev.filter(cat => cat !== level1)
      } else {
        // 勾选：自动选中该知识领域下的所有专业和文档
        const allLevel2Categories = Object.keys(knowledgeHierarchy[level1]).map(level2 => `${level1} > ${level2}`)
        setSelectedLevel2Categories(prevLevel2 => {
          const newLevel2Categories = [...prevLevel2]
          allLevel2Categories.forEach(level2Key => {
            if (!newLevel2Categories.includes(level2Key)) {
              newLevel2Categories.push(level2Key)
            }
          })
          return newLevel2Categories
        })
        
        // 选中所有文档
        const allDocuments: string[] = []
        Object.keys(knowledgeHierarchy[level1]).forEach(level2 => {
          knowledgeHierarchy[level1][level2].forEach(level3 => {
            allDocuments.push(`${level1} > ${level2} > ${level3}`)
          })
        })
        setSelectedDomains(prevDomains => {
          const newDomains = [...prevDomains]
          allDocuments.forEach(doc => {
            if (!newDomains.includes(doc)) {
              newDomains.push(doc)
            }
          })
          return newDomains
        })
        
        return [...prev, level1]
      }
    })
    setIsGeneralSelected(false)
  }

  // 处理专业选择

  // 处理专业勾选/取消勾选
  const handleLevel2Toggle = (level2: string) => {
    if (currentPath.length === 1) {
      const level2Key = `${currentPath[0]} > ${level2}`
      setSelectedLevel2Categories(prev => {
        if (prev.includes(level2Key)) {
          // 取消勾选：清除该专业下的所有选择
          setSelectedDomains(prevDomains =>
            prevDomains.filter(domain => !domain.startsWith(level2Key))
          )
          return prev.filter(cat => cat !== level2Key)
        } else {
          // 勾选：自动选中该专业下的所有文档
          const allDocuments = knowledgeHierarchy[currentPath[0]][level2].map(level3 => 
            `${currentPath[0]} > ${level2} > ${level3}`
          )
          setSelectedDomains(prevDomains => {
            const newDomains = [...prevDomains]
            allDocuments.forEach(doc => {
              if (!newDomains.includes(doc)) {
                newDomains.push(doc)
              }
            })
            return newDomains
          })
          
          // 确保知识领域也被选中
          setSelectedLevel1Categories(prev => {
            if (prev.includes(currentPath[0])) {
              return prev
            } else {
              return [...prev, currentPath[0]]
            }
          })
          
          return [...prev, level2Key]
        }
      })
    }
  }


  // 清除所有选择
  const clearAllSelections = () => {
    setSelectedDomains([])
    setSelectedLevel1Categories([])
    setSelectedLevel2Categories([])
    setCurrentLevel1(null)
    setCurrentLevel2(null)
    setShowLevel2(false)
    setShowLevel3(false)
    setIsGeneralSelected(false)
    setCurrentPath([])
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

    const currentQuestion = question.trim()
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: currentQuestion,
      timestamp: new Date().toLocaleTimeString(),
      feedback: null,
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setQuestion("")

    // Simulate AI response
    setTimeout(() => {
      try {
        const aiResponse = {
          id: Date.now() + 1,
          type: "assistant",
          content: `关于"${currentQuestion}"的问题，我为您找到以下答案：\n\n根据东方电气集团的技术规范，关于这个问题的详细说明如下：\n\n1. **技术标准要求**\n   - 符合GB/T 16507-2022水管锅炉技术条件\n   - 遵循ASME BPVC.1锅炉压力容器规范\n   - 满足东方电气集团内部标准Q/DF-2024-001\n\n2. **具体实施建议**\n   - 定期进行设备检查和维护\n   - 建立完善的安全监控体系\n   - 制定详细的应急预案\n\n**引用来源：**\n\n- GB/T 16507-2022 水管锅炉技术条件\n- 东方电气集团锅炉维修标准 Q/DF-2024-001\n- ASME BPVC.1 锅炉压力容器规范\n\n建议您参考相关标准文件获取更详细的信息。如有其他问题，请随时询问。`,
          timestamp: new Date().toLocaleTimeString(),
          feedback: null,
        }
        setMessages(prev => [...prev, aiResponse])
      } catch (error) {
        console.error('AI响应生成失败:', error)
        const errorResponse = {
          id: Date.now() + 1,
          type: "assistant",
          content: "抱歉，我暂时无法处理您的问题。请稍后重试或联系技术支持。",
          timestamp: new Date().toLocaleTimeString(),
          feedback: null,
        }
        setMessages(prev => [...prev, errorResponse])
      } finally {
        setIsLoading(false)
      }
    }, 2000)
  }

  const handleRecommendedQuestion = (question: string) => {
    setQuestion(question)
  }

  // 处理反馈
  const handleFeedback = (messageId: number, feedbackType: 'thumbsUp' | 'thumbsDown') => {
    if (feedbackType === 'thumbsDown') {
      setFeedbackMessageId(messageId)
      setShowFeedbackDialog(true)
    } else {
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, feedback: feedbackType }
          : msg
      ))
    }
  }

  // 清空对话
  const handleClearMessages = () => {
    setMessages([])
    setQuestion("")
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
            onNotificationClick={() => router.push("/notifications")}
          />

        <main className="flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="h-full flex flex-col">
            {activeTab === "intelligent-dialogue" && (
              <>
                {/* Chat Messages Area */}
                <div className="flex-1 p-6 bg-gray-50 min-h-0 flex">
                  <div className="w-full h-full relative flex-1">
                    
                    {/* Chat Messages */}
                    <div className="h-full space-y-6 overflow-y-auto pb-6">
                      {/* 推荐问题 - 只在没有用户消息时显示 */}
                      {!hasUserMessages && (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="text-center mb-2">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Bot className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">您好！我是东方电气集团的智能助手</h2>
                            <p className="text-gray-600 mb-3">我可以帮您解答关于锅炉技术、安全规范、维护流程等方面的问题</p>
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
                            
                            {/* 精选问题部分 */}
                            <div className="mt-8">
                              <p className="text-sm text-gray-500 mb-4 text-center">精选问题：</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {featuredQuestions.map((item, index) => (
                                  <button
                                    key={index}
                                    onClick={() => !isLoading && handleRecommendedQuestion(item.question)}
                                    disabled={isLoading}
                                    className="flex items-center text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white"
                                  >
                                    <div className="flex items-center justify-between w-full gap-3">
                                      <span className="text-sm text-gray-700 truncate">{item.question}</span>
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        <Badge variant="secondary" className="text-xs">
                                          {item.category}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                          <ThumbsUp className="w-3 h-3" />
                                          <span>{item.likes}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
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
                              <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                                message.type === 'user' 
                                  ? 'prose-invert' 
                                  : 'prose-gray'
                              }`}>
                                <ReactMarkdown 
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    li: ({ children, ...props }) => {
                                      // 提取文本内容，处理React元素数组
                                      const extractText = (node: any): string => {
                                        if (typeof node === 'string') {
                                          return node
                                        }
                                        if (Array.isArray(node)) {
                                          return node.map(extractText).join('')
                                        }
                                        if (node && typeof node === 'object' && node.props && node.props.children) {
                                          return extractText(node.props.children)
                                        }
                                        return ''
                                      }
                                      
                                      const text = extractText(children)
                                      const isReference = text.includes('GB/T') || text.includes('Q/DF') || text.includes('ASME')
                                      
                                      if (isReference) {
                                        return (
                                          <li 
                                            {...props}
                                            className="cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                                            onClick={() => handleReferenceClick(text)}
                                          >
                                            {children}
                                          </li>
                                        )
                                      }
                                      return <li {...props}>{children}</li>
                                    }
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>

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
                                <div className="flex-1 max-w-[85%]">
                                  <div className="bg-primary/5 border border-primary/20 shadow-sm rounded-2xl p-4">
                                    <div className="flex items-center space-x-2">
                                      <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                      </div>
                                      <span className="text-sm text-primary">AI正在分析您的问题，请稍候...</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* 自动滚动锚点 */}
                            <div ref={messagesEndRef} />
                          </div>
                  </div>

                  {/* PDF查看器 - 与对话并列显示 */}
                  {showPdfViewer && (
                    <div className="w-1/2 ml-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold">{selectedPdfTitle}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPdfViewer(false)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="h-[calc(100vh-200px)]">
                        <iframe
                          src={`${selectedPdfUrl}#toolbar=0&navpanes=1&scrollbar=1`}
                          className="w-full h-full border-0 rounded-b-lg"
                          title={selectedPdfTitle}
                        />
                      </div>
                    </div>
                  )}
                </div>


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
                        <div className="flex items-center space-x-2">
                          {hasUserMessages && (
                            <Button 
                              onClick={handleClearMessages}
                              variant="outline"
                              size="sm"
                              className="h-12 px-4 rounded-xl"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              清空
                            </Button>
                          )}
                          <Button 
                            onClick={handleSendMessage} 
                            disabled={!question.trim() || isLoading}
                            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary-hover shadow-sm transition-all duration-200"
                          >
                            <Send className="w-5 h-5 text-white" />
                          </Button>
                        </div>
                      </div>

                      {/* Bottom Controls Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Knowledge Domain Selection */}
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              onClick={() => setDomainOpen(true)}
                              className="h-8 px-3 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                            >
                              {selectedLevel1Categories.length > 0 ? `已选择 ${selectedLevel1Categories.length} 个领域` : "全部"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
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

                          {/* Deep Thinking Toggle - Only show for models that support it */}
                          {selectedModel === "r1" && (
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
                          )}

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
                                className="h-8 px-3 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                                title="上传文件"
                                aria-label="上传文件"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                上传文件
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

      {/* 通知对话框 */}
      <NotificationDialog 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

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

      {/* 知识领域资源管理器弹窗 */}
      {domainOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] max-w-4xl h-[80vh] flex flex-col">
            {/* 弹窗头部 */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">知识领域选择</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDomainOpen(false)
                    setSearchQuery("")
                    setSearchResults([])
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索分类和文档..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* 弹窗内容 */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* 搜索结果显示 */}
              {searchQuery && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3 text-gray-700">
                    {isSearching ? "搜索中..." : `找到 ${searchResults.length} 个结果`}
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => {
                      const parts = result.split(' > ')
                      const isSelected = selectedDomains.includes(result) || 
                        selectedLevel1Categories.includes(parts[0]) ||
                        selectedLevel2Categories.includes(`${parts[0]} > ${parts[1]}`)
                      
                      return (
                        <div 
                          key={index}
                          className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            if (parts.length === 1) {
                              handleLevel1Toggle(parts[0])
                            } else if (parts.length === 2) {
                              handleLevel2Toggle(parts[1])
                            } else if (parts.length === 3) {
                              handleLevel3Select(parts[2])
                            }
                          }}
                        >
                          <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center">
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <div className="flex items-center space-x-2 flex-1">
                            {parts.length === 1 ? (
                              <FolderOpen className="w-4 h-4 text-blue-500" />
                            ) : parts.length === 2 ? (
                              <FolderOpen className="w-4 h-4 text-green-500" />
                            ) : (
                              <FileText className="w-4 h-4 text-orange-500" />
                            )}
                            <span className="text-sm">{result}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 面包屑导航 */}
              {!searchQuery && (
                <div className="mb-4 flex items-center space-x-2 text-sm">
                  <button
                    onClick={() => setCurrentPath([])}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    知识领域
                  </button>
                  {currentPath.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-400">/</span>
                      <button
                        onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {item}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 返回按钮 */}
              {currentPath.length > 0 && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goBack}
                    className="flex items-center space-x-2"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    <span>返回上级</span>
                  </Button>
                </div>
              )}

              {/* 当前目录内容 */}
              {!searchQuery && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPath.length === 0 ? (
                  // 显示一级分类
                  Object.keys(knowledgeHierarchy).filter(level1 => level1 !== '全部').map((level1) => {
                    const isSelected = selectedLevel1Categories.includes(level1)
                    return (
                      <div 
                        key={level1}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50"
                      >
                        <div 
                          className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center cursor-pointer hover:bg-gray-100"
                          onClick={() => handleLevel1Toggle(level1)}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div 
                          className="flex items-center space-x-2 cursor-pointer flex-1"
                          onClick={() => handleLevel1Select(level1)}
                        >
                          <FolderOpen className="w-5 h-5 text-blue-500" />
                          <span className="text-sm">{level1}</span>
                        </div>
                      </div>
                    )
                  })
                ) : currentPath.length === 1 ? (
                  // 显示二级分类
                  Object.keys(knowledgeHierarchy[currentPath[0]]).map((level2) => {
                    const level2Key = `${currentPath[0]} > ${level2}`
                    const isSelected = selectedLevel2Categories.includes(level2Key)
                    return (
                      <div 
                        key={level2}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50"
                      >
                        <div 
                          className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center cursor-pointer hover:bg-gray-100"
                          onClick={() => handleLevel2Toggle(level2)}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div 
                          className="flex items-center space-x-2 cursor-pointer flex-1"
                          onClick={() => handleLevel2Select(level2)}
                        >
                          <FolderOpen className="w-5 h-5 text-green-500" />
                          <span className="text-sm">{level2}</span>
                        </div>
                      </div>
                    )
                  })
                ) : currentPath.length === 2 ? (
                  // 显示三级分类
                  knowledgeHierarchy[currentPath[0]][currentPath[1]].map((level3) => {
                    const fullPath = `${currentPath[0]} > ${currentPath[1]} > ${level3}`
                    const isSelected = selectedDomains.includes(fullPath)
                    return (
                      <div 
                        key={level3}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLevel3Select(level3)}
                      >
                        <div 
                          className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center"
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div className="flex items-center space-x-2 flex-1">
                          <FileText className="w-5 h-5 text-orange-500" />
                          <span className="text-sm">{level3}</span>
                        </div>
                      </div>
                    )
                  })
                ) : null}
                </div>
              )}
              
              {/* 选中的专业和文档 */}
              {!isGeneralSelected && selectedLevel1Categories.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">已选择的专业和文档：</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {selectedLevel1Categories.map((category) => (
                      <div key={category} className="text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="w-4 h-4 text-blue-500" />
                          <span>{category}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              setSelectedLevel1Categories(prev => 
                                prev.filter(cat => cat !== category)
                              )
                              setSelectedLevel2Categories(prev => 
                                prev.filter(cat => !cat.startsWith(category))
                              )
                              setSelectedDomains(prev => 
                                prev.filter(domain => !domain.startsWith(category))
                              )
                              if (selectedLevel1Categories.length === 1) {
                                setIsGeneralSelected(true)
                              }
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 弹窗底部 */}
            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedLevel1Categories.length > 0 ? `已选择 ${selectedLevel1Categories.length} 个领域` : "全部"}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const allLevel1Categories = Object.keys(knowledgeHierarchy).filter(level1 => level1 !== '全部')
                    setSelectedLevel1Categories(allLevel1Categories)
                    setIsGeneralSelected(false)
                  }}
                >
                  全选
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAllSelections}
                >
                  清除
                </Button>
                <Button
                  onClick={() => {
                    setDomainOpen(false)
                    setSearchQuery("")
                    setSearchResults([])
                  }}
                >
                  确定
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


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

// 通知对话框组件
function NotificationDialog({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const notifications = [
    {
      id: 1,
      title: "新文档已上传",
      message: "锅炉安全标准 2024.pdf 已成功上传到系统",
      time: "2分钟前",
      type: "success"
    },
    {
      id: 2,
      title: "审核任务提醒",
      message: "您有3个文档等待审核，请及时处理",
      time: "1小时前",
      type: "warning"
    },
    {
      id: 3,
      title: "系统维护通知",
      message: "系统将于今晚22:00-24:00进行维护，请提前保存工作",
      time: "3小时前",
      type: "info"
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>通知中心</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div key={notification.id} className="border rounded-lg p-3 hover:bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                </div>
                <Badge 
                  variant={notification.type === "success" ? "default" : 
                          notification.type === "warning" ? "destructive" : "secondary"}
                  className="ml-2"
                >
                  {notification.type === "success" ? "成功" : 
                   notification.type === "warning" ? "警告" : "信息"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
