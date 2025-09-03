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
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "张三",
    email: "zhang.san@dongfang.com",
    phone: "+86 138 0013 8000",
    department: "锅炉事业部",
    position: "高级工程师",
    location: "北京市朝阳区",
    joinDate: "2020-03-15",
    avatar: "",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const activities = [
    {
      id: 1,
      type: "document",
      title: "上传了新文档",
      description: "锅炉安全手册 v2.1.pdf",
      time: "2小时前",
      icon: FileText,
    },
    {
      id: 2,
      type: "question",
      title: "提出了问题",
      description: "关于温度控制系统的技术问题",
      time: "1天前",
      icon: MessageSquare,
    },
    {
      id: 3,
      type: "rating",
      title: "评价了文档",
      description: "为《维护手册》打了5星评价",
      time: "2天前",
      icon: Star,
    },
  ]

  const stats = [
    { label: "文档贡献", value: "47", description: "上传文档数量" },
    { label: "问题解决", value: "23", description: "回答问题数量" },
    { label: "知识评分", value: "4.8", description: "平均评分" },
    { label: "活跃度", value: "92%", description: "本月活跃度" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="个人中心" subtitle="管理个人信息和查看活动记录" />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">个人信息</TabsTrigger>
                <TabsTrigger value="activity">活动记录</TabsTrigger>
                <TabsTrigger value="stats">统计信息</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <Card className="lg:col-span-1">
                    <CardHeader className="text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="text-lg">
                            {profile.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">{profile.name}</h3>
                          <p className="text-sm text-muted-foreground">{profile.position}</p>
                          <Badge variant="secondary" className="mt-2">
                            {profile.department}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Button
                          variant={isEditing ? "default" : "outline"}
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
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          更换头像
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Profile Details */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="font-serif">基本信息</CardTitle>
                      <CardDescription>完善个人信息，有助于更好地使用系统</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">姓名</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">邮箱</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">电话</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">部门</Label>
                          <Input
                            id="department"
                            value={profile.department}
                            onChange={(e) => setProfile({...profile, department: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">职位</Label>
                          <Input
                            id="position"
                            value={profile.position}
                            onChange={(e) => setProfile({...profile, position: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">办公地点</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex justify-end space-x-4">
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
                </div>

                {/* Account Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">账户信息</CardTitle>
                    <CardDescription>账户状态和系统权限</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">入职时间</p>
                          <p className="text-sm text-muted-foreground">{profile.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">账户状态</p>
                          <Badge variant="default">活跃</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">用户角色</p>
                          <p className="text-sm text-muted-foreground">管理员</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">最近活动</CardTitle>
                    <CardDescription>您在系统中的最新操作记录</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="p-2 bg-muted rounded-lg">
                            <activity.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                        {stat.label === "活跃度" && (
                          <Progress value={92} className="mt-3 h-2" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">贡献统计</CardTitle>
                    <CardDescription>详细的贡献数据分析</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">文档质量评分</span>
                        <span className="text-sm text-muted-foreground">4.8/5.0</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">回答准确率</span>
                        <span className="text-sm text-muted-foreground">89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">系统使用频率</span>
                        <span className="text-sm text-muted-foreground">高</span>
                      </div>
                      <Progress value={85} className="h-2" />
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
