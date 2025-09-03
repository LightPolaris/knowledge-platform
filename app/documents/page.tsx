"use client"

import { useState, useRef } from "react"
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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for documents
const mockDocuments = [
  {
    id: 1,
    name: "锅炉安全标准 2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "已导入",
    uploadDate: "2024-01-15",
    lastModified: "2024-01-15",
    uploadedBy: "张伟",
    category: "安全标准",
    version: "v2.1",
    description: "锅炉操作安全标准更新",
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
    description: "新型锅炉型号详细技术规格",
  },
  {
    id: 3,
    name: "维护保养计划.xlsx",
    type: "Excel",
    size: "856 KB",
    status: "已解析",
    uploadDate: "2024-01-13",
    lastModified: "2024-01-13",
    uploadedBy: "王芳",
    category: "维护保养",
    version: "v3.2",
    description: "年度维护保养计划和程序",
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
    description: "全面质量控制程序",
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
    description: "分步安装程序指南",
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "未解析":
      return <Clock className="h-4 w-4 text-gray-600" />
    case "已解析未审核":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "已解析":
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "已导入未审核":
      return <AlertCircle className="h-4 w-4 text-orange-600" />
    case "已导入":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants = {
    "未解析": "secondary",
    "已解析未审核": "outline",
    "已解析": "default",
    "已导入未审核": "outline",
    "已导入": "default",
  } as const

  return (
    <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
      {status}
    </Badge>
  )
}

export default function DocumentsPage() {
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // Upload related states
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [selectedGroup, setSelectedGroup] = useState("待分组")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

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
    setShowUploadDialog(true)
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
      setShowUploadDialog(false)
      setUploadProgress({})
    }, 3000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="文档管理" subtitle="上传、组织和管理您的技术文档" />

        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList>
              <TabsTrigger value="documents">所有文档</TabsTrigger>
              <TabsTrigger value="upload">上传文档</TabsTrigger>
              <TabsTrigger value="analytics">数据分析</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              {/* Filters and Actions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-serif">文档库</CardTitle>
                      <CardDescription>管理和组织您的技术文档</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        上传文档
                      </Button>
                    </div>
                  </div>
                </CardHeader>
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
                        <SelectItem value="已解析">已解析</SelectItem>
                        <SelectItem value="已导入未审核">已导入未审核</SelectItem>
                        <SelectItem value="已导入">已导入</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Category Filter */}
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="分组" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有分组</SelectItem>
                        <SelectItem value="安全标准">安全标准</SelectItem>
                        <SelectItem value="技术文档">技术文档</SelectItem>
                        <SelectItem value="维护保养">维护保养</SelectItem>
                        <SelectItem value="质量控制">质量控制</SelectItem>
                        <SelectItem value="安装指南">安装指南</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      更多筛选
                    </Button>
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
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          批量编辑
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
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                      <div className="col-span-1">
                        <Checkbox
                          checked={
                            selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </div>
                      <div className="col-span-3 flex items-center">
                        文档名称
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                      <div className="col-span-1">分组</div>
                      <div className="col-span-1">类型</div>
                      <div className="col-span-1">大小</div>
                      <div className="col-span-2">状态</div>
                      <div className="col-span-2">上传日期</div>
                      <div className="col-span-1">操作</div>
                    </div>

                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/30 transition-colors"
                      >
                        <div className="col-span-1">
                          <Checkbox
                            checked={selectedDocuments.includes(doc.id)}
                            onCheckedChange={(checked) => handleSelectDocument(doc.id, checked as boolean)}
                          />
                        </div>
                        <div className="col-span-3">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-1">
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
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
                    ))}
                  </div>

                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">未找到文档</h3>
                      <p className="mt-2 text-muted-foreground">请尝试调整搜索或筛选条件</p>
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
                <CardContent>
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

                  {/* Upload Progress */}
                  <div className="mt-6 space-y-4">
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              批量上传文档
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
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
                  {documentGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Files */}
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

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                取消
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={uploadFiles.length === 0}
              >
                <Upload className="mr-2 h-4 w-4" />
                开始上传
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
