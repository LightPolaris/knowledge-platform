"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Filter,
  MoreHorizontal,
  Clock,
  User,
} from "lucide-react"

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: "新文档已上传",
    message: "张伟上传了新的安全标准文档，请及时审核",
    type: "info",
    time: "2分钟前",
    read: false,
    sender: "张伟",
  },
  {
    id: 2,
    title: "系统维护通知",
    message: "系统将于今晚22:00-24:00进行维护，请提前保存工作",
    type: "warning",
    time: "1小时前",
    read: false,
    sender: "系统管理员",
  },
  {
    id: 3,
    title: "权限变更",
    message: "您的文档管理权限已更新，现在可以访问更多功能",
    type: "success",
    time: "3小时前",
    read: true,
    sender: "管理员",
  },
  {
    id: 4,
    title: "文档审核完成",
    message: "您提交的《锅炉安全标准》文档已通过审核",
    type: "success",
    time: "1天前",
    read: true,
    sender: "审核员",
  },
  {
    id: 5,
    title: "新用户加入",
    message: "李明已加入您的团队，可以开始协作",
    type: "info",
    time: "2天前",
    read: true,
    sender: "系统",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "warning":
      return <AlertCircle className="h-5 w-5 text-yellow-600" />
    case "info":
      return <Info className="h-5 w-5 text-blue-600" />
    default:
      return <Bell className="h-5 w-5 text-gray-600" />
  }
}

export default function NotificationsPage() {
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [filter, setFilter] = useState("all")

  const filteredNotifications = mockNotifications.filter((notification) => {
    if (filter === "unread") return !notification.read
    if (filter === "read") return notification.read
    return true
  })

  const unreadCount = mockNotifications.filter(n => !n.read).length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    } else {
      setSelectedNotifications([])
    }
  }

  const handleSelectNotification = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedNotifications([...selectedNotifications, id])
    } else {
      setSelectedNotifications(selectedNotifications.filter(n => n !== id))
    }
  }

  const handleMarkAsRead = (id: number) => {
    // In a real app, this would update the notification status
    console.log(`Mark notification ${id} as read`)
  }

  const handleDeleteNotification = (id: number) => {
    // In a real app, this would delete the notification
    console.log(`Delete notification ${id}`)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="通知中心" subtitle={`您有 ${unreadCount} 条未读通知`} />
        
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList>
              <TabsTrigger value="notifications">所有通知</TabsTrigger>
              <TabsTrigger value="settings">通知设置</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-serif">通知列表</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        共 {mockNotifications.length} 条通知，{unreadCount} 条未读
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedNotifications.length > 0 && (
                        <Button variant="outline" size="sm">
                          批量标记为已读
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filter Tabs */}
                  <div className="flex items-center space-x-4 mb-6">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                    >
                      全部 ({mockNotifications.length})
                    </Button>
                    <Button
                      variant={filter === "unread" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("unread")}
                    >
                      未读 ({unreadCount})
                    </Button>
                    <Button
                      variant={filter === "read" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("read")}
                    >
                      已读 ({mockNotifications.length - unreadCount})
                    </Button>
                  </div>

                  {/* Notifications List */}
                  <div className="space-y-3">
                    {filteredNotifications.length > 0 && (
                      <div className="flex items-center space-x-2 p-2 border-b">
                        <Checkbox
                          checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm text-muted-foreground">全选</span>
                      </div>
                    )}

                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                          !notification.read ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <Checkbox
                          checked={selectedNotifications.includes(notification.id)}
                          onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getNotificationIcon(notification.type)}
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="destructive" className="text-xs">
                                  新
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{notification.sender}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredNotifications.length === 0 && (
                      <div className="text-center py-12">
                        <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">暂无通知</h3>
                        <p className="mt-2 text-muted-foreground">
                          {filter === "unread" ? "没有未读通知" : "没有已读通知"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">通知设置</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">通知类型</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">文档审核通知</p>
                            <p className="text-xs text-muted-foreground">当有文档需要审核时通知</p>
                          </div>
                          <Checkbox defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">系统维护通知</p>
                            <p className="text-xs text-muted-foreground">系统维护和更新通知</p>
                          </div>
                          <Checkbox defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">权限变更通知</p>
                            <p className="text-xs text-muted-foreground">权限和角色变更通知</p>
                          </div>
                          <Checkbox defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">通知方式</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">站内通知</p>
                            <p className="text-xs text-muted-foreground">在系统内显示通知</p>
                          </div>
                          <Checkbox defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">邮件通知</p>
                            <p className="text-xs text-muted-foreground">发送邮件通知</p>
                          </div>
                          <Checkbox />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button>保存设置</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
