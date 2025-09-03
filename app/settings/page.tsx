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
  Users,
  Shield,
  Activity,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react"

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "Zhang Wei",
    email: "zhang.wei@dongfang.com",
    role: "Administrator",
    department: "Safety Engineering",
    status: "active",
    lastLogin: "2024-01-15 09:30",
    permissions: ["read", "write", "admin", "delete"],
  },
  {
    id: 2,
    name: "Li Ming",
    email: "li.ming@dongfang.com",
    role: "Technical Lead",
    department: "Technical Documentation",
    status: "active",
    lastLogin: "2024-01-15 08:45",
    permissions: ["read", "write"],
  },
  {
    id: 3,
    name: "Wang Fang",
    email: "wang.fang@dongfang.com",
    role: "Reviewer",
    department: "Quality Control",
    status: "active",
    lastLogin: "2024-01-14 16:20",
    permissions: ["read", "review"],
  },
  {
    id: 4,
    name: "Chen Lu",
    email: "chen.lu@dongfang.com",
    role: "Viewer",
    department: "Maintenance",
    status: "inactive",
    lastLogin: "2024-01-10 14:15",
    permissions: ["read"],
  },
]

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

const getRoleColor = (role: string) => {
  switch (role) {
    case "Administrator":
      return "bg-red-100 text-red-800"
    case "Technical Lead":
      return "bg-blue-100 text-blue-800"
    case "Reviewer":
      return "bg-yellow-100 text-yellow-800"
    case "Viewer":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-gray-100 text-gray-800"
    case "suspended":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

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
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "Knowledge Platform",
    siteDescription: "Dongfang Electric Group Knowledge Management System",
    allowRegistration: false,
    requireEmailVerification: true,
    enableTwoFactor: true,
    sessionTimeout: "8",
    maxFileSize: "100",
    allowedFileTypes: "pdf,docx,xlsx,pptx,txt",
    enableAuditLog: true,
    logRetentionDays: "90",
    enableNotifications: true,
    emailNotifications: true,
    systemMaintenance: false,
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
        <Header title="System Settings" subtitle="Manage users, security, and system configuration" />

        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="system">System Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl">User Management</h3>
                  <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Users</CardTitle>
                      <CardDescription>Manage user accounts and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockUsers.map((user) => (
                          <div
                            key={user.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                              selectedUser?.id === user.id ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => setSelectedUser(user)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                              <span>{user.department}</span>
                              <span>Last login: {user.lastLogin}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* User Details */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">User Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedUser ? (
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                              <User className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <h4 className="font-medium">{selectedUser.name}</h4>
                            <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium">Role</Label>
                              <Select defaultValue={selectedUser.role}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Administrator">Administrator</SelectItem>
                                  <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                                  <SelectItem value="Reviewer">Reviewer</SelectItem>
                                  <SelectItem value="Viewer">Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-sm font-medium">Department</Label>
                              <Input value={selectedUser.department} className="mt-1" />
                            </div>

                            <div>
                              <Label className="text-sm font-medium">Status</Label>
                              <Select defaultValue={selectedUser.status}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-sm font-medium mb-2 block">Permissions</Label>
                              <div className="space-y-2">
                                {["read", "write", "review", "admin", "delete"].map((permission) => (
                                  <div key={permission} className="flex items-center space-x-2">
                                    <Switch checked={selectedUser.permissions.includes(permission)} id={permission} />
                                    <Label htmlFor={permission} className="text-sm capitalize">
                                      {permission}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                          <h4 className="mt-4 font-medium">Select a User</h4>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Choose a user from the list to view and edit their details
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl">System Settings</h3>
                <p className="text-muted-foreground">Configure general system settings and preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => handleSettingChange("siteName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea
                        id="siteDescription"
                        value={settings.siteDescription}
                        onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowRegistration">Allow User Registration</Label>
                      <Switch
                        id="allowRegistration"
                        checked={settings.allowRegistration}
                        onCheckedChange={(checked) => handleSettingChange("allowRegistration", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="systemMaintenance">Maintenance Mode</Label>
                      <Switch
                        id="systemMaintenance"
                        checked={settings.systemMaintenance}
                        onCheckedChange={(checked) => handleSettingChange("systemMaintenance", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">File Upload Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                      <Input
                        id="maxFileSize"
                        type="number"
                        value={settings.maxFileSize}
                        onChange={(e) => handleSettingChange("maxFileSize", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
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
                    <CardTitle className="font-serif">Session Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                      <Select
                        value={settings.sessionTimeout}
                        onValueChange={(value) => handleSettingChange("sessionTimeout", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="8">8 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableNotifications">Enable Notifications</Label>
                      <Switch
                        id="enableNotifications"
                        checked={settings.enableNotifications}
                        onCheckedChange={(checked) => handleSettingChange("enableNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
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
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl">Security Settings</h3>
                <p className="text-muted-foreground">Configure security policies and authentication settings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                      <Switch
                        id="requireEmailVerification"
                        checked={settings.requireEmailVerification}
                        onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
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
                    <CardTitle className="font-serif">Password Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
                      <Select defaultValue="8">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 characters</SelectItem>
                          <SelectItem value="8">8 characters</SelectItem>
                          <SelectItem value="12">12 characters</SelectItem>
                          <SelectItem value="16">16 characters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="requireUppercase" defaultChecked />
                        <Label htmlFor="requireUppercase">Require uppercase letters</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="requireNumbers" defaultChecked />
                        <Label htmlFor="requireNumbers">Require numbers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="requireSpecialChars" defaultChecked />
                        <Label htmlFor="requireSpecialChars">Require special characters</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Audit & Logging</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableAuditLog">Enable Audit Logging</Label>
                      <Switch
                        id="enableAuditLog"
                        checked={settings.enableAuditLog}
                        onCheckedChange={(checked) => handleSettingChange("enableAuditLog", checked)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="logRetentionDays">Log Retention (days)</Label>
                      <Select
                        value={settings.logRetentionDays}
                        onValueChange={(value) => handleSettingChange("logRetentionDays", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">API Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
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
                <h3 className="font-serif font-bold text-xl">Integrations</h3>
                <p className="text-muted-foreground">Manage external service integrations and API connections</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Email Service", status: "connected", description: "SMTP email delivery service" },
                  { name: "Cloud Storage", status: "connected", description: "Document storage and backup" },
                  { name: "Single Sign-On", status: "disconnected", description: "LDAP/Active Directory integration" },
                  { name: "Analytics", status: "connected", description: "Usage analytics and reporting" },
                  { name: "Backup Service", status: "connected", description: "Automated data backup" },
                  { name: "Monitoring", status: "disconnected", description: "System health monitoring" },
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
                          {integration.status === "connected" ? "Disconnect" : "Connect"}
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
                  <h3 className="font-serif font-bold text-xl">Audit Logs</h3>
                  <p className="text-muted-foreground">View system activity and user actions</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Timestamp</th>
                          <th className="text-left p-4 font-medium">User</th>
                          <th className="text-left p-4 font-medium">Action</th>
                          <th className="text-left p-4 font-medium">Resource</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">IP Address</th>
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
