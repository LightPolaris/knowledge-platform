"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [activeTab, setActiveTab] = useState("user-management")
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [showUserEditDialog, setShowUserEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false)
  const [newRole, setNewRole] = useState({ name: "", description: "" })
  const [isGroupPopoverOpen, setIsGroupPopoverOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([])
  const [selectAllDocuments, setSelectAllDocuments] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "访客",
    department: ""
  })

  // 权限配置数据结构
  const [rolePermissions, setRolePermissions] = useState({
    department: "",
    documentGroups: [] as string[],
    // 多级目录权限
    documentPermissions: {
      categories: [] as string[], // 选中的一级分类
      subcategories: [] as string[], // 选中的二级分类
      files: [] as string[], // 选中的具体文件类型
      // 全局分组操作权限
      globalView: false, // 全局查看权限
      globalEdit: false, // 全局编辑权限
      globalDelete: false, // 全局删除权限
      globalManage: false // 全局管理权限
    },
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

  // 页面加载时从URL参数或localStorage恢复标签页状态
  React.useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    } else {
      const savedTab = localStorage.getItem('permissionsActiveTab')
      if (savedTab) {
        setActiveTab(savedTab)
      }
    }
  }, [searchParams])

  // 保存标签页状态到localStorage
  React.useEffect(() => {
    localStorage.setItem('permissionsActiveTab', activeTab)
  }, [activeTab])

  // 同步全选状态
  React.useEffect(() => {
    const allCategories = documentCategories.map(cat => cat.id)
    const allSubcategories = documentCategories.flatMap(cat => cat.children.map(sub => sub.id))
    const allFiles = documentCategories.flatMap(cat => cat.children.flatMap(sub => sub.children))
    
    const isAllSelected = 
      rolePermissions.documentPermissions.categories.length === allCategories.length &&
      rolePermissions.documentPermissions.subcategories.length === allSubcategories.length &&
      rolePermissions.documentPermissions.files.length === allFiles.length
    
    setSelectAllDocuments(isAllSelected)
  }, [rolePermissions.documentPermissions])

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

  // 多级文档分组结构
  const documentCategories = [
    {
      id: "technical",
      name: "技术文档",
      children: [
        { id: "standards", name: "技术标准", children: ["国家标准", "行业标准", "企业标准"] },
        { id: "specifications", name: "技术规范", children: ["设计规范", "施工规范", "验收规范"] },
        { id: "manuals", name: "技术手册", children: ["操作手册", "维护手册", "故障手册"] }
      ]
    },
    {
      id: "management",
      name: "管理文档",
      children: [
        { id: "policies", name: "政策文件", children: ["公司政策", "部门制度", "工作流程"] },
        { id: "procedures", name: "程序文件", children: ["管理程序", "工作程序", "应急程序"] },
        { id: "records", name: "记录文件", children: ["会议记录", "检查记录", "培训记录"] }
      ]
    },
    {
      id: "safety",
      name: "安全文档",
      children: [
        { id: "safety-standards", name: "安全标准", children: ["安全规范", "防护标准", "应急标准"] },
        { id: "safety-procedures", name: "安全程序", children: ["安全检查", "安全培训", "事故处理"] },
        { id: "safety-records", name: "安全记录", children: ["安全检查记录", "事故报告", "培训记录"] }
      ]
    }
  ]

  const handleEditRole = (role: any) => {
    // 将角色信息存储到localStorage，供新页面使用
    localStorage.setItem('editingRole', JSON.stringify(role))
    // 跳转到角色权限配置页面
    router.push(`/permissions/role/${role.id}`)
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

  const handleManageUsers = (role: any) => {
    // 将角色信息存储到localStorage，供新页面使用
    localStorage.setItem('selectedRoleForUserManagement', JSON.stringify(role))
    // 跳转到用户管理页面
    router.push(`/permissions/users/${role.id}`)
  }

  const handleCreateRole = () => {
    if (newRole.name.trim()) {
      // 创建新角色
      const roleId = `role-${Date.now()}`
      const newRoleData = {
        id: roleId,
        name: newRole.name,
        description: newRole.description,
        users: [],
        permissions: {
          department: "",
          documentGroups: [],
          documentCategories: [],
          documentSubcategories: [],
          documentOperations: {
            add: false,
            edit: false,
            delete: false,
            view: false,
            download: false,
            share: false
          }
        }
      }
      
      // 这里应该调用API创建角色，现在只是模拟
      console.log("创建新角色:", newRoleData)
      
      // 重置表单并关闭对话框
      setNewRole({ name: "", description: "" })
      setShowCreateRoleDialog(false)
    }
  }

  const handleAddUser = () => {
    if (newUser.name.trim() && newUser.email.trim() && newUser.role.trim() && newUser.department.trim()) {
      const userId = Math.max(...users.map(u => u.id)) + 1
      const newUserData = {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        lastActive: new Date().toISOString().split('T')[0],
        status: "active"
      }
      console.log("添加新用户:", newUserData)
      setNewUser({ name: "", email: "", role: "", department: "" })
      setShowAddUserDialog(false)
    }
  }

  // 切换分类展开状态
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // 切换子分类展开状态
  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev => 
      prev.includes(subcategoryId) 
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    )
  }

  // 全选所有文档
  const handleSelectAllDocuments = (checked: boolean) => {
    setSelectAllDocuments(checked)
    if (checked) {
      // 获取所有分类、子分类和文件
      const allCategories = documentCategories.map(cat => cat.id)
      const allSubcategories = documentCategories.flatMap(cat => cat.children.map(sub => sub.id))
      const allFiles = documentCategories.flatMap(cat => cat.children.flatMap(sub => sub.children))
      
      setRolePermissions(prev => ({
        ...prev,
        documentPermissions: {
          ...prev.documentPermissions,
          categories: allCategories,
          subcategories: allSubcategories,
          files: allFiles
        }
      }))
    } else {
      // 清空所有选择
      setRolePermissions(prev => ({
        ...prev,
        documentPermissions: {
          ...prev.documentPermissions,
          categories: [],
          subcategories: [],
          files: []
        }
      }))
    }
  }

  // Mock roles data
  const roles = [
    {
      id: 1,
      name: "超级管理员",
      description: "拥有系统所有权限",
      users: [
        { id: 1, name: "系统管理员", email: "admin@dongfang.com", department: "技术部门" },
        { id: 2, name: "张总", email: "zhang@dongfang.com", department: "管理层" }
      ],
      permissions: ["所有权限"],
      status: "active",
    },
    {
      id: 2,
      name: "管理员",
      description: "管理系统用户和内容",
      users: [
        { id: 3, name: "李经理", email: "li@dongfang.com", department: "技术部门" },
        { id: 4, name: "王主管", email: "wang@dongfang.com", department: "质量部门" },
        { id: 5, name: "刘主任", email: "liu@dongfang.com", department: "安全部门" }
      ],
      permissions: ["用户管理", "内容管理", "系统配置"],
      status: "active",
    },
    {
      id: 3,
      name: "文档管理员",
      description: "管理文档上传、解析、分组和权限",
      users: [
        { id: 6, name: "陈文档", email: "chen@dongfang.com", department: "技术部门" },
        { id: 7, name: "赵资料", email: "zhao@dongfang.com", department: "质量部门" }
      ],
      permissions: ["文档上传", "文档解析", "文档分组", "文档权限"],
      status: "active",
    },
    {
      id: 4,
      name: "知识图谱专家",
      description: "构建和维护知识图谱",
      users: [
        { id: 8, name: "孙专家", email: "sun@dongfang.com", department: "技术部门" }
      ],
      permissions: ["知识图谱构建", "图谱调整", "规则配置"],
      status: "active",
    },
    {
      id: 5,
      name: "个人知识库管理员",
      description: "管理个人知识库和文档",
      users: [
        { id: 9, name: "周知识", email: "zhou@dongfang.com", department: "技术部门" },
        { id: 10, name: "吴库管", email: "wu@dongfang.com", department: "质量部门" }
      ],
      permissions: ["个人文档管理", "知识库维护", "内容整理"],
      status: "active",
    },
    {
      id: 6,
      name: "访客",
      description: "只读访问权限，可查看公开内容",
      users: [
        { id: 11, name: "访客用户", email: "guest@dongfang.com", department: "外部" }
      ],
      permissions: ["查看公开文档", "浏览知识库"],
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
    {
      id: 6,
      name: "孙八",
      email: "sun.ba@dongfang.com",
      role: "文档管理员",
      department: "财务部门",
      lastActive: "2024-01-10",
      status: "active",
    },
    {
      id: 7,
      name: "周九",
      email: "zhou.jiu@dongfang.com",
      role: "知识图谱专家",
      department: "研发部门",
      lastActive: "2024-01-09",
      status: "active",
    },
    {
      id: 8,
      name: "吴十",
      email: "wu.shi@dongfang.com",
      role: "管理员",
      department: "人力资源部",
      lastActive: "2024-01-08",
      status: "active",
    },
    {
      id: 9,
      name: "郑十一",
      email: "zheng.shiyi@dongfang.com",
      role: "个人知识库管理员",
      department: "市场部门",
      lastActive: "2024-01-07",
      status: "active",
    },
    {
      id: 10,
      name: "王十二",
      email: "wang.shi'er@dongfang.com",
      role: "文档管理员",
      department: "生产部门",
      lastActive: "2024-01-06",
      status: "active",
    },
    {
      id: 11,
      name: "李十三",
      email: "li.shisan@dongfang.com",
      role: "知识图谱专家",
      department: "技术部门",
      lastActive: "2024-01-05",
      status: "active",
    },
    {
      id: 12,
      name: "张十四",
      email: "zhang.shi'si@dongfang.com",
      role: "管理员",
      department: "IT部门",
      lastActive: "2024-01-04",
      status: "active",
    },
    {
      id: 13,
      name: "陈十五",
      email: "chen.shiwu@dongfang.com",
      role: "个人知识库管理员",
      department: "质量部门",
      lastActive: "2024-01-03",
      status: "active",
    },
    {
      id: 14,
      name: "刘十六",
      email: "liu.shi'liu@dongfang.com",
      role: "文档管理员",
      department: "锅炉事业部",
      lastActive: "2024-01-02",
      status: "active",
    },
    {
      id: 15,
      name: "杨十七",
      email: "yang.shi'qi@dongfang.com",
      role: "知识图谱专家",
      department: "研发部门",
      lastActive: "2024-01-01",
      status: "active",
    },
    {
      id: 16,
      name: "黄十八",
      email: "huang.shi'ba@dongfang.com",
      role: "管理员",
      department: "财务部门",
      lastActive: "2023-12-31",
      status: "active",
    },
    {
      id: 17,
      name: "赵十九",
      email: "zhao.shi'jiu@dongfang.com",
      role: "个人知识库管理员",
      department: "人力资源部",
      lastActive: "2023-12-30",
      status: "active",
    },
    {
      id: 18,
      name: "周二十",
      email: "zhou.er'shi@dongfang.com",
      role: "文档管理员",
      department: "市场部门",
      lastActive: "2023-12-29",
      status: "active",
    },
    {
      id: 19,
      name: "吴二一",
      email: "wu.er'yi@dongfang.com",
      role: "知识图谱专家",
      department: "生产部门",
      lastActive: "2023-12-28",
      status: "active",
    },
    {
      id: 20,
      name: "郑二二",
      email: "zheng.er'er@dongfang.com",
      role: "管理员",
      department: "技术部门",
      lastActive: "2023-12-27",
      status: "active",
    },
    {
      id: 21,
      name: "王二三",
      email: "wang.er'san@dongfang.com",
      role: "个人知识库管理员",
      department: "IT部门",
      lastActive: "2023-12-26",
      status: "active",
    },
    {
      id: 22,
      name: "李二四",
      email: "li.er'si@dongfang.com",
      role: "文档管理员",
      department: "质量部门",
      lastActive: "2023-12-25",
      status: "active",
    },
    {
      id: 23,
      name: "张二五",
      email: "zhang.er'wu@dongfang.com",
      role: "知识图谱专家",
      department: "锅炉事业部",
      lastActive: "2023-12-24",
      status: "active",
    },
    {
      id: 24,
      name: "陈二六",
      email: "chen.er'liu@dongfang.com",
      role: "管理员",
      department: "研发部门",
      lastActive: "2023-12-23",
      status: "active",
    },
    {
      id: 25,
      name: "刘二七",
      email: "liu.er'qi@dongfang.com",
      role: "个人知识库管理员",
      department: "财务部门",
      lastActive: "2023-12-22",
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

  // 分页计算
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // 重置到第一页当搜索条件改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedRole, selectedDepartment])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="权限管理" subtitle="管理系统用户角色和权限配置" />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                          <TabsList>
              <TabsTrigger value="user-management">用户管理</TabsTrigger>
              <TabsTrigger value="role-management">角色管理</TabsTrigger>
            </TabsList>

              {/* Users Tab */}
              <TabsContent value="user-management" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-serif">用户权限管理</CardTitle>
                        <CardDescription>查看和管理所有用户的角色和权限</CardDescription>
                      </div>
                      <Button onClick={() => setShowAddUserDialog(true)}>
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
                          {currentUsers.map((user) => (
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
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* 分页组件 */}
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          显示 {startIndex + 1} - {Math.min(endIndex, filteredUsers.length)} 条，共 {filteredUsers.length} 条
                        </span>
                        <Select value={pageSize.toString()} onValueChange={(value) => {
                          setPageSize(Number(value))
                          setCurrentPage(1)
                        }}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10条/页</SelectItem>
                            <SelectItem value="15">15条/页</SelectItem>
                            <SelectItem value="30">30条/页</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          上一页
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            )
                          })}
                          {totalPages > 5 && (
                            <>
                              <span className="text-sm text-muted-foreground">...</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(totalPages)}
                                className="w-8 h-8 p-0"
                              >
                                {totalPages}
                              </Button>
                            </>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          下一页
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Roles Tab */}
              <TabsContent value="role-management" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-serif">角色管理</CardTitle>
                        <CardDescription>创建和管理用户角色及权限分配</CardDescription>
                      </div>
                      <Button onClick={() => setShowCreateRoleDialog(true)}>
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
                                <span className="font-medium">{role.users.length}</span>
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
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleManageUsers(role)}
                                >
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
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto w-[90vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              角色权限配置 - {editingRole?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 文档分组权限 - 多级目录结构 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  文档分组权限
                </CardTitle>
                <CardDescription>配置角色对多级文档目录的操作权限</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 全局分组操作权限配置 */}
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">配置全局分组操作权限</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">查看权限</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="global-view"
                            checked={rolePermissions.documentPermissions.globalView || false}
                            onCheckedChange={(checked) => {
                              setRolePermissions(prev => ({
                                ...prev,
                                documentPermissions: {
                                  ...prev.documentPermissions,
                                  globalView: checked as boolean
                                }
                              }))
                            }}
                          />
                          <Label htmlFor="global-view" className="text-sm">允许查看所有文档分组</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">编辑权限</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="global-edit"
                            checked={rolePermissions.documentPermissions.globalEdit || false}
                            onCheckedChange={(checked) => {
                              setRolePermissions(prev => ({
                                ...prev,
                                documentPermissions: {
                                  ...prev.documentPermissions,
                                  globalEdit: checked as boolean
                                }
                              }))
                            }}
                          />
                          <Label htmlFor="global-edit" className="text-sm">允许编辑所有文档分组</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">删除权限</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="global-delete"
                            checked={rolePermissions.documentPermissions.globalDelete || false}
                            onCheckedChange={(checked) => {
                              setRolePermissions(prev => ({
                                ...prev,
                                documentPermissions: {
                                  ...prev.documentPermissions,
                                  globalDelete: checked as boolean
                                }
                              }))
                            }}
                          />
                          <Label htmlFor="global-delete" className="text-sm">允许删除所有文档分组</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">管理权限</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="global-manage"
                            checked={rolePermissions.documentPermissions.globalManage || false}
                            onCheckedChange={(checked) => {
                              setRolePermissions(prev => ({
                                ...prev,
                                documentPermissions: {
                                  ...prev.documentPermissions,
                                  globalManage: checked as boolean
                                }
                              }))
                            }}
                          />
                          <Label htmlFor="global-manage" className="text-sm">允许管理文档分组结构</Label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      全局权限将覆盖所有文档分组的细粒度权限设置
                    </div>
                  </div>

                  {/* 多级目录树 */}
                  <div className="space-y-2">
                    {documentCategories.map((category) => (
                      <div key={category.id} className="border rounded-lg">
                        {/* 一级分类 */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => toggleCategory(category.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                id={`category-${category.id}`}
                                checked={rolePermissions.documentPermissions.categories.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    const subcategories = category.children.map(sub => sub.id)
                                    const files = category.children.flatMap(sub => sub.children)
                                    setRolePermissions(prev => ({
                                      ...prev,
                                      documentPermissions: {
                                        ...prev.documentPermissions,
                                        categories: [...prev.documentPermissions.categories, category.id],
                                        subcategories: [...prev.documentPermissions.subcategories, ...subcategories],
                                        files: [...prev.documentPermissions.files, ...files]
                                      }
                                    }))
                                  } else {
                                    const subcategories = category.children.map(sub => sub.id)
                                    const files = category.children.flatMap(sub => sub.children)
                                    setRolePermissions(prev => ({
                                      ...prev,
                                      documentPermissions: {
                                        ...prev.documentPermissions,
                                        categories: prev.documentPermissions.categories.filter(c => c !== category.id),
                                        subcategories: prev.documentPermissions.subcategories.filter(s => !subcategories.includes(s)),
                                        files: prev.documentPermissions.files.filter(f => !files.includes(f))
                                      }
                                    }))
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex items-center gap-2">
                                <ChevronDown 
                                  className={`h-4 w-4 transition-transform ${
                                    expandedCategories.includes(category.id) ? 'rotate-0' : '-rotate-90'
                                  }`}
                                />
                                <Folder className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-lg">{category.name}</span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {category.children.length} 个二级分类
                            </div>
                          </div>
                        </div>

                        {/* 二级分类 - 可折叠 */}
                        {expandedCategories.includes(category.id) && (
                          <div className="border-t bg-muted/10">
                            {category.children.map((subcategory) => (
                              <div key={subcategory.id} className="border-b last:border-b-0">
                                <div 
                                  className="p-3 ml-4 cursor-pointer hover:bg-muted/20 transition-colors"
                                  onClick={() => toggleSubcategory(subcategory.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Checkbox 
                                        id={`subcategory-${subcategory.id}`}
                                        checked={rolePermissions.documentPermissions.subcategories.includes(subcategory.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setRolePermissions(prev => ({
                                              ...prev,
                                              documentPermissions: {
                                                ...prev.documentPermissions,
                                                subcategories: [...prev.documentPermissions.subcategories, subcategory.id],
                                                files: [...prev.documentPermissions.files, ...subcategory.children]
                                              }
                                            }))
                                          } else {
                                            setRolePermissions(prev => ({
                                              ...prev,
                                              documentPermissions: {
                                                ...prev.documentPermissions,
                                                subcategories: prev.documentPermissions.subcategories.filter(s => s !== subcategory.id),
                                                files: prev.documentPermissions.files.filter(f => !subcategory.children.includes(f))
                                              }
                                            }))
                                          }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <div className="flex items-center gap-2">
                                        <ChevronDown 
                                          className={`h-3 w-3 transition-transform ${
                                            expandedSubcategories.includes(subcategory.id) ? 'rotate-0' : '-rotate-90'
                                          }`}
                                        />
                                        <Folder className="h-4 w-4 text-green-600" />
                                        <span className="font-medium">{subcategory.name}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {subcategory.children.length} 个文件类型
                                    </div>
                                  </div>
                                </div>

                                {/* 三级文件类型 - 可折叠 */}
                                {expandedSubcategories.includes(subcategory.id) && (
                                  <div className="bg-muted/5 p-2 ml-8">
                                    <div className="space-y-1">
                                      {subcategory.children.map((file) => (
                                        <div key={file} className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded transition-colors">
                                          <Checkbox 
                                            id={`file-${file}`}
                                            checked={rolePermissions.documentPermissions.files.includes(file)}
                                            onCheckedChange={(checked) => {
                                              if (checked) {
                                                setRolePermissions(prev => ({
                                                  ...prev,
                                                  documentPermissions: {
                                                    ...prev.documentPermissions,
                                                    files: [...prev.documentPermissions.files, file]
                                                  }
                                                }))
                                              } else {
                                                setRolePermissions(prev => ({
                                                  ...prev,
                                                  documentPermissions: {
                                                    ...prev.documentPermissions,
                                                    files: prev.documentPermissions.files.filter(f => f !== file)
                                                  }
                                                }))
                                              }
                                            }}
                                          />
                                          <FileText className="h-3 w-3 text-muted-foreground" />
                                          <span className="text-sm text-muted-foreground">{file}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 权限统计 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {rolePermissions.documentPermissions.categories.length}
                        </div>
                        <div className="text-sm text-muted-foreground">一级分类</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {rolePermissions.documentPermissions.subcategories.length}
                        </div>
                        <div className="text-sm text-muted-foreground">二级分类</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {rolePermissions.documentPermissions.files.length}
                        </div>
                        <div className="text-sm text-muted-foreground">文件类型</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 系统功能权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  系统功能权限
                </CardTitle>
                <CardDescription>配置角色对系统各功能模块的访问权限</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      文档管理
                    </Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.fileComparison}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
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
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, knowledgeSearch: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      知识图谱
                    </Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.knowledgeSearch}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, knowledgeSearch: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      智能问答
                    </Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.knowledgeSearch}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, knowledgeSearch: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <GitCompare className="h-4 w-4" />
                      文件对比
                    </Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.fileComparison}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, fileComparison: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      用户管理
                    </Label>
                    <Switch 
                      checked={rolePermissions.systemManagement.permissionManagement}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({
                        ...prev,
                        systemManagement: {
                          ...prev.systemManagement,
                          permissionManagement: checked
                        }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 流程节点权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  流程节点权限
                </CardTitle>
                <CardDescription>配置角色对各个流程节点的操作权限</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-base">文档上传流程</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>文件上传</Label>
                        <Switch 
                          checked={rolePermissions.otherPermissions.workflowProcessing}
                          onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                            ...prev, 
                            otherPermissions: { ...prev.otherPermissions, workflowProcessing: checked }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>文档解析</Label>
                        <Switch 
                          checked={rolePermissions.otherPermissions.workflowProcessing}
                          onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                            ...prev, 
                            otherPermissions: { ...prev.otherPermissions, workflowProcessing: checked }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>内容审核</Label>
                        <Switch 
                          checked={rolePermissions.otherPermissions.workflowProcessing}
                          onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                            ...prev, 
                            otherPermissions: { ...prev.otherPermissions, workflowProcessing: checked }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>发布上线</Label>
                        <Switch 
                          checked={rolePermissions.otherPermissions.workflowProcessing}
                          onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                            ...prev, 
                            otherPermissions: { ...prev.otherPermissions, workflowProcessing: checked }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-base">知识图谱构建流程</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>数据收集</Label>
                        <Switch 
                          checked={rolePermissions.otherPermissions.workflowProcessing}
                          onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                            ...prev, 
                            otherPermissions: { ...prev.otherPermissions, workflowProcessing: checked }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>关系建模</Label>
                        <Switch 
                          checked={rolePermissions.otherPermissions.workflowProcessing}
                          onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                            ...prev, 
                            otherPermissions: { ...prev.otherPermissions, workflowProcessing: checked }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>图谱验证</Label>
                        <Switch 
                          checked={rolePermissions.otherPermissions.workflowProcessing}
                          onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                            ...prev, 
                            otherPermissions: { ...prev.otherPermissions, workflowProcessing: checked }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>图谱发布</Label>
                        <Switch 
                          checked={rolePermissions.otherPermissions.workflowProcessing}
                          onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                            ...prev, 
                            otherPermissions: { ...prev.otherPermissions, workflowProcessing: checked }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 系统设置权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  系统设置权限
                </CardTitle>
                <CardDescription>配置角色对系统设置项的操作权限</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>基础设置</Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.systemSettings}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, systemSettings: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>安全设置</Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.systemSettings}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, systemSettings: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>通知设置</Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.systemSettings}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, systemSettings: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>备份设置</Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.systemSettings}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, systemSettings: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>日志管理</Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.systemSettings}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
                        ...prev, 
                        otherPermissions: { ...prev.otherPermissions, systemSettings: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>性能监控</Label>
                    <Switch 
                      checked={rolePermissions.otherPermissions.systemSettings}
                      onCheckedChange={(checked) => setRolePermissions((prev: any) => ({ 
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
                      onChange={(e) => setEditingUser((prev: any) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">邮箱</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={editingUser?.email || ""}
                      onChange={(e) => setEditingUser((prev: any) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userRole">角色</Label>
                    <Select 
                      value={editingUser?.role || ""} 
                      onValueChange={(value) => setEditingUser((prev: any) => ({ ...prev, role: value }))}
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
                      onValueChange={(value) => setEditingUser((prev: any) => ({ ...prev, department: value }))}
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
                    onValueChange={(value) => setEditingUser((prev: any) => ({ ...prev, status: value }))}
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

      {/* 创建角色对话框 */}
      <Dialog open={showCreateRoleDialog} onOpenChange={setShowCreateRoleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              创建新角色
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="roleName">角色名称</Label>
              <Input
                id="roleName"
                placeholder="请输入角色名称"
                value={newRole.name}
                onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="roleDescription">角色描述</Label>
              <Textarea
                id="roleDescription"
                placeholder="请输入角色描述（可选）"
                value={newRole.description}
                onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateRoleDialog(false)}
            >
              取消
            </Button>
            <Button 
              onClick={handleCreateRole}
              disabled={!newRole.name.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              创建角色
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 添加用户对话框 */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              添加新用户
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="userName">用户姓名</Label>
              <Input
                id="userName"
                placeholder="请输入用户姓名"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="userEmail">邮箱地址</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="请输入邮箱地址"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="userRole">用户角色</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择用户角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="超级管理员">超级管理员</SelectItem>
                  <SelectItem value="管理员">管理员</SelectItem>
                  <SelectItem value="文档管理员">文档管理员</SelectItem>
                  <SelectItem value="知识图谱专家">知识图谱专家</SelectItem>
                  <SelectItem value="个人知识库管理员">个人知识库管理员</SelectItem>
                  <SelectItem value="访客">访客</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="userDepartment">所属部门</Label>
              <Select value={newUser.department} onValueChange={(value) => setNewUser(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择所属部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT部门">IT部门</SelectItem>
                  <SelectItem value="锅炉事业部">锅炉事业部</SelectItem>
                  <SelectItem value="技术部门">技术部门</SelectItem>
                  <SelectItem value="质量部门">质量部门</SelectItem>
                  <SelectItem value="财务部门">财务部门</SelectItem>
                  <SelectItem value="研发部门">研发部门</SelectItem>
                  <SelectItem value="人力资源部">人力资源部</SelectItem>
                  <SelectItem value="市场部门">市场部门</SelectItem>
                  <SelectItem value="生产部门">生产部门</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAddUserDialog(false)}
            >
              取消
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={!newUser.name.trim() || !newUser.email.trim() || !newUser.role.trim() || !newUser.department.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              添加用户
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
