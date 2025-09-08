"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Shield,
  Activity,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react"



// Mock audit logs
const mockAuditLogs = [
  {
    id: 1,
    user: "Zhang Wei",
    action: "Document Upload",
    resource: "Boiler Safety Standards 2024.pdf",
    timestamp: "2024-01-15 14:30",
    status: "success",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    user: "Li Ming",
    action: "User Permission Update",
    resource: "Wang Fang",
    timestamp: "2024-01-15 13:45",
    status: "success",
    ip: "192.168.1.101",
  },
  {
    id: 3,
    user: "System",
    action: "Knowledge Graph Sync",
    resource: "Full Database",
    timestamp: "2024-01-15 12:00",
    status: "success",
    ip: "localhost",
  },
  {
    id: 4,
    user: "Chen Lu",
    action: "Failed Login Attempt",
    resource: "Login System",
    timestamp: "2024-01-15 11:30",
    status: "failed",
    ip: "192.168.1.105",
  },
]



const getActionIcon = (action: string) => {
  switch (action) {
    case "Document Upload":
      return <Upload className="h-4 w-4 text-blue-600" />
    case "User Permission Update":
      return <Shield className="h-4 w-4 text-yellow-600" />
    case "Knowledge Graph Sync":
      return <RefreshCw className="h-4 w-4 text-green-600" />
    case "Failed Login Attempt":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    default:
      return <Activity className="h-4 w-4 text-gray-600" />
  }
}

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "知识平台",
    siteDescription: "东方电气集团知识管理系统",
    requireEmailVerification: true,
    enableTwoFactor: true,
    sessionTimeout: "8",
    maxFileSize: "100",
    allowedFileTypes: "pdf,docx,xlsx,pptx,txt",
    enableAuditLog: true,
    logRetentionDays: "90",
    enableNotifications: true,
    emailNotifications: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log("Saving settings:", settings)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="系统设置" subtitle="管理安全和系统配置" />

        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="system" className="space-y-6">
            <TabsList>
              <TabsTrigger value="system">系统设置</TabsTrigger>
              <TabsTrigger value="security">安全设置</TabsTrigger>
              <TabsTrigger value="integrations">集成服务</TabsTrigger>
              <TabsTrigger value="audit">审计日志</TabsTrigger>
            </TabsList>



            <TabsContent value="system" className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl">系统设置</h3>
                <p className="text-muted-foreground">配置通用系统设置和首选项</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">常规设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="siteName">站点名称</Label>
                      <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => handleSettingChange("siteName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteDescription">站点描述</Label>
                      <Textarea
                        id="siteDescription"
                        value={settings.siteDescription}
                        onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">文件上传设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="maxFileSize">最大文件大小 (MB)</Label>
                      <Input
                        id="maxFileSize"
                        type="number"
                        value={settings.maxFileSize}
                        onChange={(e) => handleSettingChange("maxFileSize", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="allowedFileTypes">允许的文件类型</Label>
                      <Input
                        id="allowedFileTypes"
                        value={settings.allowedFileTypes}
                        onChange={(e) => handleSettingChange("allowedFileTypes", e.target.value)}
                        placeholder="pdf,docx,xlsx,pptx,txt"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">会话设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="sessionTimeout">会话超时 (小时)</Label>
                      <Select
                        value={settings.sessionTimeout}
                        onValueChange={(value) => handleSettingChange("sessionTimeout", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 小时</SelectItem>
                          <SelectItem value="4">4 小时</SelectItem>
                          <SelectItem value="8">8 小时</SelectItem>
                          <SelectItem value="24">24 小时</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">通知设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableNotifications">启用通知</Label>
                      <Switch
                        id="enableNotifications"
                        checked={settings.enableNotifications}
                        onCheckedChange={(checked) => handleSettingChange("enableNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">邮件通知</Label>
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">重置为默认</Button>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  保存设置
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl">安全设置</h3>
                <p className="text-muted-foreground">配置安全策略和身份验证设置</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">身份验证</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireEmailVerification">需要邮件验证</Label>
                      <Switch
                        id="requireEmailVerification"
                        checked={settings.requireEmailVerification}
                        onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableTwoFactor">启用双因素身份验证</Label>
                      <Switch
                        id="enableTwoFactor"
                        checked={settings.enableTwoFactor}
                        onCheckedChange={(checked) => handleSettingChange("enableTwoFactor", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">密码策略</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="minPasswordLength">最小密码长度</Label>
                      <Select defaultValue="8">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 个字符</SelectItem>
                          <SelectItem value="8">8 个字符</SelectItem>
                          <SelectItem value="12">12 个字符</SelectItem>
                          <SelectItem value="16">16 个字符</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="requireUppercase" defaultChecked />
                        <Label htmlFor="requireUppercase">需要大写字母</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="requireNumbers" defaultChecked />
                        <Label htmlFor="requireNumbers">需要数字</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="requireSpecialChars" defaultChecked />
                        <Label htmlFor="requireSpecialChars">需要特殊字符</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">审计和日志</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableAuditLog">启用审计日志</Label>
                      <Switch
                        id="enableAuditLog"
                        checked={settings.enableAuditLog}
                        onCheckedChange={(checked) => handleSettingChange("enableAuditLog", checked)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="logRetentionDays">日志保留 (天)</Label>
                      <Select
                        value={settings.logRetentionDays}
                        onValueChange={(value) => handleSettingChange("logRetentionDays", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 天</SelectItem>
                          <SelectItem value="90">90 天</SelectItem>
                          <SelectItem value="180">180 天</SelectItem>
                          <SelectItem value="365">1 年</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">API 安全</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">API 密钥</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="apiKey"
                          type={showPassword ? "text" : "password"}
                          value="sk-1234567890abcdef"
                          readOnly
                        />
                        <Button variant="outline" size="sm" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl">集成服务</h3>
                <p className="text-muted-foreground">管理外部服务集成和 API 连接</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "邮件服务", status: "connected", description: "SMTP 邮件投递服务" },
                  { name: "云存储", status: "connected", description: "文档存储和备份" },
                  { name: "单点登录", status: "disconnected", description: "LDAP/Active Directory 集成" },
                  { name: "分析服务", status: "connected", description: "使用分析和报告" },
                  { name: "备份服务", status: "connected", description: "自动数据备份" },
                  { name: "监控服务", status: "disconnected", description: "系统健康监控" },
                ].map((integration, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-serif">{integration.name}</CardTitle>
                        <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                          {integration.status}
                        </Badge>
                      </div>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Button
                          variant={integration.status === "connected" ? "destructive" : "default"}
                          size="sm"
                          className="flex-1"
                        >
                          {integration.status === "connected" ? "断开连接" : "连接"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl">审计日志</h3>
                  <p className="text-muted-foreground">查看系统活动和用户操作</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    导出日志
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    刷新
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">时间戳</th>
                          <th className="text-left p-4 font-medium">用户</th>
                          <th className="text-left p-4 font-medium">操作</th>
                          <th className="text-left p-4 font-medium">资源</th>
                          <th className="text-left p-4 font-medium">状态</th>
                          <th className="text-left p-4 font-medium">IP 地址</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAuditLogs.map((log) => (
                          <tr key={log.id} className="border-b hover:bg-muted/30">
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{log.timestamp}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{log.user}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {getActionIcon(log.action)}
                                <span className="text-sm">{log.action}</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm">{log.resource}</td>
                            <td className="p-4">
                              <Badge variant={log.status === "success" ? "default" : "destructive"}>{log.status}</Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{log.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
