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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
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
  Save,
  X,
  Folder,
  Brain,
  MessageSquare,
  Network,
  GitCompare,
  Search as SearchIcon,
  Workflow,
  Lock,
} from "lucide-react"

export default function PermissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [showUserEditDialog, setShowUserEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  // 权限配置数据结构
  const [rolePermissions, setRolePermissions] = useState({
    department: "",
    documentGroups: [] as string[],
    documentManagement: {
      fileUpload: false,
      fileDelete: false,
      fileView: false,
      fileGroup: false,
      fileParse: false,
      parseFileEdit: false,
      fileImport: false,
    },
    intelligentQA: {
      roleSettings: false,
      parameterAdjustment: false,
    },
    knowledgeGraph: {
      view: false,
      adjust: false,
      customBuild: false,
      buildRuleAdjustment: false,
    },
    fileComparison: false,
    knowledgeSearch: false,
    workflowProcessing: false,
    permissionManagement: false,
    systemSettings: false,
  })

  // 部门选项
  const departments = [
    "IT部门", "锅炉事业部", "汽轮机事业部", "发电机事业部", 
    "技术部门", "质量部门", "安全部门", "人力资源部"
  ]

  // 文档分组选项
  const documentGroups = [
    "技术导则", "相关标准", "安全规范", "操作手册", 
    "维护指南", "培训资料", "政策文件", "合同文档"
  ]

  const handleEditRole = (role: any) => {
    setEditingRole(role)
    setShowPermissionDialog(true)
  }

  const handleSavePermissions = () => {
    console.log("保存权限配置:", rolePermissions)
    setShowPermissionDialog(false)
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setShowUserEditDialog(true)
  }

  const handleSaveUser = () => {
    console.log("保存用户信息:", editingUser)
    setShowUserEditDialog(false)
  }

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
    const matchesDepartment = selectedDepartment === "all" || user.department === selectedDepartment
    return matchesSearch && matchesRole && matchesDepartment
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
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="选择部门" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有部门</SelectItem>
                          <SelectItem value="IT部门">IT部门</SelectItem>
                          <SelectItem value="锅炉事业部">锅炉事业部</SelectItem>
                          <SelectItem value="汽轮机事业部">汽轮机事业部</SelectItem>
                          <SelectItem value="发电机事业部">发电机事业部</SelectItem>
                          <SelectItem value="技术部门">技术部门</SelectItem>
                          <SelectItem value="质量部门">质量部门</SelectItem>
                          <SelectItem value="安全部门">安全部门</SelectItem>
                          <SelectItem value="人力资源部">人力资源部</SelectItem>
                        </SelectContent>
                      </Select>
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
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditUser(user)}
                                  >
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
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditRole(role)}
                                >
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


            </Tabs>
          </div>
        </main>
      </div>

      {/* 权限配置对话框 */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              角色权限配置 - {editingRole?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="roleDepartment">角色所属部门</Label>
                  <Select 
                    value={rolePermissions.department} 
                    onValueChange={(value) => setRolePermissions(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>文档分组权限</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {documentGroups.map((group) => (
                      <div key={group} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={group}
                          checked={rolePermissions.documentGroups.includes(group)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRolePermissions(prev => ({
                                ...prev,
                                documentGroups: [...prev.documentGroups, group]
                              }))
                            } else {
                              setRolePermissions(prev => ({
                                ...prev,
                                documentGroups: prev.documentGroups.filter(g => g !== group)
                              }))
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={group} className="text-sm">{group}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 文档管理权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  文档管理权限
                </CardTitle>
                <CardDescription>配置角色对文档管理的各项权限</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>文件上传</Label>
                    <Switch 
                      checked={rolePermissions.documentManagement.fileUpload}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        documentManagement: { ...prev.documentManagement, fileUpload: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>文件删除</Label>
                    <Switch 
                      checked={rolePermissions.documentManagement.fileDelete}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        documentManagement: { ...prev.documentManagement, fileDelete: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>文件查看</Label>
                    <Switch 
                      checked={rolePermissions.documentManagement.fileView}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        documentManagement: { ...prev.documentManagement, fileView: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>文件分组</Label>
                    <Switch 
                      checked={rolePermissions.documentManagement.fileGroup}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        documentManagement: { ...prev.documentManagement, fileGroup: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>文件解析</Label>
                    <Switch 
                      checked={rolePermissions.documentManagement.fileParse}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        documentManagement: { ...prev.documentManagement, fileParse: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>解析文件编辑</Label>
                    <Switch 
                      checked={rolePermissions.documentManagement.parseFileEdit}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        documentManagement: { ...prev.documentManagement, parseFileEdit: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>文件导入</Label>
                    <Switch 
                      checked={rolePermissions.documentManagement.fileImport}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        documentManagement: { ...prev.documentManagement, fileImport: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 智能问答权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  智能问答权限
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>角色设置</Label>
                    <Switch 
                      checked={rolePermissions.intelligentQA.roleSettings}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        intelligentQA: { ...prev.intelligentQA, roleSettings: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>参数调整</Label>
                    <Switch 
                      checked={rolePermissions.intelligentQA.parameterAdjustment}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        intelligentQA: { ...prev.intelligentQA, parameterAdjustment: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 知识图谱权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  知识图谱权限
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>知识图谱查看</Label>
                    <Switch 
                      checked={rolePermissions.knowledgeGraph.view}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        knowledgeGraph: { ...prev.knowledgeGraph, view: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>知识图谱调整</Label>
                    <Switch 
                      checked={rolePermissions.knowledgeGraph.adjust}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        knowledgeGraph: { ...prev.knowledgeGraph, adjust: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>知识图谱自定义构建</Label>
                    <Switch 
                      checked={rolePermissions.knowledgeGraph.customBuild}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        knowledgeGraph: { ...prev.knowledgeGraph, customBuild: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>知识图谱构建规则调整</Label>
                    <Switch 
                      checked={rolePermissions.knowledgeGraph.buildRuleAdjustment}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        knowledgeGraph: { ...prev.knowledgeGraph, buildRuleAdjustment: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 其他权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">其他权限</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <GitCompare className="h-4 w-4" />
                      文件对比
                    </Label>
                    <Switch 
                      checked={rolePermissions.fileComparison}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({ ...prev, fileComparison: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <SearchIcon className="h-4 w-4" />
                      知识搜索
                    </Label>
                    <Switch 
                      checked={rolePermissions.knowledgeSearch}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({ ...prev, knowledgeSearch: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Workflow className="h-4 w-4" />
                      流程处理
                      <Badge variant="secondary" className="text-xs">仅特定人员可用</Badge>
                    </Label>
                    <Switch 
                      checked={rolePermissions.workflowProcessing}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({ ...prev, workflowProcessing: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      权限管理
                      <Badge variant="secondary" className="text-xs">仅特定人员可用</Badge>
                    </Label>
                    <Switch 
                      checked={rolePermissions.permissionManagement}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({ ...prev, permissionManagement: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      系统设置
                      <Badge variant="outline" className="text-xs">普通用户可设置项较少</Badge>
                    </Label>
                    <Switch 
                      checked={rolePermissions.systemSettings}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({ ...prev, systemSettings: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPermissionDialog(false)}>
                <X className="mr-2 h-4 w-4" />
                取消
              </Button>
              <Button onClick={handleSavePermissions}>
                <Save className="mr-2 h-4 w-4" />
                保存配置
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 用户编辑对话框 */}
      <Dialog open={showUserEditDialog} onOpenChange={setShowUserEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              编辑用户信息 - {editingUser?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userName">姓名</Label>
                    <Input
                      id="userName"
                      value={editingUser?.name || ""}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">邮箱</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={editingUser?.email || ""}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userRole">角色</Label>
                    <Select 
                      value={editingUser?.role || ""} 
                      onValueChange={(value) => setEditingUser(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="超级管理员">超级管理员</SelectItem>
                        <SelectItem value="管理员">管理员</SelectItem>
                        <SelectItem value="编辑者">编辑者</SelectItem>
                        <SelectItem value="审阅者">审阅者</SelectItem>
                        <SelectItem value="普通用户">普通用户</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="userDepartment">部门</Label>
                    <Select 
                      value={editingUser?.department || ""} 
                      onValueChange={(value) => setEditingUser(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择部门" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT部门">IT部门</SelectItem>
                        <SelectItem value="锅炉事业部">锅炉事业部</SelectItem>
                        <SelectItem value="汽轮机事业部">汽轮机事业部</SelectItem>
                        <SelectItem value="发电机事业部">发电机事业部</SelectItem>
                        <SelectItem value="技术部门">技术部门</SelectItem>
                        <SelectItem value="质量部门">质量部门</SelectItem>
                        <SelectItem value="安全部门">安全部门</SelectItem>
                        <SelectItem value="人力资源部">人力资源部</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="userStatus">状态</Label>
                  <Select 
                    value={editingUser?.status || ""} 
                    onValueChange={(value) => setEditingUser(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">活跃</SelectItem>
                      <SelectItem value="inactive">非活跃</SelectItem>
                      <SelectItem value="suspended">已暂停</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowUserEditDialog(false)}>
                <X className="mr-2 h-4 w-4" />
                取消
              </Button>
              <Button onClick={handleSaveUser}>
                <Save className="mr-2 h-4 w-4" />
                保存用户
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
