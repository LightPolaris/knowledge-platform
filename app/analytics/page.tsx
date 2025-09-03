import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Network, 
  MessageSquare,
  Calendar,
  Download,
  Filter
} from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-3xl text-foreground">数据分析</h1>
          <p className="text-muted-foreground">知识平台使用统计和趋势分析</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            时间范围
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总文档数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +12% 较上月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">知识节点</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,432</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +8% 较上月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI查询</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +23% 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +5% 较上周
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <Card>
          <CardHeader>
            <CardTitle>使用趋势</CardTitle>
            <CardDescription>过去30天的平台使用情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">文档访问</span>
                  <span className="text-sm text-muted-foreground">1,234 次</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">搜索查询</span>
                  <span className="text-sm text-muted-foreground">856 次</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">知识图谱浏览</span>
                  <span className="text-sm text-muted-foreground">432 次</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI助手使用</span>
                  <span className="text-sm text-muted-foreground">342 次</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle>用户活跃度</CardTitle>
            <CardDescription>按部门和角色的用户活动统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">安全工程部</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">45%</span>
                  <Badge variant="secondary">高活跃</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">技术文档部</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">32%</span>
                  <Badge variant="outline">中活跃</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">质量控制部</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">18%</span>
                  <Badge variant="outline">中活跃</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">维护部</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">5%</span>
                  <Badge variant="secondary">低活跃</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              文档分析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">PDF文档</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <Progress value={44} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Word文档</span>
                <span className="text-sm font-medium">856</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Excel表格</span>
                <span className="text-sm font-medium">432</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">其他格式</span>
                <span className="text-sm font-medium">312</span>
              </div>
              <Progress value={11} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Search Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              搜索分析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">成功搜索</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">部分匹配</span>
                <span className="text-sm font-medium">15%</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">无结果</span>
                <span className="text-sm font-medium">7%</span>
              </div>
              <Progress value={7} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              性能指标
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">页面加载</span>
                <span className="text-sm font-medium">1.2s</span>
              </div>
              <Badge variant="default">优秀</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">搜索响应</span>
                <span className="text-sm font-medium">0.8s</span>
              </div>
              <Badge variant="default">优秀</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI响应</span>
                <span className="text-sm font-medium">2.1s</span>
              </div>
              <Badge variant="secondary">良好</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">系统可用性</span>
                <span className="text-sm font-medium">99.8%</span>
              </div>
              <Badge variant="default">优秀</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
