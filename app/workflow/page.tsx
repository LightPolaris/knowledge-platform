import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  Plus,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  Settings,
  ArrowRight,
  MoreHorizontal
} from "lucide-react"

export default function WorkflowPage() {
  const workflows = [
    {
      id: 1,
      name: "文档审核流程",
      description: "新上传文档的审核和发布流程",
      status: "running",
      progress: 75,
      steps: ["上传", "初审", "复审", "发布"],
      currentStep: 2,
      participants: 5,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "知识库更新流程",
      description: "定期更新和维护知识库内容的流程",
      status: "paused",
      progress: 45,
      steps: ["收集", "整理", "审核", "发布"],
      currentStep: 1,
      participants: 3,
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      name: "用户权限审批流程",
      description: "新用户注册和权限分配的审批流程",
      status: "completed",
      progress: 100,
      steps: ["申请", "审核", "批准", "分配"],
      currentStep: 4,
      participants: 2,
      createdAt: "2024-01-08"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-4 w-4 text-green-600" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-100 text-green-800">运行中</Badge>
      case "paused":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">已暂停</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">已完成</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="流程处理" subtitle="管理和监控业务流程的执行状态" />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            流程配置
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            创建流程
          </Button>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总流程数</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">运行中</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">已暂停</p>
                <p className="text-2xl font-bold text-yellow-600">3</p>
              </div>
              <Pause className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">已完成</p>
                <p className="text-2xl font-bold text-blue-600">13</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">活跃流程</TabsTrigger>
          <TabsTrigger value="templates">流程模板</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(workflow.status)}
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(workflow.status)}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">进度</span>
                      <span className="text-sm text-muted-foreground">{workflow.progress}%</span>
                    </div>
                    <Progress value={workflow.progress} className="h-2" />
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">流程步骤</span>
                      <span className="text-sm text-muted-foreground">
                        {workflow.currentStep}/{workflow.steps.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {workflow.steps.map((step, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            index < workflow.currentStep
                              ? "bg-green-100 text-green-800"
                              : index === workflow.currentStep
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {step}
                          </div>
                          {index < workflow.steps.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {workflow.participants} 参与者
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {workflow.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {workflow.status === "running" && (
                        <Button variant="outline" size="sm">
                          <Pause className="mr-2 h-4 w-4" />
                          暂停
                        </Button>
                      )}
                      {workflow.status === "paused" && (
                        <Button size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          继续
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">流程模板</h3>
            <p className="text-muted-foreground mb-6">选择预定义的流程模板快速创建新流程</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              创建新模板
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">历史记录</h3>
            <p className="text-muted-foreground">查看已完成的流程历史记录</p>
          </div>
        </TabsContent>
      </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
