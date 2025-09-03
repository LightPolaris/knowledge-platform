"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Shield,
  Users,
  User,
  FileText,
  Settings,
  Eye,
  Edit,
  Delete,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
} from "lucide-react"

export default function PermissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  // Mock roles data
  const roles = [
    {
      id: 1,
      name: "超级管理员",
      description: "拥有系统所有权限",
      users: 2,
      permissions: ["所有权限"],
      status: "active",
    },
    {
      id: 2,
      name: "管理员",
      description: "管理系统用户和内容",
      users: 5,
      permissions: ["用户管理", "内容管理", "系统配置"],
      status: "active",
    },
    {
      id: 3,
      name: "编辑者",
      description: "编辑和发布内容",
      users: 15,
      permissions: ["内容创建", "内容编辑", "内容发布"],
      status: "active",
    },
    {
      id: 4,
      name: "审阅者",
      description: "审阅和批准内容",
      users: 8,
      permissions: ["内容审阅", "内容批准"],
      status: "active",
    },
    {
      id: 5,
      name: "普通用户",
      description: "基本的系统使用权限",
      users: 45,
      permissions: ["内容查看", "提问"],
      status: "active",
    },
  ]

  // Mock permissions data
  const permissions = [
    { id: 1, name: "内容查看", module: "内容管理", description: "查看系统中的文档和知识" },
    { id: 2, name: "内容创建", module: "内容管理", description: "创建新的文档和知识条目" },
    { id: 3, name: "内容编辑", module: "内容管理", description: "编辑现有的文档和知识" },
    { id: 4, name: "内容删除", module: "内容管理", description: "删除文档和知识条目" },
    { id: 5, name: "用户管理", module: "用户管理", description: "管理用户账户和权限" },
    { id: 6, name: "角色管理", module: "用户管理", description: "创建和管理用户角色" },
    { id: 7, name: "系统配置", module: "系统管理", description: "修改系统配置和设置" },
    { id: 8, name: "数据导出", module: "系统管理", description: "导出系统数据和报告" },
  ]

  // Mock users with permissions
  const users = [
    {
      id: 1,
      name: "张三",
      email: "zhang.san@dongfang.com",
      role: "超级管理员",
      department: "IT部门",
      lastActive: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "李四",
      email: "li.si@dongfang.com",
      role: "管理员",
      department: "锅炉事业部",
      lastActive: "2024-01-14",
      status: "active",
    },
    {
      id: 3,
      name: "王五",
      email: "wang.wu@dongfang.com",
      role: "编辑者",
      department: "技术部门",
      lastActive: "2024-01-13",
      status: "inactive",
    },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="权限管理" subtitle="管理系统用户角色和权限配置" />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList>
                <TabsTrigger value="users">用户管理</TabsTrigger>
                <TabsTrigger value="roles">角色管理</TabsTrigger>
                <TabsTrigger value="permissions">权限配置</TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-serif">用户权限管理</CardTitle>
                        <CardDescription>查看和管理所有用户的角色和权限</CardDescription>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        添加用户
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Filters */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="搜索用户..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="选择角色" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有角色</SelectItem>
                          <SelectItem value="超级管理员">超级管理员</SelectItem>
                          <SelectItem value="管理员">管理员</SelectItem>
                          <SelectItem value="编辑者">编辑者</SelectItem>
                          <SelectItem value="审阅者">审阅者</SelectItem>
                          <SelectItem value="普通用户">普通用户</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Users Table */}
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>用户</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>部门</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>最后活动</TableHead>
                            <TableHead>操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary-foreground" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{user.role}</Badge>
                              </TableCell>
                              <TableCell>{user.department}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {user.status === "active" ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className="text-sm">
                                    {user.status === "active" ? "活跃" : "未激活"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {user.lastActive}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Roles Tab */}
              <TabsContent value="roles" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-serif">角色管理</CardTitle>
                        <CardDescription>创建和管理用户角色及权限分配</CardDescription>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        创建角色
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {roles.map((role) => (
                        <Card key={role.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{role.name}</CardTitle>
                              <Badge variant={role.status === "active" ? "default" : "secondary"}>
                                {role.status === "active" ? "活跃" : "禁用"}
                              </Badge>
                            </div>
                            <CardDescription>{role.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">用户数量</span>
                                <span className="font-medium">{role.users}</span>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground mb-2">权限列表</div>
                                <div className="flex flex-wrap gap-1">
                                  {role.permissions.map((permission, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {permission}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <Button variant="outline" size="sm">
                                  <Edit className="mr-2 h-4 w-4" />
                                  编辑
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Users className="mr-2 h-4 w-4" />
                                  管理用户
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Permissions Tab */}
              <TabsContent value="permissions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">权限配置</CardTitle>
                    <CardDescription>管理系统中的所有权限项和访问控制</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {["内容管理", "用户管理", "系统管理"].map((module) => (
                        <div key={module}>
                          <h3 className="font-medium text-lg mb-4">{module}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {permissions
                              .filter(permission => permission.module === module)
                              .map((permission) => (
                                <Card key={permission.id}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-medium">{permission.name}</h4>
                                        <p className="text-sm text-muted-foreground">{permission.description}</p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Switch defaultChecked />
                                        <Button variant="ghost" size="sm">
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
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
    </div>
  )
}
