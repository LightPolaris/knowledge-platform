"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Calendar,
  User,
  FileType,
  ArrowUpDown,
  X,
  Plus,
  Folder,
  Play,
  CheckCircle2,
  Import,
  Settings,
  FolderPlus,
  FolderEdit,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for documents
const mockDocuments = [
  {
    id: 1,
    name: "锅炉安全标准 2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-15",
    lastModified: "2024-01-15",
    uploadedBy: "张伟",
    category: "安全标准",
    version: "v2.1",
  },
  {
    id: 2,
    name: "技术规格说明书.docx",
    type: "Word",
    size: "1.8 MB",
    status: "已解析未审核",
    uploadDate: "2024-01-14",
    lastModified: "2024-01-14",
    uploadedBy: "李明",
    category: "技术文档",
    version: "v1.0",
  },
  {
    id: 3,
    name: "维护保养计划.xlsx",
    type: "Excel",
    size: "856 KB",
    status: "已解析已审核",
    uploadDate: "2024-01-13",
    lastModified: "2024-01-13",
    uploadedBy: "王芳",
    category: "维护保养",
    version: "v3.2",
  },
  {
    id: 4,
    name: "质量控制手册.pdf",
    type: "PDF",
    size: "3.1 MB",
    status: "未解析",
    uploadDate: "2024-01-12",
    lastModified: "2024-01-12",
    uploadedBy: "陈路",
    category: "质量控制",
    version: "v1.5",
  },
  {
    id: 5,
    name: "安装指南.pdf",
    type: "PDF",
    size: "4.2 MB",
    status: "已导入未审核",
    uploadDate: "2024-01-11",
    lastModified: "2024-01-11",
    uploadedBy: "刘刚",
    category: "安装指南",
    version: "v2.0",
  },
  {
    id: 6,
    name: "电气安全规范.pdf",
    type: "PDF",
    size: "1.9 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-10",
    lastModified: "2024-01-10",
    uploadedBy: "赵工程师",
    category: "安全标准",
    version: "v1.3",
  },
  {
    id: 7,
    name: "设备维护手册.docx",
    type: "Word",
    size: "2.1 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-09",
    lastModified: "2024-01-09",
    uploadedBy: "孙技师",
    category: "维护保养",
    version: "v2.1",
  },
  {
    id: 8,
    name: "检验测试报告.xlsx",
    type: "Excel",
    size: "1.2 MB",
    status: "已解析未审核",
    uploadDate: "2024-01-08",
    lastModified: "2024-01-08",
    uploadedBy: "周检验员",
    category: "质量控制",
    version: "v1.0",
  },
  {
    id: 9,
    name: "工艺流程说明.pdf",
    type: "PDF",
    size: "3.5 MB",
    status: "未解析",
    uploadDate: "2024-01-07",
    lastModified: "2024-01-07",
    uploadedBy: "吴工艺师",
    category: "技术文档",
    version: "v1.8",
  },
  {
    id: 10,
    name: "安全培训材料.pptx",
    type: "PowerPoint",
    size: "5.8 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-06",
    lastModified: "2024-01-06",
    uploadedBy: "郑培训师",
    category: "安全标准",
    version: "v3.0",
  },
  {
    id: 11,
    name: "设备故障诊断手册.pdf",
    type: "PDF",
    size: "2.7 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-05",
    lastModified: "2024-01-05",
    uploadedBy: "王维修",
    category: "维护保养",
    version: "v2.3",
  },
  {
    id: 12,
    name: "质量检测标准.docx",
    type: "Word",
    size: "1.5 MB",
    status: "已导入未审核",
    uploadDate: "2024-01-04",
    lastModified: "2024-01-04",
    uploadedBy: "李质检",
    category: "质量控制",
    version: "v1.6",
  },
  {
    id: 13,
    name: "技术参数表.xlsx",
    type: "Excel",
    size: "856 KB",
    status: "已解析已审核",
    uploadDate: "2024-01-03",
    lastModified: "2024-01-03",
    uploadedBy: "陈技术员",
    category: "技术文档",
    version: "v1.2",
  },
  {
    id: 14,
    name: "环保排放标准.pdf",
    type: "PDF",
    size: "1.8 MB",
    status: "未解析",
    uploadDate: "2024-01-02",
    lastModified: "2024-01-02",
    uploadedBy: "张环保",
    category: "安全标准",
    version: "v2.0",
  },
  {
    id: 15,
    name: "操作员手册.docx",
    type: "Word",
    size: "2.3 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-01",
    lastModified: "2024-01-01",
    uploadedBy: "刘操作员",
    category: "技术文档",
    version: "v1.9",
  },
  {
    id: 16,
    name: "维护记录表.xlsx",
    type: "Excel",
    size: "642 KB",
    status: "已解析未审核",
    uploadDate: "2023-12-31",
    lastModified: "2023-12-31",
    uploadedBy: "赵维护",
    category: "维护保养",
    version: "v1.1",
  },
  {
    id: 17,
    name: "安全防护指南.pdf",
    type: "PDF",
    size: "2.9 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-30",
    lastModified: "2023-12-30",
    uploadedBy: "孙安全",
    category: "安全标准",
    version: "v1.7",
  },
  {
    id: 18,
    name: "质量审核报告.docx",
    type: "Word",
    size: "1.7 MB",
    status: "已导入未审核",
    uploadDate: "2023-12-29",
    lastModified: "2023-12-29",
    uploadedBy: "吴审核员",
    category: "质量控制",
    version: "v1.4",
  },
  {
    id: 19,
    name: "设备配置清单.xlsx",
    type: "Excel",
    size: "1.1 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-28",
    lastModified: "2023-12-28",
    uploadedBy: "周配置",
    category: "技术文档",
    version: "v1.3",
  },
  {
    id: 20,
    name: "应急预案.pdf",
    type: "PDF",
    size: "3.2 MB",
    status: "未解析",
    uploadDate: "2023-12-27",
    lastModified: "2023-12-27",
    uploadedBy: "郑应急",
    category: "安全标准",
    version: "v2.2",
  },
  {
    id: 21,
    name: "维护保养计划表.xlsx",
    type: "Excel",
    size: "934 KB",
    status: "已解析已审核",
    uploadDate: "2023-12-26",
    lastModified: "2023-12-26",
    uploadedBy: "王计划",
    category: "维护保养",
    version: "v1.5",
  },
  {
    id: 22,
    name: "技术改进方案.docx",
    type: "Word",
    size: "2.6 MB",
    status: "已导入未审核",
    uploadDate: "2023-12-25",
    lastModified: "2023-12-25",
    uploadedBy: "李改进",
    category: "技术文档",
    version: "v1.0",
  },
  {
    id: 23,
    name: "质量检验规程.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-24",
    lastModified: "2023-12-24",
    uploadedBy: "陈检验",
    category: "质量控制",
    version: "v1.8",
  },
  {
    id: 24,
    name: "安全培训记录.xlsx",
    type: "Excel",
    size: "1.3 MB",
    status: "已解析未审核",
    uploadDate: "2023-12-23",
    lastModified: "2023-12-23",
    uploadedBy: "张培训",
    category: "安全标准",
    version: "v1.2",
  },
  {
    id: 25,
    name: "设备运行日志.docx",
    type: "Word",
    size: "1.9 MB",
    status: "已导入已审核",
    uploadDate: "2023-12-22",
    lastModified: "2023-12-22",
    uploadedBy: "刘运行",
    category: "维护保养",
    version: "v1.6",
  },
]

