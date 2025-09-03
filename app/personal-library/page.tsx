"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { 
  Cloud, 
  FileText, 
  Folder, 
  Plus,
  Search,
  Filter,
  Upload,
  Edit,
  Share,
  Heart,
  Trash2,
  Eye,
  Download,
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  HardDrive,
  Users,
  Star,
  Network,
  Settings,
  X,
  Check
} from "lucide-react"

export default function PersonalLibraryPage() {
  const [activeTab, setActiveTab] = useState("my-documents")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)

  // 模拟数据
  const storageInfo = {
    used: 300, // MB
    total: 500, // MB
    percentage: 60
  }

  const myDocuments = [
    {
      id: 1,
      title: "锅炉安全技术标准",
      type: "PDF",
      size: "2.4MB",
      uploadDate: "2024-01-15",
      lastModified: "2024-01-20",
      tags: ["安全", "技术标准"],
      isShared: false,
      sharedWith: []
    },
    {
      id: 2,
      title: "设备维护手册",
      type: "Word",
      size: "1.8MB",
      uploadDate: "2024-01-10",
      lastModified: "2024-01-18",
      tags: ["维护", "设备"],
      isShared: true,
      sharedWith: ["张三", "李四"]
    },
    {
      id: 3,
      title: "质量检测报告",
      type: "Excel",
      size: "0.9MB",
      uploadDate: "2024-01-12",
      lastModified: "2024-01-12",
      tags: ["质量", "检测"],
      isShared: false,
      sharedWith: []
    }
  ]

  const sharedDocuments = [
    {
      id: 4,
      title: "技术规范文档",
      type: "PDF",
      size: "3.2MB",
      sharedBy: "王五",
      shareDate: "2024-01-16",
      permission: "可编辑",
      tags: ["技术", "规范"]
    }
  ]

  const favoriteDocuments = [
    {
      id: 5,
      title: "重要技术资料",
      type: "PDF",
      size: "4.1MB",
      favoriteDate: "2024-01-14",
      tags: ["重要", "技术"]
    }
  ]

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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif font-bold text-3xl text-foreground">个人知识库（云文档）</h1>
              <p className="text-muted-foreground">您的个人专属知识存储空间，基于云技术</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                上传文档
              </Button>
              <Button variant="outline">
                <Network className="mr-2 h-4 w-4" />
                知识图谱
              </Button>
            </div>
          </div>

          {/* Storage Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <HardDrive className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">存储空间</p>
                    <p className="text-xs text-muted-foreground">
                      {storageInfo.used}MB / {storageInfo.total}MB
                    </p>
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

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索文档..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="word">Word</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">日期</SelectItem>
                <SelectItem value="name">名称</SelectItem>
                <SelectItem value="size">大小</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="my-documents">我的文档</TabsTrigger>
              <TabsTrigger value="shared">共享文档</TabsTrigger>
              <TabsTrigger value="favorites">收藏夹</TabsTrigger>
            </TabsList>

            <TabsContent value="my-documents" className="space-y-4">
              <div className="grid gap-4">
                {myDocuments.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>{doc.lastModified}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {doc.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {doc.isShared && (
                                <Badge variant="secondary" className="text-xs">
                                  <Users className="h-3 w-3 mr-1" />
                                  已分享
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleFavorite(doc.id)}>
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleShare(doc)}>
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shared" className="space-y-4">
              <div className="grid gap-4">
                {sharedDocuments.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>分享者: {doc.sharedBy}</span>
                              <span>•</span>
                              <span>{doc.shareDate}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {doc.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              <Badge variant="secondary" className="text-xs">
                                {doc.permission}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <div className="grid gap-4">
                {favoriteDocuments.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Star className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>收藏于 {doc.favoriteDate}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {doc.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>上传文档</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">拖拽文件到此处或点击选择</p>
              <p className="text-sm text-muted-foreground mb-4">
                支持 PDF、Word、Excel、PowerPoint 等格式，最大 50MB
              </p>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                选择文件
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">文档标题</label>
                <Input placeholder="输入文档标题" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">文档描述</label>
                <Textarea placeholder="简要描述文档内容" rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">标签</label>
                <Input placeholder="输入标签，用逗号分隔" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                取消
              </Button>
              <Button onClick={() => setShowUploadDialog(false)}>
                上传
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>分享文档</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">选择用户</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="搜索用户..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">张三 (zhangsan@dongfang.com)</SelectItem>
                  <SelectItem value="user2">李四 (lisi@dongfang.com)</SelectItem>
                  <SelectItem value="user3">王五 (wangwu@dongfang.com)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">权限设置</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="view" name="permission" value="view" defaultChecked />
                  <label htmlFor="view">仅查看</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="edit" name="permission" value="edit" />
                  <label htmlFor="edit">可编辑</label>
                </div>
              </div>
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