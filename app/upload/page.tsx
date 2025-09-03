import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Clock,
  User,
  Tag
} from "lucide-react"

export default function UploadPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-3xl text-foreground">个人知识库（云文档）</h1>
          <p className="text-muted-foreground">为您提供个人专属的知识存储空间，基于云技术</p>
        </div>
        <Button variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          上传历史
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                文档上传
              </CardTitle>
              <CardDescription>选择文件并填写相关信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">拖拽文件到此处或点击选择</p>
                  <p className="text-sm text-muted-foreground">
                    支持 PDF、Word、Excel、PowerPoint 等格式，最大 50MB
                  </p>
                  <Button className="mt-4">
                    <FileText className="mr-2 h-4 w-4" />
                    选择文件
                  </Button>
                </div>
              </div>

              {/* File List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Boiler_Safety_Standards_2024.pdf</p>
                      <p className="text-sm text-muted-foreground">2.4 MB • PDF</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={100} className="w-20 h-2" />
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">Technical_Specifications.docx</p>
                      <p className="text-sm text-muted-foreground">1.8 MB • Word</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={75} className="w-20 h-2" />
                    <span className="text-sm text-muted-foreground">75%</span>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">文档标题</Label>
                    <Input id="title" placeholder="输入文档标题" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">文档分类</Label>
                    <Input id="category" placeholder="选择或输入分类" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">文档描述</Label>
                  <Textarea 
                    id="description" 
                    placeholder="简要描述文档内容和用途"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">作者</Label>
                    <Input id="author" placeholder="文档作者" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">版本</Label>
                    <Input id="version" placeholder="文档版本" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">发布日期</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">标签</Label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
                      锅炉安全
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
                      技术标准
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                    <Input 
                      placeholder="添加标签..." 
                      className="border-0 p-0 h-6 w-20 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permissions">访问权限</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="public" name="permissions" value="public" />
                      <Label htmlFor="public">公开</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="internal" name="permissions" value="internal" defaultChecked />
                      <Label htmlFor="internal">内部</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="restricted" name="permissions" value="restricted" />
                      <Label htmlFor="restricted">受限</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline">保存草稿</Button>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  上传文档
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upload Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">上传进度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">总进度</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">已上传</span>
                  <span className="text-sm font-medium">2/3 文件</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">最近上传</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Maintenance_Guide.pdf</p>
                  <p className="text-xs text-muted-foreground">2小时前</p>
                </div>
                <Badge variant="outline">已审核</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Quality_Report.xlsx</p>
                  <p className="text-xs text-muted-foreground">1天前</p>
                </div>
                <Badge variant="secondary">审核中</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <FileText className="h-8 w-8 text-orange-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Safety_Protocols.docx</p>
                  <p className="text-xs text-muted-foreground">3天前</p>
                </div>
                <Badge variant="destructive">需修改</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Upload Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">上传提示</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">文件格式</p>
                  <p className="text-xs text-muted-foreground">支持常见办公文档格式</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">文件大小</p>
                  <p className="text-xs text-muted-foreground">单个文件最大 50MB</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">审核流程</p>
                  <p className="text-xs text-muted-foreground">上传后需要审核才能发布</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <User className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">权限设置</p>
                  <p className="text-xs text-muted-foreground">可设置文档访问权限</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
