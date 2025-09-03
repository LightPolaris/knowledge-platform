import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  Shield,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-3xl text-foreground">用户管理</h1>
          <p className="text-muted-foreground">管理系统用户、角色和权限</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          添加用户
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索用户..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              筛选
            </Button>
            <Button variant="outline">部门</Button>
            <Button variant="outline">角色</Button>
            <Button variant="outline">状态</Button>
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12% 较上月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              57% 活跃率
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">新用户</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              本月新增
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待审核</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              需要审核
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>管理系统中的所有用户账户</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* User Row 1 */}
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>ZW</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">张伟</h3>
                    <Badge variant="default">管理员</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      zhang.wei@dongfang.com
                    </span>
                    <span className="flex items-center">
                      <Building className="mr-1 h-3 w-3" />
                      安全工程部
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">最后登录</p>
                  <p className="text-xs text-muted-foreground">2024-01-15 09:30</p>
                </div>
                <Badge variant="secondary">活跃</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User Row 2 */}
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>LM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">李明</h3>
                    <Badge variant="secondary">技术主管</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      li.ming@dongfang.com
                    </span>
                    <span className="flex items-center">
                      <Building className="mr-1 h-3 w-3" />
                      技术文档部
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">最后登录</p>
                  <p className="text-xs text-muted-foreground">2024-01-15 08:45</p>
                </div>
                <Badge variant="secondary">活跃</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User Row 3 */}
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>WF</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">王芳</h3>
                    <Badge variant="outline">审核员</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      wang.fang@dongfang.com
                    </span>
                    <span className="flex items-center">
                      <Building className="mr-1 h-3 w-3" />
                      质量控制部
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">最后登录</p>
                  <p className="text-xs text-muted-foreground">2024-01-14 16:20</p>
                </div>
                <Badge variant="secondary">活跃</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User Row 4 */}
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">陈璐</h3>
                    <Badge variant="outline">查看者</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      chen.lu@dongfang.com
                    </span>
                    <span className="flex items-center">
                      <Building className="mr-1 h-3 w-3" />
                      维护部
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">最后登录</p>
                  <p className="text-xs text-muted-foreground">2024-01-10 14:15</p>
                </div>
                <Badge variant="destructive">非活跃</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User Row 5 */}
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">刘刚</h3>
                    <Badge variant="outline">工程师</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      liu.gang@dongfang.com
                    </span>
                    <span className="flex items-center">
                      <Building className="mr-1 h-3 w-3" />
                      安装工程部
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">最后登录</p>
                  <p className="text-xs text-muted-foreground">2024-01-11 11:30</p>
                </div>
                <Badge variant="secondary">活跃</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              角色管理
            </CardTitle>
            <CardDescription>管理系统角色和权限</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">管理员</p>
                  <p className="text-sm text-muted-foreground">完全系统访问权限</p>
                </div>
                <Badge variant="default">5 用户</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">技术主管</p>
                  <p className="text-sm text-muted-foreground">技术文档管理权限</p>
                </div>
                <Badge variant="secondary">12 用户</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">审核员</p>
                  <p className="text-sm text-muted-foreground">文档审核权限</p>
                </div>
                <Badge variant="outline">8 用户</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">查看者</p>
                  <p className="text-sm text-muted-foreground">只读访问权限</p>
                </div>
                <Badge variant="outline">23 用户</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              部门统计
            </CardTitle>
            <CardDescription>按部门的用户分布</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">安全工程部</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">技术文档部</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                  <span className="text-sm font-medium">32%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">质量控制部</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-yellow-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                  <span className="text-sm font-medium">18%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">其他部门</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-sm font-medium">5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
