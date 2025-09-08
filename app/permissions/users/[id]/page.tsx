"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Users,
  User,
  Plus,
  Search,
  Edit,
  X,
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export default function UserManagementPage() {
  const router = useRouter()
  const params = useParams()
  const roleId = params.id

  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [roleCurrentPage, setRoleCurrentPage] = useState(1)
  const [usersPerPage] = useState(5)
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)
  const [userToMove, setUserToMove] = useState<any>(null)
  const [targetRoleId, setTargetRoleId] = useState("")
  const [availableUsers, setAvailableUsers] = useState([
    { id: 1, name: "张三", email: "zhangsan@example.com", department: "技术部门" },
    { id: 2, name: "李四", email: "lisi@example.com", department: "质量部门" },
    { id: 3, name: "王五", email: "wangwu@example.com", department: "安全部门" },
    { id: 4, name: "赵六", email: "zhaoliu@example.com", department: "技术部门" },
    { id: 5, name: "钱七", email: "qianqi@example.com", department: "质量部门" },
    { id: 6, name: "孙八", email: "sunba@example.com", department: "技术部门" },
    { id: 7, name: "周九", email: "zhoujiu@example.com", department: "质量部门" },
    { id: 8, name: "吴十", email: "wushi@example.com", department: "安全部门" },
    { id: 9, name: "郑十一", email: "zhengshiyi@example.com", department: "技术部门" },
    { id: 10, name: "王十二", email: "wangshier@example.com", department: "质量部门" },
    { id: 11, name: "冯十三", email: "fengshisan@example.com", department: "安全部门" },
    { id: 12, name: "陈十四", email: "chenshisi@example.com", department: "技术部门" }
  ])

  // 其他角色数据
  const otherRoles = [
    { id: "admin", name: "管理员" },
    { id: "editor", name: "编辑者" },
    { id: "viewer", name: "查看者" },
    { id: "guest", name: "访客" }
  ].filter(role => role.id !== selectedRole?.id)

  useEffect(() => {
    // 从localStorage获取角色信息
    const roleData = localStorage.getItem('selectedRoleForUserManagement')
    if (roleData) {
      setSelectedRole(JSON.parse(roleData))
    }
  }, [])

  // 搜索时重置到第一页
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleAddUser = (user: any) => {
    if (selectedRole) {
      const updatedRole = {
        ...selectedRole,
        users: [...(selectedRole.users || []), user]
      }
      setSelectedRole(updatedRole)
      // 从可用用户列表中移除
      setAvailableUsers(prev => prev.filter(u => u.id !== user.id))
    }
  }

  const handleRemoveUser = (userId: number) => {
    if (selectedRole) {
      const userToRemove = selectedRole.users.find((u: any) => u.id === userId)
      const updatedRole = {
        ...selectedRole,
        users: selectedRole.users.filter((u: any) => u.id !== userId)
      }
      setSelectedRole(updatedRole)
      // 将用户添加回可用用户列表
      if (userToRemove) {
        setAvailableUsers(prev => [...prev, userToRemove])
      }
    }
  }

  const handleMoveUser = (user: any) => {
    setUserToMove(user)
    setTargetRoleId("")
    setMoveDialogOpen(true)
  }

  const confirmMoveUser = () => {
    if (userToMove && targetRoleId) {
      // 从当前角色移除用户
      const updatedRole = {
        ...selectedRole,
        users: selectedRole.users.filter((u: any) => u.id !== userToMove.id)
      }
      setSelectedRole(updatedRole)
      
      // 关闭弹窗并重置状态
      setMoveDialogOpen(false)
      setUserToMove(null)
      setTargetRoleId("")
      
      console.log(`用户 ${userToMove.name} 已移动到角色 ${targetRoleId}`)
    }
  }


  const filteredAvailableUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 分页计算
  const totalPages = Math.ceil(filteredAvailableUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredAvailableUsers.slice(startIndex, endIndex)

  // 当前角色成员分页
  const roleUsers = selectedRole?.users || []
  const roleTotalPages = Math.ceil(roleUsers.length / usersPerPage)
  const roleStartIndex = (roleCurrentPage - 1) * usersPerPage
  const roleEndIndex = roleStartIndex + usersPerPage
  const currentRoleUsers = roleUsers.slice(roleStartIndex, roleEndIndex)

  if (!selectedRole) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">加载中...</h2>
            <p className="text-muted-foreground">正在加载角色信息</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={`管理用户 - ${selectedRole.name}`} 
          subtitle={`管理 ${selectedRole.name} 角色的用户成员`} 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* 返回按钮 */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/permissions?tab=role-management')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回权限管理</span>
              </Button>
              <div className="flex-1" />
            </div>

            {/* 当前成员 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  当前成员 ({selectedRole.users?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentRoleUsers.map((user: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email} - {user.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMoveUser(user)}
                        >
                          <Users className="mr-1 h-3 w-3" />
                          移动
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          <X className="mr-1 h-3 w-3" />
                          移除
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {(!selectedRole.users || selectedRole.users.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无成员
                    </div>
                  )}
                </div>
                
                {/* 当前成员分页 */}
                {roleTotalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      显示第 {roleStartIndex + 1} - {Math.min(roleEndIndex, roleUsers.length)} 条，共 {roleUsers.length} 条成员
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={roleCurrentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        上一页
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: roleTotalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={roleCurrentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setRoleCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleCurrentPage(prev => Math.min(prev + 1, roleTotalPages))}
                        disabled={roleCurrentPage === roleTotalPages}
                      >
                        下一页
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 添加用户 */}
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="搜索用户..." 
                      className="flex-1"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button>
                      <Search className="mr-2 h-4 w-4" />
                      搜索
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {currentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email} - {user.department}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleAddUser(user)}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          添加
                        </Button>
                      </div>
                    ))}
                    
                    {currentUsers.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        没有找到匹配的用户
                      </div>
                    )}
                  </div>
                  
                  {/* 可添加用户分页 */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        显示第 {startIndex + 1} - {Math.min(endIndex, filteredAvailableUsers.length)} 条，共 {filteredAvailableUsers.length} 条结果
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          上一页
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          下一页
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 移动用户对话框 */}
            <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>移动用户到其他角色</DialogTitle>
                  <DialogDescription>
                    将用户 {userToMove?.name} 移动到其他角色组中
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">选择目标角色</label>
                    <Select value={targetRoleId} onValueChange={setTargetRoleId}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        {otherRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setMoveDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={confirmMoveUser}
                    disabled={!targetRoleId}
                  >
                    确认移动
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
}
