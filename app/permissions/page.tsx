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
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  ChevronDown,
  Check,
} from "lucide-react"

export default function PermissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [showUserEditDialog, setShowUserEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isGroupPopoverOpen, setIsGroupPopoverOpen] = useState(false)

  // 权限配置数据结构
  const [rolePermissions, setRolePermissions] = useState({
    department: "",
    documentGroups: [] as string[],
    // 文档管理权限 - 按文档类型分配
    documentManagement: {
      managementStandards: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      },
      qualityStandards: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      },
      steelStructure: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      },
      safetyStandards: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      },
      technicalSpecs: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      }
    },
    // 专家权限
    expertPermissions: {
      knowledgeGraphReview: {
        enabled: false,
        allowedDepartments: [] as string[]
      },
      intelligentQAReview: {
        enabled: false,
        allowedDepartments: [] as string[]
      }
    },
    // 系统管理权限
    systemManagement: {
      permissionManagement: false,
      userAccountManagement: {
        canCreate: false,
        canDelete: false,
        canEdit: false
      }
    },
    // 其他权限
    otherPermissions: {
      fileComparison: false,
      knowledgeSearch: false,
      workflowProcessing: false,
      systemSettings: false,
    }
  })

  // 部门选项
  const departments = [
    "IT部门", "锅炉事业部", "汽轮机事业部", "发电机事业部", 
    "技术部门", "质量部门", "安全部门", "人力资源部",
    "环保研发部", "工艺研发部", "容器研发室", "钢结构研发室",
    "材料研发室", "电气研发室", "机械研发室"
  ]

  // 文档类型选项
  const documentTypes = [
    { key: "managementStandards", name: "管理标准", departments: ["技术部门", "质量部门", "安全部门"] },
    { key: "qualityStandards", name: "质量标准", departments: ["质量部门", "技术部门", "工艺研发部"] },
    { key: "steelStructure", name: "钢结构", departments: ["钢结构研发室", "机械研发室", "技术部门"] },
    { key: "safetyStandards", name: "安全规范", departments: ["安全部门", "环保研发部", "技术部门"] },
    { key: "technicalSpecs", name: "技术规格", departments: ["技术部门", "各研发室", "质量部门"] }
  ]

  // 专家权限相关部门
  const expertDepartments = [
    "环保研发部", "工艺研发部", "容器研发室", "钢结构研发室",
    "材料研发室", "电气研发室", "机械研发室"
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
      name: "文档管理员",
      description: "管理文档上传、解析、分组和权限",
      users: 12,
      permissions: ["文档上传", "文档解析", "文档分组", "文档权限"],
      status: "active",
    },
    {
      id: 4,
      name: "知识图谱专家",
      description: "构建和维护知识图谱",
      users: 6,
      permissions: ["知识图谱构建", "图谱调整", "规则配置"],
      status: "active",
    },
    {
      id: 5,
      name: "个人知识库管理员",
      description: "管理个人知识库和文档",
      users: 28,
      permissions: ["个人文档管理", "知识库维护", "内容整理"],
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
      role: "文档管理员",
      department: "技术部门",
      lastActive: "2024-01-13",
      status: "active",
    },
    {
      id: 4,
      name: "赵六",
      email: "zhao.liu@dongfang.com",
      role: "知识图谱专家",
      department: "技术部门",
      lastActive: "2024-01-12",
      status: "active",
    },
    {
      id: 5,
      name: "钱七",
      email: "qian.qi@dongfang.com",
      role: "个人知识库管理员",
      department: "质量部门",
      lastActive: "2024-01-11",
      status: "active",
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
                          <SelectItem value="文档管理员">文档管理员</SelectItem>
                          <SelectItem value="知识图谱专家">知识图谱专家</SelectItem>
                          <SelectItem value="个人知识库管理员">个人知识库管理员</SelectItem>
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
                  <Popover open={isGroupPopoverOpen} onOpenChange={setIsGroupPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isGroupPopoverOpen}
                        className="w-full justify-between mt-2"
                      >
                        {rolePermissions.documentGroups.length > 0 
                          ? `${rolePermissions.documentGroups.length} 个分组已选择`
                          : "选择文档分组权限"
                        }
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <div className="max-h-60 overflow-y-auto">
                        <div className="p-2">
                          <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                            <Checkbox
                              id="select-all-groups"
                              checked={rolePermissions.documentGroups.length === documentGroups.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setRolePermissions(prev => ({
                                    ...prev,
                                    documentGroups: [...documentGroups]
                                  }))
                                } else {
                                  setRolePermissions(prev => ({
                                    ...prev,
                                    documentGroups: []
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor="select-all-groups" className="text-sm font-medium">
                              全选
                            </Label>
                          </div>
                          <div className="border-t my-1" />
                          {documentGroups.map((group) => (
                            <div key={group} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                              <Checkbox
                                id={group}
                                checked={rolePermissions.documentGroups.includes(group)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
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
                              />
                              <Label htmlFor={group} className="text-sm flex-1">{group}</Label>
                              {rolePermissions.documentGroups.includes(group) && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* 文档管理权限 - 按文档类型分配 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  文档管理权限
                </CardTitle>
                <CardDescription>按文档类型配置权限，不同文档类型对应不同部门查看权限</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {documentTypes.map((docType) => (
                  <div key={docType.key} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-base">{docType.name}</h4>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-64 justify-between"
                          >
                            {rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].allowedDepartments.length > 0 
                              ? `${rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].allowedDepartments.length} 个部门已选择`
                              : "选择相关部门"
                            }
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0" align="end">
                          <div className="max-h-60 overflow-y-auto">
                            <div className="p-2">
                              <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                                <Checkbox
                                  id={`select-all-${docType.key}`}
                                  checked={rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].allowedDepartments.length === docType.departments.length}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setRolePermissions(prev => ({
                                        ...prev,
                                        documentManagement: {
                                          ...prev.documentManagement,
                                          [docType.key]: {
                                            ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                            allowedDepartments: [...docType.departments]
                                          }
                                        }
                                      }))
                                    } else {
                                      setRolePermissions(prev => ({
                                        ...prev,
                                        documentManagement: {
                                          ...prev.documentManagement,
                                          [docType.key]: {
                                            ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                            allowedDepartments: []
                                          }
                                        }
                                      }))
                                    }
                                  }}
                                />
                                <Label htmlFor={`select-all-${docType.key}`} className="text-sm font-medium">
                                  全选
                                </Label>
                              </div>
                              <div className="border-t my-1" />
                              {docType.departments.map((dept) => (
                                <div key={dept} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                                  <Checkbox
                                    id={`${docType.key}-${dept}`}
                                    checked={rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].allowedDepartments.includes(dept)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setRolePermissions(prev => ({
                                          ...prev,
                                          documentManagement: {
                                            ...prev.documentManagement,
                                            [docType.key]: {
                                              ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                              allowedDepartments: [...prev.documentManagement[docType.key as keyof typeof prev.documentManagement].allowedDepartments, dept]
                                            }
                                          }
                                        }))
                                      } else {
                                        setRolePermissions(prev => ({
                                          ...prev,
                                          documentManagement: {
                                            ...prev.documentManagement,
                                            [docType.key]: {
                                              ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                              allowedDepartments: prev.documentManagement[docType.key as keyof typeof prev.documentManagement].allowedDepartments.filter(d => d !== dept)
                                            }
                                          }
                                        }))
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`${docType.key}-${dept}`} className="text-sm flex-1">{dept}</Label>
                                  {rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].allowedDepartments.includes(dept) && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>查看</Label>
                        <Switch 
                          checked={rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].canView}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            documentManagement: {
                              ...prev.documentManagement,
                              [docType.key]: {
                                ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                canView: checked
                              }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>编辑</Label>
                        <Switch 
                          checked={rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].canEdit}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            documentManagement: {
                              ...prev.documentManagement,
                              [docType.key]: {
                                ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                canEdit: checked
                              }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>解析</Label>
                        <Switch 
                          checked={rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].canParse}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            documentManagement: {
                              ...prev.documentManagement,
                              [docType.key]: {
                                ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                canParse: checked
                              }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>解析审核</Label>
                        <Switch 
                          checked={rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].canReview}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            documentManagement: {
                              ...prev.documentManagement,
                              [docType.key]: {
                                ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                canReview: checked
                              }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>增加</Label>
                        <Switch 
                          checked={rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].canAdd}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            documentManagement: {
                              ...prev.documentManagement,
                              [docType.key]: {
                                ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                canAdd: checked
                              }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>删除</Label>
                        <Switch 
                          checked={rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].canDelete}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            documentManagement: {
                              ...prev.documentManagement,
                              [docType.key]: {
                                ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                canDelete: checked
                              }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>新建文件夹</Label>
                        <Switch 
                          checked={rolePermissions.documentManagement[docType.key as keyof typeof rolePermissions.documentManagement].canCreateFolder}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            documentManagement: {
                              ...prev.documentManagement,
                              [docType.key]: {
                                ...prev.documentManagement[docType.key as keyof typeof prev.documentManagement],
                                canCreateFolder: checked
                              }
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 专家权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  专家权限
                </CardTitle>
                <CardDescription>专家拥有知识图谱审核、智能问答答案审核权限</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">知识图谱审核</Label>
                      <p className="text-sm text-muted-foreground">审核知识图谱构建和调整</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.expertPermissions.knowledgeGraphReview.enabled}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        expertPermissions: {
                          ...prev.expertPermissions,
                          knowledgeGraphReview: {
                            ...prev.expertPermissions.knowledgeGraphReview,
                            enabled: checked
                          }
                        }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">智能问答答案审核</Label>
                      <p className="text-sm text-muted-foreground">审核智能问答系统的答案质量</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.expertPermissions.intelligentQAReview.enabled}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        expertPermissions: {
                          ...prev.expertPermissions,
                          intelligentQAReview: {
                            ...prev.expertPermissions.intelligentQAReview,
                            enabled: checked
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium mb-2 block">专家权限适用部门</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {expertDepartments.map((dept) => (
                      <div key={dept} className="flex items-center space-x-2">
                        <Checkbox
                          id={`expert-${dept}`}
                          checked={rolePermissions.expertPermissions.knowledgeGraphReview.allowedDepartments.includes(dept) ||
                                   rolePermissions.expertPermissions.intelligentQAReview.allowedDepartments.includes(dept)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRolePermissions(prev => ({
                                ...prev,
                                expertPermissions: {
                                  knowledgeGraphReview: {
                                    ...prev.expertPermissions.knowledgeGraphReview,
                                    allowedDepartments: [...prev.expertPermissions.knowledgeGraphReview.allowedDepartments, dept]
                                  },
                                  intelligentQAReview: {
                                    ...prev.expertPermissions.intelligentQAReview,
                                    allowedDepartments: [...prev.expertPermissions.intelligentQAReview.allowedDepartments, dept]
                                  }
                                }
                              }))
                            } else {
                              setRolePermissions(prev => ({
                                ...prev,
                                expertPermissions: {
                                  knowledgeGraphReview: {
                                    ...prev.expertPermissions.knowledgeGraphReview,
                                    allowedDepartments: prev.expertPermissions.knowledgeGraphReview.allowedDepartments.filter(d => d !== dept)
                                  },
                                  intelligentQAReview: {
                                    ...prev.expertPermissions.intelligentQAReview,
                                    allowedDepartments: prev.expertPermissions.intelligentQAReview.allowedDepartments.filter(d => d !== dept)
                                  }
                                }
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`expert-${dept}`} className="text-sm">{dept}</Label>
                      </div>
                    ))}
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
                <CardDescription>知识图谱构建和维护权限</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>知识图谱查看</Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.knowledgeSearch}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        otherPermissions: { ...prev.otherPermissions, knowledgeSearch: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>知识图谱调整</Label>
                    <Switch 
                      checked={rolePermissions.expertPermissions.knowledgeGraphReview.enabled}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        expertPermissions: {
                          ...prev.expertPermissions,
                          knowledgeGraphReview: {
                            ...prev.expertPermissions.knowledgeGraphReview,
                            enabled: checked
                          }
                        }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>知识图谱自定义构建</Label>
                    <Switch 
                      checked={rolePermissions.expertPermissions.knowledgeGraphReview.enabled}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        expertPermissions: {
                          ...prev.expertPermissions,
                          knowledgeGraphReview: {
                            ...prev.expertPermissions.knowledgeGraphReview,
                            enabled: checked
                          }
                        }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>知识图谱构建规则调整</Label>
                    <Switch 
                      checked={rolePermissions.expertPermissions.knowledgeGraphReview.enabled}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        expertPermissions: {
                          ...prev.expertPermissions,
                          knowledgeGraphReview: {
                            ...prev.expertPermissions.knowledgeGraphReview,
                            enabled: checked
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 系统管理权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  系统管理权限
                </CardTitle>
                <CardDescription>权限管理和用户账号管理</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">权限管理</Label>
                      <p className="text-sm text-muted-foreground">给角色配置权限</p>
                    </div>
                    <Switch 
                      checked={rolePermissions.systemManagement.permissionManagement}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({
                        ...prev,
                        systemManagement: {
                          ...prev.systemManagement,
                          permissionManagement: checked
                        }
                      }))}
                    />
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label className="text-base font-medium mb-4 block">用户账号管理</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>新建账号</Label>
                        <Switch 
                          checked={rolePermissions.systemManagement.userAccountManagement.canCreate}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            systemManagement: {
                              ...prev.systemManagement,
                              userAccountManagement: {
                                ...prev.systemManagement.userAccountManagement,
                                canCreate: checked
                              }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>删除账号</Label>
                        <Switch 
                          checked={rolePermissions.systemManagement.userAccountManagement.canDelete}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            systemManagement: {
                              ...prev.systemManagement,
                              userAccountManagement: {
                                ...prev.systemManagement.userAccountManagement,
                                canDelete: checked
                              }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>编辑账号</Label>
                        <Switch 
                          checked={rolePermissions.systemManagement.userAccountManagement.canEdit}
                          onCheckedChange={(checked) => setRolePermissions(prev => ({
                            ...prev,
                            systemManagement: {
                              ...prev.systemManagement,
                              userAccountManagement: {
                                ...prev.systemManagement.userAccountManagement,
                                canEdit: checked
                              }
                            }
                          }))}
                        />
                      </div>
                    </div>
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
                      checked={rolePermissions.otherPermissions.fileComparison}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, fileComparison: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <SearchIcon className="h-4 w-4" />
                      知识搜索
                    </Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.knowledgeSearch}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, knowledgeSearch: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Workflow className="h-4 w-4" />
                      流程处理
                      <Badge variant="secondary" className="text-xs">仅特定人员可用</Badge>
                    </Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.workflowProcessing}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, workflowProcessing: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      系统设置
                      <Badge variant="outline" className="text-xs">普通用户可设置项较少</Badge>
                    </Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.systemSettings}
                      onCheckedChange={(checked) => setRolePermissions(prev => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, systemSettings: checked }
                      }))}
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
                        <SelectItem value="文档管理员">文档管理员</SelectItem>
                        <SelectItem value="知识图谱专家">知识图谱专家</SelectItem>
                        <SelectItem value="个人知识库管理员">个人知识库管理员</SelectItem>
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
