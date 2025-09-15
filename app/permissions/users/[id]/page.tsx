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
  ChevronDown,
  UserPlus,
} from "lucide-react"

export default function UserManagementPage() {
  const router = useRouter()
  const params = useParams()
  const roleId = params.id

  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)
  const [userToMove, setUserToMove] = useState<any>(null)
  const [targetRoleId, setTargetRoleId] = useState("")
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set())
  const [expandedAvailableDepartments, setExpandedAvailableDepartments] = useState<Set<string>>(new Set())
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set())
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set())
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set())
  const [selectedAvailableDepartments, setSelectedAvailableDepartments] = useState<Set<string>>(new Set())
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

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  const handleBatchAddUsers = () => {
    if (selectedUsers.size === 0) {
      alert("请选择要添加的用户")
      return
    }

    const usersToAdd = availableUsers.filter(user => selectedUsers.has(user.id))
    if (selectedRole) {
      const updatedRole = {
        ...selectedRole,
        users: [...(selectedRole.users || []), ...usersToAdd]
      }
      setSelectedRole(updatedRole)
      // 从可用用户列表中移除
      setAvailableUsers(prev => prev.filter(u => !selectedUsers.has(u.id)))
      // 清空选择
      setSelectedUsers(new Set())
      setSelectedAvailableDepartments(new Set())
      alert(`成功添加 ${usersToAdd.length} 个用户`)
    }
  }

  const handleSelectAll = () => {
    const currentUsers = availableUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (selectedUsers.size === currentUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(currentUsers.map(user => user.id)))
    }
  }

  const handleSelectMember = (memberId: number) => {
    setSelectedMembers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(memberId)) {
        newSet.delete(memberId)
      } else {
        newSet.add(memberId)
      }
      return newSet
    })
  }

  const handleBatchDeleteMembers = () => {
    if (selectedMembers.size === 0) {
      alert("请选择要删除的成员")
      return
    }

    if (selectedRole) {
      const updatedRole = {
        ...selectedRole,
        users: selectedRole.users.filter((user: any) => !selectedMembers.has(user.id))
      }
      setSelectedRole(updatedRole)
      // 将删除的用户重新添加到可用用户列表
      const membersToRestore = selectedRole.users.filter((user: any) => selectedMembers.has(user.id))
      setAvailableUsers(prev => [...prev, ...membersToRestore])
      // 清空选择
      setSelectedMembers(new Set())
      setSelectedDepartments(new Set())
      alert(`成功删除 ${selectedMembers.size} 个成员`)
    }
  }

  const handleSelectAllMembers = () => {
    // 基于当前搜索过滤的用户进行全选
    const filteredUsers = currentRoleUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (selectedMembers.size === filteredUsers.length) {
      setSelectedMembers(new Set())
    } else {
      setSelectedMembers(new Set(filteredUsers.map((user: any) => user.id)))
    }
  }

  // 处理分组选中
  const handleSelectDepartment = (department: string, users: any[]) => {
    const departmentUserIds = users.map(user => user.id)
    const isSelected = selectedDepartments.has(department)
    
    if (isSelected) {
      // 取消选中分组，移除该分组所有成员
      setSelectedDepartments(prev => {
        const newSet = new Set(prev)
        newSet.delete(department)
        return newSet
      })
      setSelectedMembers(prev => {
        const newSet = new Set(prev)
        departmentUserIds.forEach(id => newSet.delete(id))
        return newSet
      })
    } else {
      // 选中分组，添加该分组所有成员
      setSelectedDepartments(prev => new Set(prev).add(department))
      setSelectedMembers(prev => {
        const newSet = new Set(prev)
        departmentUserIds.forEach(id => newSet.add(id))
        return newSet
      })
    }
  }

  // 处理可用用户分组选中
  const handleSelectAvailableDepartment = (department: string, users: any[]) => {
    const departmentUserIds = users.map(user => user.id)
    const isSelected = selectedAvailableDepartments.has(department)
    
    if (isSelected) {
      // 取消选中分组，移除该分组所有成员
      setSelectedAvailableDepartments(prev => {
        const newSet = new Set(prev)
        newSet.delete(department)
        return newSet
      })
      setSelectedUsers(prev => {
        const newSet = new Set(prev)
        departmentUserIds.forEach(id => newSet.delete(id))
        return newSet
      })
    } else {
      // 选中分组，添加该分组所有成员
      setSelectedAvailableDepartments(prev => new Set(prev).add(department))
      setSelectedUsers(prev => {
        const newSet = new Set(prev)
        departmentUserIds.forEach(id => newSet.add(id))
        return newSet
      })
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

  const toggleDepartment = (department: string) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(department)) {
        newSet.delete(department)
      } else {
        newSet.add(department)
      }
      return newSet
    })
  }

  const toggleAvailableDepartment = (department: string) => {
    setExpandedAvailableDepartments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(department)) {
        newSet.delete(department)
      } else {
        newSet.add(department)
      }
      return newSet
    })
  }


  const filteredAvailableUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentUsers = filteredAvailableUsers
  const currentRoleUsers = selectedRole?.users || []

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
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title={`管理用户 - ${selectedRole.name}`} 
          subtitle={`管理 ${selectedRole.name} 角色的用户成员`} 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6 h-full flex flex-col">
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
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    当前成员 ({selectedRole.users?.length || 0})
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="搜索成员..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48"
                    />
                    <Button>
                      <Search className="mr-2 h-4 w-4" />
                      搜索
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllMembers}
                    >
                      <X className="mr-2 h-4 w-4" />
                      全选
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDeleteMembers}
                      disabled={selectedMembers.size === 0}
                    >
                      批量删除 ({selectedMembers.size})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
                  {(() => {
                    // 按部门分组当前成员，支持搜索
                    const filteredUsers = currentRoleUsers.filter(user => 
                      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.department.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    const usersByDepartment = filteredUsers.reduce((acc: any, user) => {
                      if (!acc[user.department]) {
                        acc[user.department] = []
                      }
                      acc[user.department].push(user)
                      return acc
                    }, {})

                    return Object.entries(usersByDepartment).map(([department, users]: [string, any]) => {
                      const isExpanded = expandedDepartments.has(department)
                      return (
                        <div key={department} className="space-y-2">
                          <div 
                            className="flex items-center space-x-2 py-2 border-b cursor-pointer hover:bg-muted/30 rounded px-2"
                            onClick={() => toggleDepartment(department)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedDepartments.has(department)}
                              onChange={(e) => {
                                e.stopPropagation()
                                handleSelectDepartment(department, users)
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                            />
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <h4 className="font-medium text-sm text-gray-700">{department}</h4>
                            <span className="text-xs text-muted-foreground">({users.length}人)</span>
                          </div>
                          {isExpanded && (
                            <div className="space-y-2 ml-6">
                              {users.map((user: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                  <div className="flex items-center space-x-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedMembers.has(user.id)}
                                      onChange={() => handleSelectMember(user.id)}
                                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{user.name}</p>
                                      <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  })()}
                  
                  {(!selectedRole.users || selectedRole.users.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无成员
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 添加用户 */}
            <Card className="flex-1 flex flex-col">
              <CardContent className="flex flex-col h-full">
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="搜索用户..." 
                        className="w-48"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button>
                        <Search className="mr-2 h-4 w-4" />
                        搜索
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        全选
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleBatchAddUsers}
                        disabled={selectedUsers.size === 0}
                      >
                        批量添加 ({selectedUsers.size})
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
                    {(() => {
                      // 按部门分组用户
                      const usersByDepartment = currentUsers.reduce((acc: any, user) => {
                        if (!acc[user.department]) {
                          acc[user.department] = []
                        }
                        acc[user.department].push(user)
                        return acc
                      }, {})

                      return Object.entries(usersByDepartment).map(([department, users]: [string, any]) => {
                        const isExpanded = expandedAvailableDepartments.has(department)
                        return (
                          <div key={department} className="space-y-2">
                            <div 
                              className="flex items-center space-x-2 py-2 border-b cursor-pointer hover:bg-muted/30 rounded px-2"
                              onClick={() => toggleAvailableDepartment(department)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedAvailableDepartments.has(department)}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  handleSelectAvailableDepartment(department, users)
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <ChevronDown 
                                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                              />
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <h4 className="font-medium text-sm text-gray-700">{department}</h4>
                              <span className="text-xs text-muted-foreground">({users.length}人)</span>
                            </div>
                            {isExpanded && (
                              <div className="space-y-1 ml-6">
                                {users.map((user: any) => (
                                  <div key={user.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/30">
                                    <div className="flex items-center space-x-3">
                                      <input
                                        type="checkbox"
                                        checked={selectedUsers.has(user.id)}
                                        onChange={() => handleSelectUser(user.id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="h-3 w-3 text-gray-600" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })
                    })()}
                    
                    {currentUsers.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        没有找到匹配的用户
                      </div>
                    )}
                  </div>
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
