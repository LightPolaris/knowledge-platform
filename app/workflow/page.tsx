"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Settings,
  ArrowRight,
  Play,
  Pause,
  User,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Plus,
  GripVertical,
  MessageSquare
} from "lucide-react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function WorkflowPage() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([])
  const [isBatchAssignDialogOpen, setIsBatchAssignDialogOpen] = useState(false)
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<any>(null)
  const [newStep, setNewStep] = useState({ name: "", description: "", status: "active" })
  const [workflowType, setWorkflowType] = useState<"document" | "qa-feedback">("document")
  const itemsPerPage = 5
  
  const [workflowConfig, setWorkflowConfig] = useState({
    id: 1,
    name: "文档导入流程",
    description: "管理文档从上传到知识图谱的完整流程",
    status: "running",
    steps: [
      { id: 1, name: "未解析", description: "文档已上传，等待解析", status: "active" },
      { id: 2, name: "已解析未审核", description: "文档已解析，等待审核", status: "active" },
      { id: 3, name: "已解析已审核", description: "文档已审核通过，等待导入", status: "active" },
      { id: 4, name: "已导入未审核", description: "文档已导入，等待最终审核", status: "active" },
      { id: 5, name: "已导入已审核", description: "文档已完全处理，可在知识图谱中使用", status: "completed" }
    ],
    controls: {
      allowImportFromParsed: true, // 控制已解析未审核的文件是否能继续导入
      allowKnowledgeGraphUse: true, // 控制已导入未审核的文件是否能在知识图谱中使用
    },
    statistics: {
      totalDocuments: 156,
      unparsed: 23,
      parsedUnreviewed: 45,
      parsedReviewed: 32,
      importedUnreviewed: 28,
      importedReviewed: 28
    }
  })

  // 智能问答反馈流程配置
  const [qaFeedbackWorkflow, setQaFeedbackWorkflow] = useState({
    id: 2,
    name: "智能问答反馈流程",
    description: "管理用户问答反馈的处理和优化流程",
    status: "running",
    steps: [
      { id: 1, name: "待处理", description: "用户反馈已提交，等待处理", status: "active" },
      { id: 2, name: "分析中", description: "正在分析反馈内容和问题类型", status: "active" },
      { id: 3, name: "优化中", description: "根据反馈优化问答内容", status: "active" },
      { id: 4, name: "测试中", description: "测试优化后的问答效果", status: "active" },
      { id: 5, name: "已完成", description: "反馈处理完成，已应用到知识库", status: "completed" }
    ],
    controls: {
      autoAssignFeedback: true, // 自动分配反馈任务
      enablePriorityQueue: true, // 启用优先级队列
      autoOptimization: false, // 自动优化开关
    },
    statistics: {
      totalFeedback: 89,
      pending: 23,
      analyzing: 18,
      optimizing: 15,
      testing: 12,
      completed: 21
    }
  })

  // 审核任务数据
  const reviewTasks = [
    {
      id: 1,
      documentName: "锅炉安全标准 2024.pdf",
      documentType: "PDF",
      status: "已解析未审核",
      assignedTo: "张工程师",
      priority: "high",
      createdAt: "2024-01-20 10:30",
      dueDate: "2024-01-22 18:00"
    },
    {
      id: 2,
      documentName: "技术规格说明书.docx",
      documentType: "Word",
      status: "已导入未审核",
      assignedTo: "李审核员",
      priority: "medium",
      createdAt: "2024-01-19 14:20",
      dueDate: "2024-01-21 12:00"
    },
    {
      id: 3,
      documentName: "设备维护手册.pdf",
      documentType: "PDF",
      status: "已解析未审核",
      assignedTo: "王专家",
      priority: "low",
      createdAt: "2024-01-18 09:15",
      dueDate: "2024-01-25 17:00"
    },
    {
      id: 4,
      documentName: "电气安全规范.pdf",
      documentType: "PDF",
      status: "已解析未审核",
      assignedTo: "陈主管",
      priority: "high",
      createdAt: "2024-01-17 16:45",
      dueDate: "2024-01-23 14:00"
    },
    {
      id: 5,
      documentName: "操作流程指南.docx",
      documentType: "Word",
      status: "已导入未审核",
      assignedTo: "赵审核员",
      priority: "medium",
      createdAt: "2024-01-16 11:30",
      dueDate: "2024-01-24 16:30"
    },
    {
      id: 6,
      documentName: "质量检测报告.pdf",
      documentType: "PDF",
      status: "已解析未审核",
      assignedTo: "孙工程师",
      priority: "high",
      createdAt: "2024-01-15 08:20",
      dueDate: "2024-01-26 12:00"
    },
    {
      id: 7,
      documentName: "设备安装手册.pdf",
      documentType: "PDF",
      status: "已解析已审核",
      assignedTo: "周专家",
      priority: "medium",
      createdAt: "2024-01-14 13:15",
      dueDate: "2024-01-27 18:00"
    },
    {
      id: 8,
      documentName: "安全培训材料.pptx",
      documentType: "PowerPoint",
      status: "已导入未审核",
      assignedTo: "吴审核员",
      priority: "low",
      createdAt: "2024-01-13 15:40",
      dueDate: "2024-01-28 10:00"
    },
    {
      id: 9,
      documentName: "维修记录表.xlsx",
      documentType: "Excel",
      status: "已解析未审核",
      assignedTo: "郑工程师",
      priority: "medium",
      createdAt: "2024-01-12 09:25",
      dueDate: "2024-01-29 15:30"
    },
    {
      id: 10,
      documentName: "环境监测标准.pdf",
      documentType: "PDF",
      status: "已导入已审核",
      assignedTo: "冯专家",
      priority: "high",
      createdAt: "2024-01-11 14:10",
      dueDate: "2024-01-30 17:45"
    },
    {
      id: 11,
      documentName: "应急预案.docx",
      documentType: "Word",
      status: "已解析未审核",
      assignedTo: "韩审核员",
      priority: "high",
      createdAt: "2024-01-10 12:35",
      dueDate: "2024-01-31 09:00"
    },
    {
      id: 12,
      documentName: "设备参数配置.pdf",
      documentType: "PDF",
      status: "已导入未审核",
      assignedTo: "何工程师",
      priority: "medium",
      createdAt: "2024-01-09 16:50",
      dueDate: "2024-02-01 14:20"
    },
    {
      id: 13,
      documentName: "用户使用手册.pdf",
      documentType: "PDF",
      status: "已解析未审核",
      assignedTo: "罗专家",
      priority: "low",
      createdAt: "2024-01-08 10:15",
      dueDate: "2024-02-02 16:00"
    }
  ]

  // 问答反馈任务数据
  const qaFeedbackTasks = [
    {
      id: 1,
      question: "锅炉压力控制的最佳实践是什么？",
      feedback: "回答不够详细，缺少具体的操作步骤",
      status: "待处理",
      assignedTo: "张工程师",
      priority: "high",
      category: "技术问题",
      createdAt: "2024-01-20 10:30",
      dueDate: "2024-01-22 18:00",
      user: "李用户"
    },
    {
      id: 2,
      question: "如何检测锅炉泄漏？",
      feedback: "答案准确，但建议增加图片说明",
      status: "分析中",
      assignedTo: "王专家",
      priority: "medium",
      category: "安全检测",
      createdAt: "2024-01-19 14:20",
      dueDate: "2024-01-21 12:00",
      user: "陈用户"
    },
    {
      id: 3,
      question: "锅炉维护周期是多久？",
      feedback: "回答有误，实际维护周期应该是3个月",
      status: "优化中",
      assignedTo: "李审核员",
      priority: "high",
      category: "维护管理",
      createdAt: "2024-01-18 09:15",
      dueDate: "2024-01-25 17:00",
      user: "赵用户"
    },
    {
      id: 4,
      question: "锅炉启动需要哪些检查？",
      feedback: "回答很好，建议增加检查清单",
      status: "测试中",
      assignedTo: "周专家",
      priority: "medium",
      category: "操作流程",
      createdAt: "2024-01-17 16:45",
      dueDate: "2024-01-23 14:00",
      user: "孙用户"
    },
    {
      id: 5,
      question: "锅炉效率如何计算？",
      feedback: "公式正确，但缺少计算示例",
      status: "已完成",
      assignedTo: "吴审核员",
      priority: "low",
      category: "性能计算",
      createdAt: "2024-01-16 11:30",
      dueDate: "2024-01-24 16:30",
      user: "郑用户"
    },
    {
      id: 6,
      question: "锅炉安全阀如何调整？",
      feedback: "步骤清晰，建议增加注意事项",
      status: "待处理",
      assignedTo: "何工程师",
      priority: "high",
      category: "安全设备",
      createdAt: "2024-01-15 08:20",
      dueDate: "2024-01-26 12:00",
      user: "罗用户"
    },
    {
      id: 7,
      question: "锅炉水质要求是什么？",
      feedback: "标准正确，建议增加检测方法",
      status: "分析中",
      assignedTo: "冯专家",
      priority: "medium",
      category: "水质管理",
      createdAt: "2024-01-14 13:15",
      dueDate: "2024-01-27 18:00",
      user: "韩用户"
    },
    {
      id: 8,
      question: "锅炉故障如何诊断？",
      feedback: "诊断流程完整，建议增加常见故障案例",
      status: "优化中",
      assignedTo: "陈主管",
      priority: "high",
      category: "故障诊断",
      createdAt: "2024-01-13 15:40",
      dueDate: "2024-01-28 10:00",
      user: "王用户"
    }
  ]

  // 获取当前流程配置
  const getCurrentWorkflow = () => {
    return workflowType === "document" ? workflowConfig : qaFeedbackWorkflow
  }

  // 获取当前任务数据
  const getCurrentTasks = () => {
    return workflowType === "document" ? reviewTasks : qaFeedbackTasks
  }

  // 获取当前统计
  const getCurrentStatistics = () => {
    return workflowType === "document" ? workflowConfig.statistics : qaFeedbackWorkflow.statistics
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "未解析":
        return <Badge variant="outline" className="text-gray-600">未解析</Badge>
      case "已解析未审核":
        return <Badge className="bg-orange-100 text-orange-800">已解析未审核</Badge>
      case "已解析已审核":
        return <Badge className="bg-blue-100 text-blue-800">已解析已审核</Badge>
      case "已导入未审核":
        return <Badge className="bg-purple-100 text-purple-800">已导入未审核</Badge>
      case "已导入已审核":
        return <Badge className="bg-green-100 text-green-800">已导入已审核</Badge>
      // 问答反馈状态
      case "待处理":
        return <Badge className="bg-red-100 text-red-800">待处理</Badge>
      case "分析中":
        return <Badge className="bg-yellow-100 text-yellow-800">分析中</Badge>
      case "优化中":
        return <Badge className="bg-blue-100 text-blue-800">优化中</Badge>
      case "测试中":
        return <Badge className="bg-purple-100 text-purple-800">测试中</Badge>
      case "已完成":
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">高优先级</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">中优先级</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">低优先级</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const handleTaskSelect = (taskId: number, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId])
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(currentTasks.map(task => task.id))
    } else {
      setSelectedTasks([])
    }
  }

  const handleAssigneeSelect = (assignee: string, checked: boolean) => {
    if (checked) {
      setSelectedAssignees(prev => [...prev, assignee])
    } else {
      setSelectedAssignees(prev => prev.filter(a => a !== assignee))
    }
  }

  const handleBatchAssign = () => {
    if (selectedAssignees.length > 0 && selectedTasks.length > 0) {
      // 这里应该调用API更新任务分配
      console.log(`批量分配 ${selectedTasks.length} 个任务给 ${selectedAssignees.join(', ')}`)
      setSelectedTasks([])
      setSelectedAssignees([])
      setIsBatchAssignDialogOpen(false)
    }
  }

  // 分页计算
  const totalPages = Math.ceil(reviewTasks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTasks = reviewTasks.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedTasks([]) // 切换页面时清空选择
  }

  // 步骤管理函数
  const handleAddStep = () => {
    setNewStep({ name: "", description: "", status: "active" })
    setEditingStep(null)
    setIsStepDialogOpen(true)
  }

  const handleEditStep = (step: any) => {
    setEditingStep(step)
    setNewStep({ name: step.name, description: step.description, status: step.status })
    setIsStepDialogOpen(true)
  }

  const handleDeleteStep = (stepId: number) => {
    setWorkflowConfig(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }))
  }

  const handleSaveStep = () => {
    if (editingStep) {
      // 编辑现有步骤
      setWorkflowConfig(prev => ({
        ...prev,
        steps: prev.steps.map(step => 
          step.id === editingStep.id 
            ? { ...step, name: newStep.name, description: newStep.description, status: newStep.status }
            : step
        )
      }))
    } else {
      // 添加新步骤
      const newId = Math.max(...workflowConfig.steps.map(s => s.id)) + 1
      setWorkflowConfig(prev => ({
        ...prev,
        steps: [...prev.steps, { id: newId, ...newStep }]
      }))
    }
    setIsStepDialogOpen(false)
    setEditingStep(null)
    setNewStep({ name: "", description: "", status: "active" })
  }

  const handleMoveStep = (stepId: number, direction: 'up' | 'down') => {
    setWorkflowConfig(prev => {
      const steps = [...prev.steps]
      const index = steps.findIndex(step => step.id === stepId)
      
      if (direction === 'up' && index > 0) {
        [steps[index], steps[index - 1]] = [steps[index - 1], steps[index]]
      } else if (direction === 'down' && index < steps.length - 1) {
        [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]]
      }
      
      return { ...prev, steps }
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="流程处理" subtitle="管理文档导入流程和智能问答反馈流程" />

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* 流程类型切换器 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">流程管理</h2>
                    <p className="text-muted-foreground">选择要管理的流程类型</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={workflowType === "document" ? "default" : "outline"}
                      onClick={() => setWorkflowType("document")}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>文档导入流程</span>
                    </Button>
                    <Button
                      variant={workflowType === "qa-feedback" ? "default" : "outline"}
                      onClick={() => setWorkflowType("qa-feedback")}
                      className="flex items-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>问答反馈流程</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 流程统计 */}
            {workflowType === "document" ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">总文档数</p>
                        <p className="text-2xl font-bold">{workflowConfig.statistics.totalDocuments}</p>
                      </div>
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">未解析</p>
                        <p className="text-2xl font-bold text-gray-600">{workflowConfig.statistics.unparsed}</p>
                      </div>
                      <Clock className="h-8 w-8 text-gray-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">已解析未审核</p>
                        <p className="text-2xl font-bold text-orange-600">{workflowConfig.statistics.parsedUnreviewed}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">已导入未审核</p>
                        <p className="text-2xl font-bold text-purple-600">{workflowConfig.statistics.importedUnreviewed}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">已完成</p>
                        <p className="text-2xl font-bold text-green-600">{workflowConfig.statistics.importedReviewed}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">总反馈数</p>
                        <p className="text-2xl font-bold">{qaFeedbackWorkflow.statistics.totalFeedback}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">待处理</p>
                        <p className="text-2xl font-bold text-red-600">{qaFeedbackWorkflow.statistics.pending}</p>
                      </div>
                      <Clock className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">分析中</p>
                        <p className="text-2xl font-bold text-yellow-600">{qaFeedbackWorkflow.statistics.analyzing}</p>
                      </div>
                      <Search className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">优化中</p>
                        <p className="text-2xl font-bold text-blue-600">{qaFeedbackWorkflow.statistics.optimizing}</p>
                      </div>
                      <Settings className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">测试中</p>
                        <p className="text-2xl font-bold text-purple-600">{qaFeedbackWorkflow.statistics.testing}</p>
                      </div>
                      <Play className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">已完成</p>
                        <p className="text-2xl font-bold text-green-600">{qaFeedbackWorkflow.statistics.completed}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 主要内容 */}
            <div className="space-y-6">
              {/* 流程管理 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{getCurrentWorkflow().name}</CardTitle>
                      <CardDescription>{getCurrentWorkflow().description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">运行中</Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsConfigDialogOpen(true)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        配置
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 流程步骤 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">流程步骤</h3>
                    <div className="space-y-3">
                      {getCurrentWorkflow().steps.map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step.status === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : step.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {step.id}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{step.name}</h4>
                              {getStatusBadge(step.name)}
                            </div>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                          {index < getCurrentWorkflow().steps.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 任务管理 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {workflowType === "document" ? "审核任务管理" : "反馈任务管理"}
                      </CardTitle>
                      <CardDescription>
                        {workflowType === "document" 
                          ? "管理和处理文档审核任务" 
                          : "管理和处理用户问答反馈任务"
                        }
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedTasks.length > 0 && (
                        <Dialog open={isBatchAssignDialogOpen} onOpenChange={setIsBatchAssignDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Users className="h-4 w-4 mr-2" />
                              批量分配 ({selectedTasks.length})
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>批量分配任务</DialogTitle>
                              <DialogDescription>
                                将选中的 {selectedTasks.length} 个任务分配给指定人员
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">选择处理人员（可多选）</label>
                                <div className="space-y-2">
                                  {[
                                    { value: "zhang", name: "张工程师" },
                                    { value: "li", name: "李审核员" },
                                    { value: "wang", name: "王专家" },
                                    { value: "chen", name: "陈主管" },
                                    { value: "zhao", name: "赵审核员" },
                                    { value: "sun", name: "孙工程师" },
                                    { value: "zhou", name: "周专家" },
                                    { value: "wu", name: "吴审核员" }
                                  ].map((assignee) => (
                                    <div key={assignee.value} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={assignee.value}
                                        checked={selectedAssignees.includes(assignee.value)}
                                        onCheckedChange={(checked) => handleAssigneeSelect(assignee.value, checked as boolean)}
                                      />
                                      <label htmlFor={assignee.value} className="text-sm">
                                        {assignee.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                {selectedAssignees.length > 0 && (
                                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium mb-2">已选择的处理人员：</p>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedAssignees.map((assignee) => {
                                        const assigneeName = [
                                          { value: "zhang", name: "张工程师" },
                                          { value: "li", name: "李审核员" },
                                          { value: "wang", name: "王专家" },
                                          { value: "chen", name: "陈主管" },
                                          { value: "zhao", name: "赵审核员" },
                                          { value: "sun", name: "孙工程师" },
                                          { value: "zhou", name: "周专家" },
                                          { value: "wu", name: "吴审核员" }
                                        ].find(a => a.value === assignee)?.name || assignee
                                        return (
                                          <Badge key={assignee} variant="secondary">
                                            {assigneeName}
                                          </Badge>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsBatchAssignDialogOpen(false)}>
                                取消
                              </Button>
                              <Button onClick={handleBatchAssign} disabled={selectedAssignees.length === 0}>
                                确认分配
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 全选控制 */}
                    <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                      <Checkbox
                        checked={selectedTasks.length === getCurrentTasks().length && getCurrentTasks().length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTasks(getCurrentTasks().map(task => task.id))
                          } else {
                            setSelectedTasks([])
                          }
                        }}
                      />
                      <span className="text-sm font-medium">
                        全选 ({selectedTasks.length}/{getCurrentTasks().length})
                      </span>
                    </div>

                    {getCurrentTasks().map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Checkbox
                                checked={selectedTasks.includes(task.id)}
                                onCheckedChange={(checked) => handleTaskSelect(task.id, checked as boolean)}
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold">
                                    {workflowType === "document" ? task.documentName : task.question}
                                  </h3>
                                  {workflowType === "document" && (
                                    <Badge variant="outline">{task.documentType}</Badge>
                                  )}
                                  {workflowType === "qa-feedback" && (
                                    <Badge variant="outline">{task.category}</Badge>
                                  )}
                                  {getStatusBadge(task.status)}
                                  {getPriorityBadge(task.priority)}
                                </div>
                                {workflowType === "qa-feedback" && (
                                  <div className="mb-3">
                                    <p className="text-sm text-muted-foreground mb-1">
                                      <strong>用户反馈：</strong>{task.feedback}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      <strong>反馈用户：</strong>{task.user}
                                    </p>
                                  </div>
                                )}
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>分配给: {task.assignedTo}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>创建时间: {task.createdAt}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>截止时间: {task.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 配置对话框 */}
              <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>流程配置</DialogTitle>
                    <DialogDescription>
                      配置{getCurrentWorkflow().name}的基本信息和控制选项
                    </DialogDescription>
                  </DialogHeader>
                    
                  <div className="space-y-6">
                    {/* 基本信息 */}
                    <div className="space-y-4">
                      <h4 className="font-medium">基本信息</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium">流程名称</label>
                          <input
                            type="text"
                            value={getCurrentWorkflow().name}
                            onChange={(e) => {
                              if (workflowType === "document") {
                                setWorkflowConfig(prev => ({
                                  ...prev,
                                  name: e.target.value
                                }))
                              } else {
                                setQaFeedbackWorkflow(prev => ({
                                  ...prev,
                                  name: e.target.value
                                }))
                              }
                            }}
                            className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">流程描述</label>
                          <textarea
                            value={getCurrentWorkflow().description}
                            onChange={(e) => {
                              if (workflowType === "document") {
                                setWorkflowConfig(prev => ({
                                  ...prev,
                                  description: e.target.value
                                }))
                              } else {
                                setQaFeedbackWorkflow(prev => ({
                                  ...prev,
                                  description: e.target.value
                                }))
                              }
                            }}
                            rows={3}
                            className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 流程控制 */}
                    <div className="space-y-4">
                      <h4 className="font-medium">流程控制</h4>
                      <div className="space-y-4">
                        {workflowType === "document" ? (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h5 className="font-medium">允许已解析未审核文件继续导入</h5>
                                <p className="text-sm text-muted-foreground">
                                  控制已解析但未审核的文档是否可以直接进入导入阶段
                                </p>
                              </div>
                              <Switch 
                                checked={workflowConfig.controls.allowImportFromParsed}
                                onCheckedChange={(checked) => {
                                  setWorkflowConfig(prev => ({
                                    ...prev,
                                    controls: {
                                      ...prev.controls,
                                      allowImportFromParsed: checked
                                    }
                                  }))
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h5 className="font-medium">允许已导入未审核文件在知识图谱中使用</h5>
                                <p className="text-sm text-muted-foreground">
                                  控制已导入但未最终审核的文档是否可以在知识图谱中搜索和使用
                                </p>
                              </div>
                              <Switch 
                                checked={workflowConfig.controls.allowKnowledgeGraphUse}
                                onCheckedChange={(checked) => {
                                  setWorkflowConfig(prev => ({
                                    ...prev,
                                    controls: {
                                      ...prev.controls,
                                      allowKnowledgeGraphUse: checked
                                    }
                                  }))
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h5 className="font-medium">自动分配反馈任务</h5>
                                <p className="text-sm text-muted-foreground">
                                  根据反馈类型和优先级自动分配给合适的处理人员
                                </p>
                              </div>
                              <Switch 
                                checked={qaFeedbackWorkflow.controls.autoAssignFeedback}
                                onCheckedChange={(checked) => {
                                  setQaFeedbackWorkflow(prev => ({
                                    ...prev,
                                    controls: {
                                      ...prev.controls,
                                      autoAssignFeedback: checked
                                    }
                                  }))
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h5 className="font-medium">启用优先级队列</h5>
                                <p className="text-sm text-muted-foreground">
                                  根据反馈优先级自动排序处理顺序，高优先级任务优先处理
                                </p>
                              </div>
                              <Switch 
                                checked={qaFeedbackWorkflow.controls.enablePriorityQueue}
                                onCheckedChange={(checked) => {
                                  setQaFeedbackWorkflow(prev => ({
                                    ...prev,
                                    controls: {
                                      ...prev.controls,
                                      enablePriorityQueue: checked
                                    }
                                  }))
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h5 className="font-medium">自动优化开关</h5>
                                <p className="text-sm text-muted-foreground">
                                  启用AI自动优化功能，根据反馈自动调整问答内容
                                </p>
                              </div>
                              <Switch 
                                checked={qaFeedbackWorkflow.controls.autoOptimization}
                                onCheckedChange={(checked) => {
                                  setQaFeedbackWorkflow(prev => ({
                                    ...prev,
                                    controls: {
                                      ...prev.controls,
                                      autoOptimization: checked
                                    }
                                  }))
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={() => {
                      console.log('保存配置:', getCurrentWorkflow())
                      setIsConfigDialogOpen(false)
                    }}>
                      保存配置
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
