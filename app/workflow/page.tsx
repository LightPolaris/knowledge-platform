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
  Eye
} from "lucide-react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function WorkflowPage() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([])
  const [isBatchAssignDialogOpen, setIsBatchAssignDialogOpen] = useState(false)
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="流程处理" subtitle="管理文档导入流程和审核任务" />

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* 流程统计 */}
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

            {/* 主要内容 */}
            <Tabs defaultValue="workflow" className="space-y-6">
              <TabsList>
                <TabsTrigger value="workflow">流程管理</TabsTrigger>
                <TabsTrigger value="tasks">审核任务</TabsTrigger>
                <TabsTrigger value="settings">流程设置</TabsTrigger>
              </TabsList>

              {/* 流程管理 */}
              <TabsContent value="workflow" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{workflowConfig.name}</CardTitle>
                        <CardDescription>{workflowConfig.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">运行中</Badge>
                        <Button variant="outline" size="sm">
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
                        {workflowConfig.steps.map((step, index) => (
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
                            {index < workflowConfig.steps.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 审核任务 */}
              <TabsContent value="tasks" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">审核任务</h2>
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
                              <label className="text-sm font-medium">选择审核人员（可多选）</label>
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
                                  <p className="text-sm font-medium mb-2">已选择的审核人员：</p>
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

                <div className="space-y-4">
                  {/* 全选控制 */}
                  <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                    <Checkbox
                      checked={selectedTasks.length === currentTasks.length && currentTasks.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm font-medium">
                      全选 ({selectedTasks.length}/{currentTasks.length})
                    </span>
                  </div>

                  {currentTasks.map((task) => (
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
                                <h3 className="font-semibold">{task.documentName}</h3>
                                <Badge variant="outline">{task.documentType}</Badge>
                                {getStatusBadge(task.status)}
                              </div>
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

                  {/* 分页组件 */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        显示第 {startIndex + 1}-{Math.min(endIndex, reviewTasks.length)} 条，共 {reviewTasks.length} 条
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          上一页
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          下一页
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* 流程设置 */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>流程控制设置</CardTitle>
                    <CardDescription>配置文档导入流程的各种控制选项</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">允许已解析未审核文件继续导入</h4>
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
                        <h4 className="font-medium">允许已导入未审核文件在知识图谱中使用</h4>
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


                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">重置</Button>
                      <Button>保存设置</Button>
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
