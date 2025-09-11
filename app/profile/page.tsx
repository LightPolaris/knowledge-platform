"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Upload,
  FileText,
  MessageSquare,
  Star,
  Clock,
  Settings,
  Cloud,
  Folder,
  Plus,
  Search,
  Filter,
  Share,
  Heart,
  Trash2,
  Eye,
  Download,
  MoreHorizontal,
  Tag,
  HardDrive,
  Users,
  Network,
  X,
  Check,
  Copy,
  ChevronRight,
  ChevronDown,
  FolderOpen
} from "lucide-react"

export default function PersonalWorkspacePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)

  const [profile, setProfile] = useState({
    name: "张三",
    email: "zhang.san@dongfang.com",
    phone: "+86 138 0013 8000",
    employeeId: "DF2024001",
    department: "锅炉事业部",
    position: "高级工程师",
    location: "北京市朝阳区",
    joinDate: "2020-03-15",
    avatar: "",
  })

  // 存储信息
  const storageInfo = {
    used: 2048, // MB
    total: 5120, // MB
    percentage: 40
  }

  // 多级分类结构
  const categoryTree = [
    {
      id: 1,
      name: "技术文档",
      type: "folder",
      children: [
        {
          id: 11,
          name: "锅炉技术",
          type: "folder",
          children: [
            { id: 111, name: "个人技术笔记.pdf", type: "file", size: "2.4 MB", uploadDate: "2024-01-15" },
            { id: 112, name: "锅炉操作手册.pdf", type: "file", size: "3.2 MB", uploadDate: "2024-01-14" }
          ]
        },
        {
          id: 12,
          name: "安全标准",
          type: "folder",
          children: [
            { id: 121, name: "安全规范2024.pdf", type: "file", size: "1.8 MB", uploadDate: "2024-01-13" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "项目文档",
      type: "folder",
      children: [
        {
          id: 21,
          name: "2024项目",
          type: "folder",
          children: [
            { id: 211, name: "项目总结报告.docx", type: "file", size: "1.8 MB", uploadDate: "2024-01-14" },
            { id: 212, name: "进度报告.xlsx", type: "file", size: "856 KB", uploadDate: "2024-01-13" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "学习资料",
      type: "folder",
      children: [
        { id: 31, name: "学习资料.xlsx", type: "file", size: "856 KB", uploadDate: "2024-01-13" },
        { id: 32, name: "培训材料.pdf", type: "file", size: "2.1 MB", uploadDate: "2024-01-12" }
      ]
    }
  ]

  // 当前选中的分类路径
  const [selectedPath, setSelectedPath] = useState<number[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set([1, 2, 3]))
  const [currentFolder, setCurrentFolder] = useState<number | null>(null)

  // 辅助函数
  const toggleFolder = (folderId: number) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const getCurrentItems = () => {
    try {
      let current = categoryTree
      for (const id of selectedPath) {
        const item = current.find(item => item.id === id)
        if (item && item.children) {
          current = item.children
        } else {
          return []
        }
      }
      return current || []
    } catch (error) {
      console.error('Error in getCurrentItems:', error)
      return []
    }
  }

  const getBreadcrumb = () => {
    const breadcrumb = []
    let current = categoryTree
    for (const id of selectedPath) {
      const item = current.find(item => item.id === id)
      if (item) {
        breadcrumb.push(item.name)
        if (item.children) {
          current = item.children
        }
      }
    }
    return breadcrumb
  }

  // 活动记录
  const activities = [
    {
      id: 1,
      type: "upload",
      title: "上传了文档",
      description: "个人技术笔记.pdf",
      time: "2小时前",
      icon: Upload
    },
    {
      id: 2,
      type: "favorite",
      title: "收藏了文档",
      description: "锅炉安全标准 2024.pdf",
      time: "1天前",
      icon: Heart
    },
    {
      id: 3,
      type: "share",
      title: "分享了文档",
      description: "技术规格说明书.docx",
      time: "2天前",
      icon: Share
    },
    {
      id: 4,
      type: "question",
      title: "提出了问题",
      description: "关于锅炉压力控制的问题",
      time: "3天前",
      icon: MessageSquare
    }
  ]

  // 统计数据
  const stats = [
    { label: "文档贡献", value: "47", description: "上传文档数量" },
    { label: "问题解决", value: "23", description: "回答问题数量" },
    { label: "知识评分", value: "4.8", description: "平均评分" },
    { label: "活跃度", value: "92%", description: "本月活跃度" }
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const handleUpload = () => {
    setShowUploadDialog(true)
  }

  const handleShare = (document) => {
    setSelectedDocument(document)
    setShowShareDialog(true)
  }

  const handleFavorite = (documentId) => {
    // 处理收藏逻辑
    console.log("收藏文档:", documentId)
  }

  const handleDelete = (documentId) => {
    // 处理删除逻辑
    console.log("删除文档:", documentId)
  }

  const handleCreateFolder = () => {
    console.log('Create new folder')
  }

  const handleUploadDocument = () => {
    console.log('Upload document')
  }

  const handleFolderAction = (action: string, folderId: number) => {
    console.log(`${action} folder:`, folderId)
  }

  const handleFileAction = (action: string, fileId: number) => {
    console.log(`${action} file:`, fileId)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="个人工作台" subtitle="管理个人信息、文档和查看活动记录" />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">总览</TabsTrigger>
                <TabsTrigger value="documents">我的文档</TabsTrigger>
                <TabsTrigger value="profile">个人信息</TabsTrigger>
                <TabsTrigger value="activity">活动记录</TabsTrigger>
              </TabsList>

              {/* 总览页面 */}
              <TabsContent value="overview" className="space-y-6">
                {/* 存储信息 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HardDrive className="h-5 w-5 mr-2" />
                      存储空间
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Cloud className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">已使用 {storageInfo.used}MB / {storageInfo.total}MB</p>
                          <p className="text-xs text-muted-foreground">个人知识库存储</p>
                        </div>
                      </div>
                      <div className="flex-1 max-w-xs">
                        <Progress value={storageInfo.percentage} className="h-2" />
                      </div>
                      <Badge variant={storageInfo.percentage > 80 ? "destructive" : "secondary"}>
                        {storageInfo.percentage}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 快速操作 */}
                <Card>
                  <CardHeader>
                    <CardTitle>快速操作</CardTitle>
                    <CardDescription>常用功能快速访问</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-20 flex-col" onClick={handleUpload}>
                        <Upload className="h-6 w-6 mb-2" />
                        上传文档
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Folder className="h-6 w-6 mb-2" />
                        新建文件夹
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Share className="h-6 w-6 mb-2" />
                        分享文档
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Settings className="h-6 w-6 mb-2" />
                        设置
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 统计信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                          </div>
                          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 最近活动 */}
                <Card>
                  <CardHeader>
                    <CardTitle>最近活动</CardTitle>
                    <CardDescription>您最近的操作记录</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4">
                          <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                            <activity.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 我的文档页面 */}
              <TabsContent value="documents" className="space-y-4">
                {/* 搜索和操作栏 */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="搜索文档..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCreateFolder}>
                    <Folder className="mr-2 h-4 w-4" />
                    新建文件夹
                  </Button>
                  <Button size="sm" onClick={handleUploadDocument}>
                    <Plus className="mr-2 h-4 w-4" />
                    上传文档
                  </Button>
                </div>

                {/* 面包屑导航 */}
                {selectedPath.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <button 
                      onClick={() => setSelectedPath([])}
                      className="hover:text-foreground"
                    >
                      全部文档
                    </button>
                    {getBreadcrumb().map((name, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4" />
                        <button 
                          onClick={() => setSelectedPath(selectedPath.slice(0, index + 1))}
                          className="hover:text-foreground"
                        >
                          {name}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 文档树形结构 */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-1">
                      {(() => {
                        try {
                          const items = getCurrentItems()
                          if (!items || items.length === 0) {
                            return (
                              <div className="text-center py-8 text-muted-foreground">
                                暂无文档
                              </div>
                            )
                          }
                          return items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-md group">
                              <div className="flex items-center space-x-3 flex-1">
                                {item.type === 'folder' ? (
                                  <button
                                    onClick={() => toggleFolder(item.id)}
                                    className="flex items-center space-x-2 flex-1 text-left"
                                  >
                                    {expandedFolders.has(item.id) ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <FolderOpen className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">{item.name}</span>
                                    {item.children && (
                                      <span className="text-xs text-muted-foreground">
                                        ({item.children.length})
                                      </span>
                                    )}
                                  </button>
                                ) : (
                                  <div className="flex items-center space-x-2 flex-1">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span>{item.name}</span>
                                    <span className="text-xs text-muted-foreground ml-auto">
                                      {item.size}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {item.type === 'folder' ? (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedPath([...selectedPath, item.id])}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleFolderAction('edit', item.id)}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleFolderAction('delete', item.id)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" onClick={() => handleFileAction('view', item.id)}>
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleFileAction('share', item.id)}>
                                    <Share className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleFileAction('download', item.id)}>
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))
                        } catch (error) {
                          console.error('Error rendering items:', error)
                          return (
                            <div className="text-center py-8 text-red-500">
                              加载文档时出错
                            </div>
                          )
                        }
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 个人信息页面 */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>个人信息</CardTitle>
                    <CardDescription>管理您的个人资料和账户设置</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 头像和基本信息 */}
                    <div className="flex items-center space-x-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="text-lg">
                          {profile.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p className="text-muted-foreground">{profile.position}</p>
                        <p className="text-sm text-muted-foreground">{profile.department}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            保存
                          </>
                        ) : (
                          <>
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                          </>
                        )}
                      </Button>
                    </div>

                    {/* 详细信息表单 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">姓名</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            disabled={true}
                            className="bg-gray-50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">邮箱</Label>
                          <Input
                            id="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">电话</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="employeeId">员工号</Label>
                          <Input
                            id="employeeId"
                            value={profile.employeeId}
                            disabled={true}
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="department">部门</Label>
                          <Input
                            id="department"
                            value={profile.department}
                            disabled={true}
                            className="bg-gray-50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="position">职位</Label>
                          <Input
                            id="position"
                            value={profile.position}
                            disabled={true}
                            className="bg-gray-50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">位置</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            disabled={true}
                            className="bg-gray-50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="joinDate">入职日期</Label>
                          <Input
                            id="joinDate"
                            value={profile.joinDate}
                            disabled={true}
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          取消
                        </Button>
                        <Button onClick={handleSave}>
                          保存更改
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 活动记录页面 */}
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>活动记录</CardTitle>
                    <CardDescription>查看您的所有操作历史</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                            <activity.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
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

      {/* 上传文档对话框 */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>上传文档</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">上传文档到个人工作台</h3>
              <p className="mt-2 text-muted-foreground">拖拽文件到此处，或点击浏览</p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                选择文件
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 分享文档对话框 */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>分享文档</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDocument && (
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">{selectedDocument.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedDocument.type} • {selectedDocument.size}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>分享链接</Label>
              <div className="flex space-x-2">
                <Input value="https://platform.dongfang.com/share/abc123" readOnly />
                <Button variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>权限设置</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择权限" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">仅查看</SelectItem>
                  <SelectItem value="comment">查看和评论</SelectItem>
                  <SelectItem value="edit">编辑权限</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                取消
              </Button>
              <Button onClick={() => setShowShareDialog(false)}>
                分享
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}