// Document groups for upload
const documentGroups = [
  "待分组",
  "安全标准",
  "技术文档", 
  "维护保养",
  "质量控制",
  "安装指南",
  "检验规程",
  "设计规范",
  "工艺标准"
]

// Mock data for document groups management
const mockGroups = [
  { id: 1, name: "安全标准", description: "安全相关的标准和规范文档", documentCount: 15, color: "blue" },
  { id: 2, name: "技术文档", description: "技术规格和说明文档", documentCount: 23, color: "green" },
  { id: 3, name: "维护保养", description: "设备维护和保养相关文档", documentCount: 8, color: "orange" },
  { id: 4, name: "质量控制", description: "质量管理和控制文档", documentCount: 12, color: "purple" },
  { id: 5, name: "安装指南", description: "设备安装和操作指南", documentCount: 6, color: "red" },
  { id: 6, name: "检验规程", description: "检验和测试规程文档", documentCount: 9, color: "yellow" },
  { id: 7, name: "设计规范", description: "设计标准和规范文档", documentCount: 18, color: "indigo" },
  { id: 8, name: "工艺标准", description: "工艺流程和标准文档", documentCount: 11, color: "pink" },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "未解析":
      return <Clock className="h-4 w-4 text-gray-600" />
    case "已解析未审核":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "已解析已审核":
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "已导入未审核":
      return <AlertCircle className="h-4 w-4 text-orange-600" />
    case "已导入已审核":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants = {
    "未解析": "secondary",
    "已解析未审核": "outline",
    "已解析已审核": "default",
    "已导入未审核": "outline",
    "已导入已审核": "default",
  } as const

  return (
    <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
      {status}
    </Badge>
  )
}

