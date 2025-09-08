"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Folder, FileText, ChevronDown, Workflow, Settings } from "lucide-react"

export default function RolePermissionPage() {
  const router = useRouter()
  const params = useParams()
  const roleId = params.id

  const [editingRole, setEditingRole] = useState<any>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([])

  // 权限配置数据结构
  const [rolePermissions, setRolePermissions] = useState({
    department: "",
    documentGroups: [] as string[],
    // 多级目录权限
    documentPermissions: {
      categories: [] as string[], // 选中的一级分类
      subcategories: [] as string[], // 选中的二级分类
      files: [] as string[], // 选中的具体文件类型
      // 统一操作权限配置
      operationPermissions: {
        addDocument: false, // 添加文档
        deleteDocument: false, // 删除文档
        moveDocument: false, // 移动文档
        editParsedDocument: false, // 编辑解析后的文档
        viewDocument: false, // 查看文档
        downloadDocument: false // 下载文档
      }
    },
    // 流程节点操作权限
    workflowPermissions: {
      documentParseReview: false, // 文档解析审核节点
      documentImportReview: false // 文档导入审核节点
    },
    // 文档管理权限 - 按文档类型分配
    documentManagement: {
      managementStandards: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      },
      qualityStandards: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      },
      steelStructure: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      },
      safetyStandards: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      },
      technicalSpecs: {
        canView: false,
        canEdit: false,
        canParse: false,
        canReview: false,
        canAdd: false,
        canDelete: false,
        canCreateFolder: false,
        allowedDepartments: [] as string[]
      }
    },
    // 专家权限
    expertPermissions: {
      knowledgeGraphReview: false,
      qaAnswerReview: false,
      applicableDepartments: [] as string[]
    },
    // 知识图谱权限
    knowledgeGraphPermissions: {
      canView: false,
      canAdjust: false,
      canCustomize: false,
      canAdjustRules: false
    },
    // 系统管理权限
    systemManagement: {
      permissionManagement: false,
      userAccountManagement: false,
      createAccount: false,
      deleteAccount: false,
      editAccount: false
    },
    // 其他权限
    otherPermissions: {
      fileComparison: false,
      knowledgeSearch: false,
      workflowProcessing: false,
      systemSettings: false,
    }
  })

  // 文档分类数据
  const documentCategories = [
    {
      id: "technical",
      name: "技术文档",
      children: [
        { id: "standards", name: "技术标准", children: ["国家标准", "行业标准", "企业标准"] },
        { id: "specifications", name: "技术规范", children: ["设计规范", "施工规范", "验收规范"] },
        { id: "manuals", name: "技术手册", children: ["操作手册", "维护手册", "故障手册"] }
      ]
    },
    {
      id: "management",
      name: "管理文档",
      children: [
        { id: "policies", name: "政策文件", children: ["公司政策", "部门制度", "工作流程"] },
        { id: "procedures", name: "程序文件", children: ["管理程序", "工作程序", "应急程序"] },
        { id: "records", name: "记录文件", children: ["会议记录", "检查记录", "培训记录"] }
      ]
    },
    {
      id: "safety",
      name: "安全文档",
      children: [
        { id: "safety-standards", name: "安全标准", children: ["安全规范", "防护标准", "应急标准"] },
        { id: "safety-procedures", name: "安全程序", children: ["安全检查", "安全培训", "事故处理"] },
        { id: "safety-records", name: "安全记录", children: ["安全检查记录", "事故报告", "培训记录"] }
      ]
    }
  ]

  // 页面加载时从localStorage获取角色信息
  useEffect(() => {
    const savedRole = localStorage.getItem('editingRole')
    if (savedRole) {
      setEditingRole(JSON.parse(savedRole))
    }
  }, [])

  // 切换分类展开状态
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // 切换子分类展开状态
  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev => 
      prev.includes(subcategoryId) 
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    )
  }

  // 保存权限配置
  const handleSavePermissions = () => {
    console.log("保存权限配置:", rolePermissions)
    // 这里可以添加保存到后端的逻辑
    alert("权限配置已保存")
  }

  // 返回权限管理页面的角色管理标签
  const handleBack = () => {
    // 设置localStorage中的标签页状态为角色管理
    localStorage.setItem('permissionsActiveTab', 'role-management')
    // 使用URL参数确保跳转到角色管理标签
    router.push('/permissions?tab=role-management')
  }

  if (!editingRole) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">加载中...</h2>
                <p className="text-muted-foreground">正在加载角色信息</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="角色权限配置" subtitle={`配置角色：${editingRole.name}`} />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回
                </Button>
              </div>
            </div>

            {/* 文档分组权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  文档分组权限
                </CardTitle>
                <CardDescription>配置角色对多级文档目录的操作权限</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 统一操作权限配置 */}
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">文档操作权限配置</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="add-document"
                          className="border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          checked={rolePermissions.documentPermissions.operationPermissions.addDocument}
                          onCheckedChange={(checked) => {
                            setRolePermissions(prev => ({
                              ...prev,
                              documentPermissions: {
                                ...prev.documentPermissions,
                                operationPermissions: {
                                  ...prev.documentPermissions.operationPermissions,
                                  addDocument: checked as boolean
                                }
                              }
                            }))
                          }}
                        />
                        <Label htmlFor="add-document" className="text-sm">添加文档</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="delete-document"
                          className="border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          checked={rolePermissions.documentPermissions.operationPermissions.deleteDocument}
                          onCheckedChange={(checked) => {
                            setRolePermissions(prev => ({
                              ...prev,
                              documentPermissions: {
                                ...prev.documentPermissions,
                                operationPermissions: {
                                  ...prev.documentPermissions.operationPermissions,
                                  deleteDocument: checked as boolean
                                }
                              }
                            }))
                          }}
                        />
                        <Label htmlFor="delete-document" className="text-sm">删除文档</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="move-document"
                          className="border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          checked={rolePermissions.documentPermissions.operationPermissions.moveDocument}
                          onCheckedChange={(checked) => {
                            setRolePermissions(prev => ({
                              ...prev,
                              documentPermissions: {
                                ...prev.documentPermissions,
                                operationPermissions: {
                                  ...prev.documentPermissions.operationPermissions,
                                  moveDocument: checked as boolean
                                }
                              }
                            }))
                          }}
                        />
                        <Label htmlFor="move-document" className="text-sm">移动文档</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-parsed-document"
                          className="border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          checked={rolePermissions.documentPermissions.operationPermissions.editParsedDocument}
                          onCheckedChange={(checked) => {
                            setRolePermissions(prev => ({
                              ...prev,
                              documentPermissions: {
                                ...prev.documentPermissions,
                                operationPermissions: {
                                  ...prev.documentPermissions.operationPermissions,
                                  editParsedDocument: checked as boolean
                                }
                              }
                            }))
                          }}
                        />
                        <Label htmlFor="edit-parsed-document" className="text-sm">编辑解析文档</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="view-document"
                          className="border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          checked={rolePermissions.documentPermissions.operationPermissions.viewDocument}
                          onCheckedChange={(checked) => {
                            setRolePermissions(prev => ({
                              ...prev,
                              documentPermissions: {
                                ...prev.documentPermissions,
                                operationPermissions: {
                                  ...prev.documentPermissions.operationPermissions,
                                  viewDocument: checked as boolean
                                }
                              }
                            }))
                          }}
                        />
                        <Label htmlFor="view-document" className="text-sm">查看文档</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="download-document"
                          className="border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          checked={rolePermissions.documentPermissions.operationPermissions.downloadDocument}
                          onCheckedChange={(checked) => {
                            setRolePermissions(prev => ({
                              ...prev,
                              documentPermissions: {
                                ...prev.documentPermissions,
                                operationPermissions: {
                                  ...prev.documentPermissions.operationPermissions,
                                  downloadDocument: checked as boolean
                                }
                              }
                            }))
                          }}
                        />
                        <Label htmlFor="download-document" className="text-sm">下载文档</Label>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      此权限配置将应用于所有选中的文档分组
                    </div>
                  </div>

                  {/* 多级目录树 */}
                  <div className="space-y-2">
                    {documentCategories.map((category) => (
                      <div key={category.id} className="border rounded-lg">
                        {/* 一级分类 */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => toggleCategory(category.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                id={`category-${category.id}`}
                                checked={rolePermissions.documentPermissions.categories.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    const subcategories = category.children.map(sub => sub.id)
                                    const files = category.children.flatMap(sub => sub.children)
                                    setRolePermissions(prev => ({
                                      ...prev,
                                      documentPermissions: {
                                        ...prev.documentPermissions,
                                        categories: [...prev.documentPermissions.categories, category.id],
                                        subcategories: [...prev.documentPermissions.subcategories, ...subcategories],
                                        files: [...prev.documentPermissions.files, ...files]
                                      }
                                    }))
                                  } else {
                                    const subcategories = category.children.map(sub => sub.id)
                                    const files = category.children.flatMap(sub => sub.children)
                                    setRolePermissions(prev => ({
                                      ...prev,
                                      documentPermissions: {
                                        ...prev.documentPermissions,
                                        categories: prev.documentPermissions.categories.filter(c => c !== category.id),
                                        subcategories: prev.documentPermissions.subcategories.filter(s => !subcategories.includes(s)),
                                        files: prev.documentPermissions.files.filter(f => !files.includes(f))
                                      }
                                    }))
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex items-center gap-2">
                                <ChevronDown 
                                  className={`h-4 w-4 transition-transform ${
                                    expandedCategories.includes(category.id) ? 'rotate-0' : '-rotate-90'
                                  }`}
                                />
                                <Folder className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-lg">{category.name}</span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {category.children.length} 个二级分类
                            </div>
                          </div>
                        </div>


                        {/* 二级分类 - 可折叠 */}
                        {expandedCategories.includes(category.id) && (
                          <div className="border-t bg-muted/10">
                            {category.children.map((subcategory) => (
                              <div key={subcategory.id} className="border-b last:border-b-0">
                                <div 
                                  className="p-3 ml-4 cursor-pointer hover:bg-muted/20 transition-colors"
                                  onClick={() => toggleSubcategory(subcategory.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Checkbox 
                                        id={`subcategory-${subcategory.id}`}
                                        checked={rolePermissions.documentPermissions.subcategories.includes(subcategory.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setRolePermissions(prev => ({
                                              ...prev,
                                              documentPermissions: {
                                                ...prev.documentPermissions,
                                                subcategories: [...prev.documentPermissions.subcategories, subcategory.id],
                                                files: [...prev.documentPermissions.files, ...subcategory.children]
                                              }
                                            }))
                                          } else {
                                            setRolePermissions(prev => ({
                                              ...prev,
                                              documentPermissions: {
                                                ...prev.documentPermissions,
                                                subcategories: prev.documentPermissions.subcategories.filter(s => s !== subcategory.id),
                                                files: prev.documentPermissions.files.filter(f => !subcategory.children.includes(f))
                                              }
                                            }))
                                          }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <div className="flex items-center gap-2">
                                        <ChevronDown 
                                          className={`h-3 w-3 transition-transform ${
                                            expandedSubcategories.includes(subcategory.id) ? 'rotate-0' : '-rotate-90'
                                          }`}
                                        />
                                        <Folder className="h-4 w-4 text-green-600" />
                                        <span className="font-medium">{subcategory.name}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {subcategory.children.length} 个文件类型
                                    </div>
                                  </div>
                                </div>


                                {/* 三级文件类型 - 可折叠 */}
                                {expandedSubcategories.includes(subcategory.id) && (
                                  <div className="bg-muted/5 p-2 ml-8">
                                    <div className="space-y-1">
                                      {subcategory.children.map((file) => (
                                        <div key={file} className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded transition-colors">
                                          <Checkbox 
                                            id={`file-${file}`}
                                            checked={rolePermissions.documentPermissions.files.includes(file)}
                                            onCheckedChange={(checked) => {
                                              if (checked) {
                                                setRolePermissions(prev => ({
                                                  ...prev,
                                                  documentPermissions: {
                                                    ...prev.documentPermissions,
                                                    files: [...prev.documentPermissions.files, file]
                                                  }
                                                }))
                                              } else {
                                                setRolePermissions(prev => ({
                                                  ...prev,
                                                  documentPermissions: {
                                                    ...prev.documentPermissions,
                                                    files: prev.documentPermissions.files.filter(f => f !== file)
                                                  }
                                                }))
                                              }
                                            }}
                                          />
                                          <FileText className="h-3 w-3 text-muted-foreground" />
                                          <span className="text-sm text-muted-foreground">{file}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* 流程节点操作权限 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  流程节点操作权限
                </CardTitle>
                <CardDescription>配置角色对各个流程节点的操作权限</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="document-parse-review"
                      checked={rolePermissions.workflowPermissions.documentParseReview}
                      onCheckedChange={(checked) => {
                        setRolePermissions(prev => ({
                          ...prev,
                          workflowPermissions: {
                            ...prev.workflowPermissions,
                            documentParseReview: checked as boolean
                          }
                        }))
                      }}
                    />
                    <Label htmlFor="document-parse-review" className="text-sm">文档解析审核节点</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="document-import-review"
                      checked={rolePermissions.workflowPermissions.documentImportReview}
                      onCheckedChange={(checked) => {
                        setRolePermissions(prev => ({
                          ...prev,
                          workflowPermissions: {
                            ...prev.workflowPermissions,
                            documentImportReview: checked as boolean
                          }
                        }))
                      }}
                    />
                    <Label htmlFor="document-import-review" className="text-sm">文档导入审核节点</Label>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* 保存配置按钮 */}
            <div className="flex justify-end mt-6">
              <Button onClick={handleSavePermissions} size="lg">
                <Save className="h-4 w-4 mr-2" />
                保存配置
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
