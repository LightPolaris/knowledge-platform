import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Bot, User, Clock, ThumbsUp, ThumbsDown } from "lucide-react"

export default function AssistantPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-3xl text-foreground">AI助手</h1>
          <p className="text-muted-foreground">智能问答和知识查询助手</p>
        </div>
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          新建对话
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                AI 知识助手
              </CardTitle>
              <CardDescription>基于您的知识库提供智能问答服务</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {/* AI Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">您好！我是您的AI知识助手。我可以帮助您：</p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li>• 搜索和查询技术文档</li>
                        <li>• 解答锅炉安全相关问题</li>
                        <li>• 提供维护和操作建议</li>
                        <li>• 分析技术数据和趋势</li>
                      </ul>
                      <p className="text-sm mt-2">请告诉我您需要什么帮助？</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        有用
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        无用
                      </Button>
                      <span className="text-xs text-muted-foreground">2分钟前</span>
                    </div>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex items-start space-x-3 justify-end">
                  <div className="flex-1 max-w-xs">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3">
                      <p className="text-sm">锅炉安全标准有哪些最新更新？</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 justify-end">
                      <span className="text-xs text-muted-foreground">刚刚</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">根据最新的锅炉安全标准，主要更新包括：</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">温度监控要求</p>
                            <p className="text-xs text-muted-foreground">新增实时温度监控和报警系统要求</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">压力控制标准</p>
                            <p className="text-xs text-muted-foreground">更新了压力容器安全系数和检测频率</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">应急处理程序</p>
                            <p className="text-xs text-muted-foreground">完善了紧急情况下的操作流程</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mt-3">这些更新主要基于2024年1月发布的最新安全标准文档。</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        有用
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        无用
                      </Button>
                      <span className="text-xs text-muted-foreground">1分钟前</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="输入您的问题..." 
                  className="flex-1"
                />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">快捷操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                常见问题
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bot className="mr-2 h-4 w-4" />
                知识查询
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                历史对话
              </Button>
            </CardContent>
          </Card>

          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">最近对话</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">锅炉安全标准查询</p>
                  <p className="text-xs text-muted-foreground">2分钟前</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">维护计划咨询</p>
                  <p className="text-xs text-muted-foreground">1小时前</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">技术规范说明</p>
                  <p className="text-xs text-muted-foreground">3小时前</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">响应时间</span>
                <Badge variant="default">快速</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">知识库</span>
                <Badge variant="secondary">15,432 节点</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">今日查询</span>
                <Badge variant="outline">342 次</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