// Generate document number like DF-2024-001
const getDocumentNumber = (id: number) => `DF-2024-${String(id).padStart(3, '0')}`

export default function DocumentsPage() {
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // Upload related states
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [selectedGroup, setSelectedGroup] = useState("待分组")
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Group management states
  const [groups, setGroups] = useState(mockGroups)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupColor, setNewGroupColor] = useState("blue")
  
  // Document categorization states
  const [selectedDocumentsForGroup, setSelectedDocumentsForGroup] = useState<number[]>([])
  const [showDocumentSelection, setShowDocumentSelection] = useState(false)
  const [activeTab, setActiveTab] = useState("documents")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Change group dialog states
  const [showGroupChangeDialog, setShowGroupChangeDialog] = useState(false)
  const [selectedGroupForChange, setSelectedGroupForChange] = useState("")

  const filteredDocuments = mockDocuments.filter((doc) => {
    const query = searchQuery.toLowerCase().trim()
    const nameMatch = doc.name.toLowerCase().includes(query)
    const numberMatch = getDocumentNumber(doc.id).toLowerCase().includes(query)
    const matchesSearch = query === "" || nameMatch || numberMatch
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredDocuments.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, categoryFilter])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id))
    } else {
      setSelectedDocuments([])
    }
  }

  const handleSelectDocument = (docId: number, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, docId])
    } else {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== docId))
    }
  }

  // Upload functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadFiles(prev => [...prev, ...files])
  }

  const handleRemoveFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    // Simulate upload progress
    uploadFiles.forEach((file, index) => {
      const fileName = file.name
      setUploadProgress(prev => ({ ...prev, [fileName]: 0 }))
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[fileName] || 0
          if (current >= 100) {
            clearInterval(interval)
            return prev
          }
          return { ...prev, [fileName]: current + 10 }
        })
      }, 200)
    })
    
    // Clear files after upload
    setTimeout(() => {
      setUploadFiles([])
      setUploadProgress({})
    }, 3000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Group management functions
  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: groups.length + 1,
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        documentCount: 0,
        color: newGroupColor
      }
      setGroups([...groups, newGroup])
      setNewGroupName("")
      setNewGroupDescription("")
      setNewGroupColor("blue")
      setIsGroupDialogOpen(false)
    }
  }

  const handleEditGroup = (group: any) => {
    setEditingGroup(group)
    setNewGroupName(group.name)
    setNewGroupDescription(group.description)
    setNewGroupColor(group.color)
    setSelectedDocumentsForGroup([])
    setShowDocumentSelection(false)
    setIsGroupDialogOpen(true)
  }

  const handleUpdateGroup = () => {
    if (editingGroup && newGroupName.trim()) {
      setGroups(groups.map(group => 
        group.id === editingGroup.id 
          ? { ...group, name: newGroupName.trim(), description: newGroupDescription.trim(), color: newGroupColor }
          : group
      ))
      setEditingGroup(null)
      setNewGroupName("")
      setNewGroupDescription("")
      setNewGroupColor("blue")
      setIsGroupDialogOpen(false)
    }
  }

  const handleDeleteGroup = (groupId: number) => {
    setGroups(groups.filter(group => group.id !== groupId))
  }

  const handleCloseGroupDialog = () => {
    setIsGroupDialogOpen(false)
    setEditingGroup(null)
    setNewGroupName("")
    setNewGroupDescription("")
    setNewGroupColor("blue")
    setSelectedDocumentsForGroup([])
    setShowDocumentSelection(false)
  }

  // Document categorization functions
  const handleSelectDocumentForGroup = (docId: number, checked: boolean) => {
    if (checked) {
      setSelectedDocumentsForGroup([...selectedDocumentsForGroup, docId])
    } else {
      setSelectedDocumentsForGroup(selectedDocumentsForGroup.filter(id => id !== docId))
    }
  }

  const handleSelectAllDocumentsForGroup = (checked: boolean) => {
    if (checked) {
      setSelectedDocumentsForGroup(mockDocuments.map(doc => doc.id))
    } else {
      setSelectedDocumentsForGroup([])
    }
  }

  const handleCategorizeDocuments = () => {
    if (editingGroup && selectedDocumentsForGroup.length > 0) {
      // Update document categories
      const updatedDocuments = mockDocuments.map(doc => 
        selectedDocumentsForGroup.includes(doc.id) 
          ? { ...doc, category: editingGroup.name }
          : doc
      )
      
      // Update group document count
      const updatedGroups = groups.map(group => 
        group.id === editingGroup.id 
          ? { ...group, documentCount: group.documentCount + selectedDocumentsForGroup.length }
          : group
      )
      
      setGroups(updatedGroups)
      setSelectedDocumentsForGroup([])
      setShowDocumentSelection(false)
      console.log(`已将 ${selectedDocumentsForGroup.length} 个文档归类到分组 "${editingGroup.name}"`)
    }
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      red: "bg-red-100 text-red-800 border-red-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
      pink: "bg-pink-100 text-pink-800 border-pink-200",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  // Document action handlers
  const handleParseDocument = (docId: number) => {
    console.log(`开始解析文档 ${docId}`)
    // TODO: 实现解析逻辑
  }

  const handleReviewDocument = (docId: number) => {
    console.log(`开始审核文档 ${docId}`)
    // TODO: 实现审核逻辑
  }

  const handleImportDocument = (docId: number) => {
    console.log(`开始导入文档 ${docId}`)
    // TODO: 实现导入逻辑
  }

  // Get action buttons based on document status
  const getActionButtons = (doc: any) => {
    const buttons = []
    
    switch (doc.status) {
      case "未解析":
        buttons.push(
          <Button
            key="parse"
            variant="outline"
            size="sm"
            onClick={() => handleParseDocument(doc.id)}
            className="h-8 shrink-0"
          >
            <Play className="mr-1 h-3 w-3" />
            解析
          </Button>
        )
        break
      case "已解析未审核":
        buttons.push(
          <Button
            key="review"
            variant="outline"
            size="sm"
            onClick={() => handleReviewDocument(doc.id)}
            className="h-8 shrink-0"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            审核
          </Button>
        )
        break
      case "已解析已审核":
        buttons.push(
          <Button
            key="import"
            variant="outline"
            size="sm"
            onClick={() => handleImportDocument(doc.id)}
            className="h-8 shrink-0"
          >
            <Import className="mr-1 h-3 w-3" />
            导入
          </Button>
        )
        break
      case "已导入未审核":
        buttons.push(
          <Button
            key="review"
            variant="outline"
            size="sm"
            onClick={() => handleReviewDocument(doc.id)}
            className="h-8 shrink-0"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            审核
          </Button>
        )
        break
    }
    
    return buttons
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="文档管理" subtitle="上传、组织和管理您的技术文档" />

        <main className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="documents">所有文档</TabsTrigger>
                <TabsTrigger value="upload">上传文档</TabsTrigger>
                <TabsTrigger value="groups">分组管理</TabsTrigger>
                <TabsTrigger value="analytics">数据分析</TabsTrigger>
              </TabsList>
              {activeTab === "groups" && (
                <Button onClick={() => setIsGroupDialogOpen(true)}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  新建分组
                </Button>
              )}
            </div>

            <TabsContent value="documents" className="space-y-6">
              {/* Filters and Actions */}
              <Card>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索文档..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="未解析">未解析</SelectItem>
                        <SelectItem value="已解析未审核">已解析未审核</SelectItem>
                        <SelectItem value="已解析已审核">已解析已审核</SelectItem>
                        <SelectItem value="已导入未审核">已导入未审核</SelectItem>
                        <SelectItem value="已导入已审核">已导入已审核</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Category Filter */}
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="分组" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有分组</SelectItem>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.name}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                  </div>

                  {/* Batch Actions */}
                  {selectedDocuments.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-4">
                      <span className="text-sm font-medium">{selectedDocuments.length} 个文档已选择</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          下载
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => selectedDocuments.length && setShowGroupChangeDialog(true)} disabled={selectedDocuments.length === 0}>
                          <Edit className="mr-2 h-4 w-4" />
                          修改分组
                        </Button>
                        
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Documents Table */}
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-16 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                      <div className="col-span-1">
                        <Checkbox
                          checked={
                            selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </div>
                      <div className="col-span-2">文档编号</div>
                      <div className="col-span-4 flex items-center">
                        文档名称
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                      <div className="col-span-2">分组</div>
                      <div className="col-span-1">类型</div>
                      <div className="col-span-1">大小</div>
                      <div className="col-span-2">状态</div>
                      <div className="col-span-2">上传日期</div>
                      <div className="col-span-1">操作</div>
                    </div>

                     {currentDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="grid grid-cols-16 gap-4 p-4 border-b hover:bg-muted/30 transition-colors"
                      >
                        <div className="col-span-1">
                          <Checkbox
                            checked={selectedDocuments.includes(doc.id)}
                            onCheckedChange={(checked) => handleSelectDocument(doc.id, checked as boolean)}
                          />
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm font-mono text-muted-foreground">{getDocumentNumber(doc.id)}</p>
                        </div>
                        <div className="col-span-4">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            {doc.category}
                          </Badge>
                        </div>
                        <div className="col-span-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-sm text-muted-foreground">{doc.size}</div>
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(doc.status)}
                            {getStatusBadge(doc.status)}
                          </div>
                        </div>
                        <div className="col-span-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{doc.uploadDate}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <User className="h-3 w-3" />
                            <span>{doc.uploadedBy}</span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div className="flex items-center justify-end gap-1">
                            {getActionButtons(doc)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  预览
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  下载
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  编辑详情
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">未找到文档</h3>
                      <p className="mt-2 text-muted-foreground">请尝试调整搜索或筛选条件</p>
                    </div>
                  )}

                  {/* 分页组件 */}
                  {filteredDocuments.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          显示 {startIndex + 1} - {Math.min(endIndex, filteredDocuments.length)} 条，共 {filteredDocuments.length} 条
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
                            <SelectItem value="20">20条/页</SelectItem>
                            <SelectItem value="50">50条/页</SelectItem>
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">上传文档</CardTitle>
                  <CardDescription>向知识平台上传新文档，支持批量上传和分组选择</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Group Selection */}
                  <div>
                    <Label htmlFor="groupSelect" className="text-sm font-medium mb-2 block">
                      选择文档分组
                    </Label>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择文档分组" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="待分组">待分组</SelectItem>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.name}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Files */}
                  {uploadFiles.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        已选择的文件 ({uploadFiles.length} 个)
                      </Label>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {uploadFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Area */}
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">批量上传文档</h3>
                    <p className="mt-2 text-muted-foreground">拖拽文件到此处，或点击浏览</p>
                    <p className="mt-1 text-sm text-muted-foreground">支持PDF、Word、Excel、PowerPoint和文本文件</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      选择文件
                    </Button>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Upload Actions */}
                  {uploadFiles.length > 0 && (
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setUploadFiles([])}>
                        清空选择
                      </Button>
                      <Button 
                        onClick={handleUpload}
                        disabled={uploadFiles.length === 0}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        开始上传
                      </Button>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium">上传进度</h4>
                      <div className="space-y-3">
                        {Object.entries(uploadProgress).map(([fileName, progress]) => (
                          <div key={fileName} className="flex items-center space-x-4 p-3 border rounded-lg">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{fileName}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Progress value={progress} className="flex-1 h-2" />
                                <span className="text-xs text-muted-foreground">{progress}%</span>
                              </div>
                            </div>
                            <Badge variant={progress === 100 ? "default" : "outline"}>
                              {progress === 100 ? "已完成" : "上传中"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle className="font-serif">文档分组管理</CardTitle>
                    <CardDescription>管理文档分组，创建、编辑和删除分组</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group) => (
                      <div key={group.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Folder className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">{group.name}</h3>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                                <FolderEdit className="mr-2 h-4 w-4" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteGroup(group.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={`${getColorClasses(group.color)} text-xs`}>
                            {group.documentCount} 个文档
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded-full ${
                              group.color === 'blue' ? 'bg-blue-500' :
                              group.color === 'green' ? 'bg-green-500' :
                              group.color === 'orange' ? 'bg-orange-500' :
                              group.color === 'purple' ? 'bg-purple-500' :
                              group.color === 'red' ? 'bg-red-500' :
                              group.color === 'yellow' ? 'bg-yellow-500' :
                              group.color === 'indigo' ? 'bg-indigo-500' :
                              group.color === 'pink' ? 'bg-pink-500' : 'bg-blue-500'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">文档总数</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,847</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">+12%</span> 较上月
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">待审批</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-yellow-600">+3</span> 较昨日
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">存储使用</CardTitle>
                    <FileType className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">847 GB</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">+5.2%</span> 较上月
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">+5</span> 较上周
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Group Management Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={handleCloseGroupDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? '编辑分组' : '新建分组'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Group Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="groupName">分组名称</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="输入分组名称"
                />
              </div>
              <div>
                <Label htmlFor="groupDescription">分组描述</Label>
                <Input
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="输入分组描述"
                />
              </div>
              <div>
                <Label htmlFor="groupColor">分组颜色</Label>
                <Select value={newGroupColor} onValueChange={setNewGroupColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择颜色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">蓝色</SelectItem>
                    <SelectItem value="green">绿色</SelectItem>
                    <SelectItem value="orange">橙色</SelectItem>
                    <SelectItem value="purple">紫色</SelectItem>
                    <SelectItem value="red">红色</SelectItem>
                    <SelectItem value="yellow">黄色</SelectItem>
                    <SelectItem value="indigo">靛蓝</SelectItem>
                    <SelectItem value="pink">粉色</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Document Categorization (only for editing) */}
            {editingGroup && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">文档归类</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDocumentSelection(!showDocumentSelection)}
                  >
                    {showDocumentSelection ? '隐藏文档列表' : '选择文档归类'}
                  </Button>
                </div>
                
                {showDocumentSelection && (
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        checked={selectedDocumentsForGroup.length === mockDocuments.length && mockDocuments.length > 0}
                        onCheckedChange={handleSelectAllDocumentsForGroup}
                      />
                      <Label className="text-sm font-medium">全选文档</Label>
                    </div>
                    
                    <div className="space-y-2">
                      {mockDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                          <Checkbox
                            checked={selectedDocumentsForGroup.includes(doc.id)}
                            onCheckedChange={(checked) => handleSelectDocumentForGroup(doc.id, checked as boolean)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {doc.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    {selectedDocumentsForGroup.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            已选择 {selectedDocumentsForGroup.length} 个文档
                          </span>
                          <Button
                            size="sm"
                            onClick={handleCategorizeDocuments}
                          >
                            归类到分组
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCloseGroupDialog}>
                取消
              </Button>
              <Button 
                onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}
                disabled={!newGroupName.trim()}
              >
                {editingGroup ? '更新' : '创建'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 修改分组对话框 */}
      <Dialog open={showGroupChangeDialog} onOpenChange={setShowGroupChangeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              修改文档分组
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">已选择 {selectedDocuments.length} 个文档</p>
            <div>
              <Label className="text-sm font-medium mb-2 block">选择目标分组</Label>
              <Select value={selectedGroupForChange} onValueChange={setSelectedGroupForChange}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择分组" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowGroupChangeDialog(false)}>取消</Button>
            <Button onClick={() => {
              if (!selectedGroupForChange) return
              setShowGroupChangeDialog(false)
              setSelectedGroupForChange("")
              setSelectedDocuments([])
            }} disabled={!selectedGroupForChange}>确认修改</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
