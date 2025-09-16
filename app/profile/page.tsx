"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { useRouter } from "next/navigation"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
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
  Heart,
  Trash2,
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
  FolderOpen,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PersonalWorkspacePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showPdfParserDialog, setShowPdfParserDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [parsingProgress, setParsingProgress] = useState(0)
  const [isParsing, setIsParsing] = useState(false)
  const [parsedContent, setParsedContent] = useState("")
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showCategorySelect, setShowCategorySelect] = useState(false)
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedParentFolder, setSelectedParentFolder] = useState("")
  const [createFolderCascadeSelection, setCreateFolderCascadeSelection] = useState({ level1: "", level2: "", level3: "" })
  // 文档筛选
  const [filterCategory, setFilterCategory] = useState<string>("ALL")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [filterCascadeSelection, setFilterCascadeSelection] = useState({ level1: "", level2: "", level3: "" })

  // 级联选择状态 - 最多支持3级
  const [cascadeSelection, setCascadeSelection] = useState({
    level1: "", // 一级分类
    level2: "", // 二级分类
    level3: ""  // 三级分类（如果有）
  })

  // 批量选择
  const [selectedDocIds, setSelectedDocIds] = useState<Set<number>>(new Set())
  const [dataVersion, setDataVersion] = useState(0) // 触发重渲染用
  // 批量分组弹窗
  const [showBatchGroupDialog, setShowBatchGroupDialog] = useState(false)
  const [selectedBatchFolder, setSelectedBatchFolder] = useState("")
  const [batchCascadeSelection, setBatchCascadeSelection] = useState({ level1: "", level2: "", level3: "" })
  // 批量解析/导入/删除弹窗
  const [showBatchParseDialog, setShowBatchParseDialog] = useState(false)
  const [showBatchImportDialog, setShowBatchImportDialog] = useState(false)
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false)

  const isSelected = (id: number) => selectedDocIds.has(id)
  const toggleSelect = (id: number, checked: boolean) => {
    setSelectedDocIds(prev => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }
  const clearSelection = () => setSelectedDocIds(new Set())

  const handleSelectAll = (allIds: number[], checked: boolean) => {
    setSelectedDocIds(() => {
      if (!checked) return new Set()
      return new Set(allIds)
    })
  }

  // 遍历树执行操作
  const mutateDocsInTree = (predicate: (doc: any) => boolean, mutation: (doc: any) => void) => {
    const walk = (items: any[]) => {
      items.forEach((item) => {
        if (item.type === 'file') {
          if (predicate(item)) mutation(item)
        } else if (item.children) {
          walk(item.children)
        }
      })
    }
    walk(categoryTree)
  }

  const removeDocsFromTree = (ids: Set<number>) => {
    const filterWalk = (items: any[]): any[] => {
      return items
        .filter((item) => !(item.type === 'file' && ids.has(item.id)))
        .map((item) => {
          if (item.children) {
            item.children = filterWalk(item.children)
          }
          return item
        })
    }
    const newRoot = filterWalk(categoryTree)
    // 将新数组的内容拷贝回原数组（保持引用），以免其他地方持有引用失效
    categoryTree.length = 0
    newRoot.forEach((n) => categoryTree.push(n))
  }

  const moveDocsToFolder = (ids: Set<number>, targetFolderId: any) => {
    // 收集文档并从原位置移除
    const collected: any[] = []
    const collectAndRemove = (items: any[]) => {
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i]
        if (item.type === 'file' && ids.has(item.id)) {
          collected.push(item)
          items.splice(i, 1)
        } else if (item.children) {
          collectAndRemove(item.children)
        }
      }
    }
    collectAndRemove(categoryTree)
    if (targetFolderId === 'root') {
      collected.forEach((doc) => categoryTree.push(doc))
      return
    }
    const target = findFolderById(targetFolderId)
    if (target) {
      if (!target.children) target.children = []
      collected.forEach((doc) => target.children.push(doc))
    }
  }

  // 批量操作（占位实现）
  const handleBatchGroup = () => {
    if (selectedDocIds.size === 0) return
    setShowBatchGroupDialog(true)
  }

  const confirmBatchGroup = () => {
    // 优先使用级联选择
    const targetIdStr = batchCascadeSelection.level3 || batchCascadeSelection.level2 || batchCascadeSelection.level1 || selectedBatchFolder
    if (!targetIdStr) return
    const targetId = targetIdStr === 'root' ? 'root' : parseInt(targetIdStr, 10)
    if (targetId !== 'root' && (Number.isNaN(targetId as number) || !findFolderById(targetId as number))) return
    moveDocsToFolder(selectedDocIds, targetId)
    setDataVersion((v) => v + 1)
    clearSelection()
    setShowBatchGroupDialog(false)
    setSelectedBatchFolder("")
    setBatchCascadeSelection({ level1: "", level2: "", level3: "" })
  }
  const cancelBatchGroup = () => {
    setShowBatchGroupDialog(false)
    setSelectedBatchFolder("")
    setBatchCascadeSelection({ level1: "", level2: "", level3: "" })
  }

  const handleBatchParse = () => {
    if (selectedDocIds.size === 0) return
    setShowBatchParseDialog(true)
  }

  const handleBatchImport = () => {
    if (selectedDocIds.size === 0) return
    setShowBatchImportDialog(true)
  }

  const handleBatchDelete = () => {
    if (selectedDocIds.size === 0) return
    setShowBatchDeleteDialog(true)
  }

  // Load active tab from localStorage on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem('profile-active-tab')
    if (savedTab && ['overview', 'documents', 'profile', 'activity'].includes(savedTab)) {
      setActiveTab(savedTab)
    }
  }, [])

  // Save active tab to localStorage when it changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    localStorage.setItem('profile-active-tab', value)
  }

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
            { id: 111, name: "个人技术笔记.pdf", type: "file", size: "2.4 MB", uploadDate: "2024-01-15", docNumber: "DOC001", status: "已发布" },
            { id: 112, name: "锅炉操作手册.pdf", type: "file", size: "3.2 MB", uploadDate: "2024-01-14", docNumber: "DOC002", status: "已发布" },
            { id: 113, name: "锅炉维护指南.pdf", type: "file", size: "4.1 MB", uploadDate: "2024-01-16", docNumber: "DOC003", status: "草稿" },
            { id: 114, name: "故障排除手册.pdf", type: "file", size: "2.8 MB", uploadDate: "2024-01-17", docNumber: "DOC004", status: "审核中" }
          ]
        },
        {
          id: 12,
          name: "安全标准",
          type: "folder",
          children: [
            { id: 121, name: "安全规范2024.pdf", type: "file", size: "1.8 MB", uploadDate: "2024-01-13", docNumber: "DOC005", status: "已发布" },
            { id: 122, name: "应急预案.docx", type: "file", size: "1.2 MB", uploadDate: "2024-01-18", docNumber: "DOC006", status: "已发布" },
            { id: 123, name: "安全检查表.xlsx", type: "file", size: "456 KB", uploadDate: "2024-01-19", docNumber: "DOC007", status: "审核中" }
          ]
        },
        {
          id: 13,
          name: "设计图纸",
          type: "folder",
          children: [
            { id: 131, name: "锅炉总装图.dwg", type: "file", size: "5.6 MB", uploadDate: "2024-01-20", docNumber: "DOC008", status: "已发布" },
            { id: 132, name: "管道布置图.pdf", type: "file", size: "3.4 MB", uploadDate: "2024-01-21", docNumber: "DOC009", status: "草稿" }
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
            { id: 211, name: "项目总结报告.docx", type: "file", size: "1.8 MB", uploadDate: "2024-01-14", docNumber: "DOC010", status: "已发布" },
            { id: 212, name: "进度报告.xlsx", type: "file", size: "856 KB", uploadDate: "2024-01-13", docNumber: "DOC011", status: "已发布" },
            { id: 213, name: "预算分析表.xlsx", type: "file", size: "1.1 MB", uploadDate: "2024-01-22", docNumber: "DOC012", status: "审核中" },
            { id: 214, name: "风险评估报告.pdf", type: "file", size: "2.3 MB", uploadDate: "2024-01-23", docNumber: "DOC013", status: "草稿" }
          ]
        },
        {
          id: 22,
          name: "2023项目",
          type: "folder",
          children: [
            { id: 221, name: "项目结项报告.pdf", type: "file", size: "3.2 MB", uploadDate: "2023-12-15", docNumber: "DOC014", status: "已发布" },
            { id: 222, name: "经验总结.docx", type: "file", size: "1.5 MB", uploadDate: "2023-12-20", docNumber: "DOC015", status: "已发布" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "学习资料",
      type: "folder",
      children: [
        { id: 31, name: "学习资料.xlsx", type: "file", size: "856 KB", uploadDate: "2024-01-13", docNumber: "DOC016", status: "已发布" },
        { id: 32, name: "培训材料.pdf", type: "file", size: "2.1 MB", uploadDate: "2024-01-12", docNumber: "DOC017", status: "已发布" },
        { id: 33, name: "行业标准汇编.pdf", type: "file", size: "8.5 MB", uploadDate: "2024-01-24", docNumber: "DOC018", status: "审核中" },
        { id: 34, name: "技术规范手册.pdf", type: "file", size: "6.2 MB", uploadDate: "2024-01-25", docNumber: "DOC019", status: "草稿" }
      ]
    },
    {
      id: 4,
      name: "会议记录",
      type: "folder",
      children: [
        { id: 41, name: "周例会记录.docx", type: "file", size: "234 KB", uploadDate: "2024-01-26", docNumber: "DOC020", status: "已发布" },
        { id: 42, name: "技术评审会议.pdf", type: "file", size: "1.8 MB", uploadDate: "2024-01-25", docNumber: "DOC021", status: "已发布" },
        { id: 43, name: "项目启动会议.docx", type: "file", size: "456 KB", uploadDate: "2024-01-24", docNumber: "DOC022", status: "草稿" }
      ]
    },
    {
      id: 5,
      name: "质量文档",
      type: "folder",
      children: [
        { id: 51, name: "质量检验报告.pdf", type: "file", size: "2.1 MB", uploadDate: "2024-01-27", docNumber: "DOC023", status: "已发布" },
        { id: 52, name: "质量体系文件.docx", type: "file", size: "1.3 MB", uploadDate: "2024-01-26", docNumber: "DOC024", status: "审核中" },
        { id: 53, name: "不合格品处理记录.xlsx", type: "file", size: "678 KB", uploadDate: "2024-01-25", docNumber: "DOC025", status: "已发布" }
      ]
    }
  ]

  // 当前选中的分类路径
  const [selectedPath, setSelectedPath] = useState<number[]>([])
  const [showAllDocuments, setShowAllDocuments] = useState(false)

  // 辅助函数
  const enterFolder = (folderId: number) => {
    setSelectedPath([...selectedPath, folderId])
    setShowAllDocuments(false) // 进入文件夹时取消全部文档模式
  }

  // 获取所有文档（递归遍历所有文件夹）
  const getAllDocuments = () => {
    const allDocs: any[] = []

    const collectDocuments = (items: any[], parentPath: string[] = []) => {
      items.forEach(item => {
        if (item.type === 'file') {
          allDocs.push({
            ...item,
            parentPath: parentPath.length > 0 ? parentPath.join(' > ') : '根目录',
            category: parentPath.length > 0 ? parentPath.join(' > ') : '根目录'
          })
        } else if (item.type === 'folder' && item.children) {
          collectDocuments(item.children, [...parentPath, item.name])
        }
      })
    }

    collectDocuments(categoryTree)
    return allDocs
  }

  // 获取所有文档分类（用于筛选）
  const getAllCategoriesForFilter = () => {
    const docs = getAllDocuments()
    const set = new Set<string>()
    docs.forEach(d => {
      if (d.category) set.add(d.category)
    })
    return Array.from(set)
  }

  // 获取文档状态对应的Badge样式
  const getDisplayStatus = (rawStatus: string) => {
    switch (rawStatus) {
      case '已发布':
        return '已导入'
      case '审核中':
        return '已解析未导入'
      case '草稿':
      default:
        return '未解析'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    // 期望的标准状态：未解析 / 已解析未导入 / 已导入
    switch (status) {
      case '已导入':
        return 'default'
      case '已解析未导入':
        return 'outline'
      case '未解析':
      default:
        return 'secondary'
    }
  }

  const getCurrentItems = () => {
    try {
      // 如果显示全部文档模式，返回所有文档
      if (showAllDocuments) {
        return getAllDocuments()
      }

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
      icon: Star
    },
    {
      id: 3,
      type: "share",
      title: "分享了文档",
      description: "技术规格说明书.docx",
      time: "2天前",
      icon: () => (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 1 5.367-2.684 3 3 0 0 1-5.367 2.684zm0 9.316a3 3 0 1 1 5.367 2.684 3 3 0 0 1-5.367-2.684z"/>
        </svg>
      )
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
    if (!newFolderName.trim()) {
      alert('请输入文件夹名称')
      return
    }

    // 创建新文件夹对象
    const newFolder = {
      id: generateNewFolderId(),
      name: newFolderName.trim(),
      type: 'folder' as const,
      children: []
    }

    // 查找要添加到的位置
    const targetIdStr = createFolderCascadeSelection.level3 || createFolderCascadeSelection.level2 || createFolderCascadeSelection.level1 || selectedParentFolder
    if (!targetIdStr || targetIdStr === 'root') {
      // 添加到根目录
      categoryTree.push(newFolder)
    } else {
      // 添加到指定的父文件夹
      const parentId = parseInt(targetIdStr)
      const addToParent = (items: any[]): boolean => {
        for (const item of items) {
          if (item.id === parentId && item.type === 'folder') {
            if (!item.children) {
              item.children = []
            }
            item.children.push(newFolder)
            return true
          }
          if (item.children && addToParent(item.children)) {
            return true
          }
        }
        return false
      }

      if (!addToParent(categoryTree)) {
        alert('未找到指定的父文件夹')
        return
      }
    }

    // 显示成功消息
    const parentName = targetIdStr && targetIdStr !== 'root' ?
      getAllFolders().find(f => f.id.toString() === targetIdStr)?.fullPath || '未知文件夹' :
      '根目录'

    alert(`成功在 ${parentName} 中创建文件夹 "${newFolderName.trim()}"`)

    // 重置状态并关闭对话框
    setShowCreateFolderDialog(false)
    setNewFolderName('')
    setSelectedParentFolder('')
    setCreateFolderCascadeSelection({ level1: "", level2: "", level3: "" })
  }

  const handleUploadDocument = () => {
    setShowUploadDialog(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadFiles(Array.from(files))
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files) {
      setUploadFiles(Array.from(files))
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleUploadFiles = async () => {
    if (uploadFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsUploading(false)
          // Reset upload state
          setUploadFiles([])
          setShowUploadDialog(false)
          setUploadProgress(0)
          setCascadeSelection({ level1: "", level2: "", level3: "" })

          // Show success message with cascade selection info
          const finalPath = getFinalSelectedPath()
          alert(`成功上传 ${uploadFiles.length} 个文件到 ${finalPath.path}`)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const removeFile = (index: number) => {
    setUploadFiles(files => files.filter((_, i) => i !== index))
  }

  const handleFolderAction = (action: string, folderId: number) => {
    switch (action) {
      case 'share':
        // 分享文件夹功能
        const folder = findFolderById(folderId)
        if (folder) {
          const shareUrl = `${window.location.origin}/share/folder/${folderId}`
          navigator.clipboard.writeText(shareUrl).then(() => {
            alert(`文件夹 "${folder.name}" 的分享链接已复制到剪贴板`)
          }).catch(() => {
            alert(`分享链接: ${shareUrl}`)
          })
        }
        break
      case 'edit':
        // 编辑文件夹功能
        const editFolder = findFolderById(folderId)
        if (editFolder) {
          const newName = prompt('请输入新的文件夹名称:', editFolder.name)
          if (newName && newName.trim() !== '') {
            editFolder.name = newName.trim()
            // 这里可以添加保存到后端的逻辑
            alert(`文件夹已重命名为: ${newName}`)
          }
        }
        break
      case 'delete':
        // 删除文件夹功能
        const deleteFolder = findFolderById(folderId)
        if (deleteFolder) {
          if (confirm(`确定要删除文件夹 "${deleteFolder.name}" 吗？此操作不可撤销。`)) {
            // 这里可以添加删除逻辑
            alert(`文件夹 "${deleteFolder.name}" 已删除`)
          }
        }
        break
      default:
        console.log(`${action} folder:`, folderId)
    }
  }

  // 辅助函数：根据ID查找文件夹
  const findFolderById = (id: number) => {
    const searchInTree = (items: any[]): any => {
      for (const item of items) {
        if (item.id === id) return item
        if (item.children) {
          const found = searchInTree(item.children)
          if (found) return found
        }
      }
      return null
    }
    return searchInTree(categoryTree)
  }

  // 获取所有可用的文件夹选项
  const getAllFolders = () => {
    const folders: { id: number; name: string; level: number; fullPath: string }[] = []

    const traverse = (items: any[], level = 0, parentPath = '') => {
      items.forEach(item => {
        if (item.type === 'folder') {
          const currentPath = parentPath ? `${parentPath} > ${item.name}` : item.name
          folders.push({
            id: item.id,
            name: item.name,
            level,
            fullPath: currentPath
          })
          if (item.children) {
            traverse(item.children, level + 1, currentPath)
          }
        }
      })
    }

    traverse(categoryTree)
    return folders
  }

  // 生成新的文件夹ID
  const generateNewFolderId = () => {
    const allIds: number[] = []

    const collectIds = (items: any[]) => {
      items.forEach(item => {
        allIds.push(item.id)
        if (item.children) {
          collectIds(item.children)
        }
      })
    }

    collectIds(categoryTree)
    return Math.max(...allIds) + 1
  }

  // 获取一级分类选项
  const getLevel1Options = () => {
    return categoryTree.filter(item => item.type === 'folder').map(item => ({
      id: item.id.toString(),
      name: item.name,
      hasChildren: item.children && item.children.some(child => child.type === 'folder')
    }))
  }

  // 获取二级分类选项
  const getLevel2Options = (level1Id: string) => {
    if (!level1Id) return []
    const level1Item = categoryTree.find(item => item.id.toString() === level1Id)
    if (!level1Item || !level1Item.children) return []

    return level1Item.children.filter(item => item.type === 'folder').map(item => ({
      id: item.id.toString(),
      name: item.name,
      hasChildren: item.children && item.children.some(child => child.type === 'folder')
    }))
  }

  // 获取三级分类选项
  const getLevel3Options = (level1Id: string, level2Id: string) => {
    if (!level1Id || !level2Id) return []
    const level1Item = categoryTree.find(item => item.id.toString() === level1Id)
    if (!level1Item || !level1Item.children) return []

    const level2Item = level1Item.children.find(item => item.id.toString() === level2Id)
    if (!level2Item || !level2Item.children) return []

    return level2Item.children.filter(item => item.type === 'folder').map(item => ({
      id: item.id.toString(),
      name: item.name,
      hasChildren: false // 假设三级是最后一级
    }))
  }

  // 级联选择变化处理
  const handleCascadeChange = (level: 'level1' | 'level2' | 'level3', value: string) => {
    setCascadeSelection(prev => {
      const newSelection = { ...prev }

      if (level === 'level1') {
        newSelection.level1 = value
        newSelection.level2 = "" // 重置下级
        newSelection.level3 = "" // 重置下级
      } else if (level === 'level2') {
        newSelection.level2 = value
        newSelection.level3 = "" // 重置下级
      } else {
        newSelection.level3 = value
      }

      return newSelection
    })
  }

  // 获取级联选择的最终目标路径
  const getFinalSelectedPath = () => {
    if (cascadeSelection.level3) {
      return {
        id: cascadeSelection.level3,
        path: getPathFromCascade(cascadeSelection.level1, cascadeSelection.level2, cascadeSelection.level3)
      }
    } else if (cascadeSelection.level2) {
      return {
        id: cascadeSelection.level2,
        path: getPathFromCascade(cascadeSelection.level1, cascadeSelection.level2)
      }
    } else if (cascadeSelection.level1 && cascadeSelection.level1 !== 'root') {
      return {
        id: cascadeSelection.level1,
        path: getPathFromCascade(cascadeSelection.level1)
      }
    } else {
      return {
        id: 'root',
        path: '根目录'
      }
    }
  }

  // 根据级联选择构建路径字符串
  const getPathFromCascade = (level1?: string, level2?: string, level3?: string) => {
    const paths: string[] = []

    if (level1 && level1 !== 'root') {
      const level1Item = categoryTree.find(item => item.id.toString() === level1)
      if (level1Item) paths.push(level1Item.name)
    }

    if (level2 && level1 && level1 !== 'root') {
      const level1Item = categoryTree.find(item => item.id.toString() === level1)
      if (level1Item?.children) {
        const level2Item = level1Item.children.find(item => item.id.toString() === level2)
        if (level2Item) paths.push(level2Item.name)
      }
    }

    if (level3 && level2 && level1 && level1 !== 'root') {
      const level1Item = categoryTree.find(item => item.id.toString() === level1)
      if (level1Item?.children) {
        const level2Item = level1Item.children.find(item => item.id.toString() === level2)
        if (level2Item?.children) {
          const level3Item = level2Item.children.find(item => item.id.toString() === level3)
          if (level3Item) paths.push(level3Item.name)
        }
      }
    }

    return paths.length > 0 ? paths.join(' > ') : '根目录'
  }

  const handleFileAction = (action: string, fileId: number) => {
    if (action === 'view') {
      router.push(`/documents/${fileId}`)
      return
    }
    if (action === 'edit-doc') {
      router.push(`/documents/review/${fileId}`)
      return
    }
    if (action === 'edit-kg') {
      router.push(`/knowledge-editor/${fileId}`)
      return
    }
    if (action === 'share') {
      const shareUrl = `${window.location.origin}/documents/${fileId}`
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({ title: "已复制分享链接", description: shareUrl })
      }).catch(() => {
        toast({ title: "复制失败", description: shareUrl, variant: "destructive" })
      })
      return
    }
    if (action === 'download') {
      const doc = findDocById(fileId)
      const filename = doc?.name || `文档-${fileId}.txt`
      const content = `这是 ${filename} 的示例下载内容。可在接入后端后替换为真实文件。`
      const element = document.createElement('a')
      const file = new Blob([content], { type: 'text/plain;charset=utf-8' })
      element.href = URL.createObjectURL(file)
      element.download = filename.endsWith('.pdf') || filename.endsWith('.docx') || filename.endsWith('.doc') ? filename : `${filename}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      toast({ title: "已开始下载", description: filename })
      return
    }
    console.log(`${action} file:`, fileId)
  }

  const handlePdfParser = () => {
    setShowPdfParserDialog(true)
  }

  const handlePdfFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    } else {
      alert('请选择PDF文件')
    }
  }

  const handleParsePdf = async () => {
    if (!pdfFile) return
    
    setIsParsing(true)
    setParsingProgress(0)
    
    // 模拟解析过程
    const progressInterval = setInterval(() => {
      setParsingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsParsing(false)
          // 模拟解析结果
          setParsedContent(`
# ${pdfFile.name.replace('.pdf', '')}

## 第一章 概述

本文档介绍了锅炉设备的基本原理和操作规范。锅炉作为重要的工业设备，在电力生产和工业供热中发挥着关键作用。

## 第二章 技术参数

### 2.1 基本参数
- 额定蒸发量：50 t/h
- 工作压力：1.6 MPa
- 蒸汽温度：204°C
- 热效率：≥85%

### 2.2 安全要求
1. 严格按照操作规程执行
2. 定期检查设备状态
3. 及时处理异常情况
4. 保持工作环境清洁

## 第三章 操作流程

### 3.1 启动前检查
1. 检查水位是否正常
2. 确认燃料供应充足
3. 检查安全阀状态
4. 验证控制系统功能

### 3.2 启动步骤
1. 开启给水系统
2. 点燃燃烧器
3. 监控温度压力
4. 调整运行参数

## 第四章 维护保养

定期维护是确保锅炉安全高效运行的重要措施。建议按照以下周期进行维护：

- 日常检查：每日
- 周检：每周
- 月检：每月
- 年检：每年

## 第五章 故障处理

常见故障及处理方法：

1. **水位异常**
   - 原因：给水系统故障
   - 处理：检查给水泵和阀门

2. **压力过高**
   - 原因：安全阀故障
   - 处理：检查并更换安全阀

3. **燃烧不良**
   - 原因：燃料质量或配风问题
   - 处理：调整燃料配比和风量

## 结论

通过严格的操作规程和定期维护，可以确保锅炉设备的安全、高效运行，为企业生产提供可靠的动力保障。
          `)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDownloadDoc = () => {
    if (!pdfFile || !parsedContent) return

    // 创建可下载的DOC文件
    const element = document.createElement('a')
    const file = new Blob([parsedContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${pdfFile.name.replace('.pdf', '')}.doc`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // 筛选用级联选择变化
  const handleFilterCascadeChange = (level: 'level1' | 'level2' | 'level3', value: string) => {
    const normalized = value === 'ALL' ? '' : value
    setFilterCascadeSelection(prev => {
      const n = { ...prev }
      if (level === 'level1') {
        n.level1 = normalized
        n.level2 = ""
        n.level3 = ""
      } else if (level === 'level2') {
        n.level2 = normalized
        n.level3 = ""
      } else {
        n.level3 = normalized
      }
      return n
    })
    // 兼容旧的单值分类筛选：有任何级联选择则取消单值分类，统一走级联
    setFilterCategory('ALL')
  }

  // 获取筛选选择的最终路径
  const getFilterSelectedPath = () => {
    if (filterCascadeSelection.level3) {
      return {
        path: getPathFromCascade(filterCascadeSelection.level1, filterCascadeSelection.level2, filterCascadeSelection.level3)
      }
    } else if (filterCascadeSelection.level2) {
      return {
        path: getPathFromCascade(filterCascadeSelection.level1, filterCascadeSelection.level2)
      }
    } else if (filterCascadeSelection.level1 && filterCascadeSelection.level1 !== 'root') {
      return {
        path: getPathFromCascade(filterCascadeSelection.level1)
      }
    } else if (filterCategory !== 'ALL') {
      // 兼容：如果还使用旧的单值分类
      return { path: filterCategory }
    }
    return { path: 'ALL' }
  }

  // 确认执行
  const confirmBatchParse = () => {
    mutateDocsInTree((doc) => selectedDocIds.has(doc.id), (doc) => {
      doc.status = '审核中'
    })
    setDataVersion((v) => v + 1)
    clearSelection()
    setShowBatchParseDialog(false)
  }
  const confirmBatchImport = () => {
    mutateDocsInTree((doc) => selectedDocIds.has(doc.id), (doc) => {
      doc.status = '已发布'
    })
    setDataVersion((v) => v + 1)
    clearSelection()
    setShowBatchImportDialog(false)
  }
  const confirmBatchDelete = () => {
    removeDocsFromTree(selectedDocIds)
    setDataVersion((v) => v + 1)
    clearSelection()
    setShowBatchDeleteDialog(false)
  }

  const handleBatchCascadeChange = (level: 'level1' | 'level2' | 'level3', value: string) => {
    setBatchCascadeSelection(prev => {
      const n = { ...prev }
      if (level === 'level1') { n.level1 = value; n.level2 = ""; n.level3 = "" }
      else if (level === 'level2') { n.level2 = value; n.level3 = "" }
      else { n.level3 = value }
      return n
    })
    setSelectedBatchFolder("")
  }

  // 辅助函数：根据ID查找文档
  const findDocById = (id: number) => {
    const searchInTree = (items: any[]): any | null => {
      for (const item of items) {
        if (item.type === 'file' && item.id === id) return item
        if (item.children) {
          const found = searchInTree(item.children)
          if (found) return found
        }
      }
      return null
    }
    return searchInTree(categoryTree)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="个人工作台" subtitle="管理个人信息、文档和查看活动记录" />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">总览</TabsTrigger>
                <TabsTrigger value="documents">个人知识库</TabsTrigger>
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
                  {/* 分类筛选：与上传一致的三级级联 */}
                  <div className="flex items-center gap-2">
                    {/* 一级分类 */}
                    <div className="w-[200px]">
                      <Select value={filterCascadeSelection.level1} onValueChange={(v) => handleFilterCascadeChange('level1', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="一级分类（全部）" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">全部</SelectItem>
                          {getLevel1Options().map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* 二级分类 */}
                    {filterCascadeSelection.level1 && filterCascadeSelection.level1 !== 'root' && getLevel2Options(filterCascadeSelection.level1).length > 0 && (
                      <div className="w-[200px]">
                        <Select value={filterCascadeSelection.level2} onValueChange={(v) => handleFilterCascadeChange('level2', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="二级分类（全部）" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">全部</SelectItem>
                            {getLevel2Options(filterCascadeSelection.level1).map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {/* 三级分类 */}
                    {filterCascadeSelection.level2 && getLevel3Options(filterCascadeSelection.level1, filterCascadeSelection.level2).length > 0 && (
                      <div className="w-[200px]">
                        <Select value={filterCascadeSelection.level3} onValueChange={(v) => handleFilterCascadeChange('level3', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="三级分类（全部）" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">全部</SelectItem>
                            {getLevel3Options(filterCascadeSelection.level1, filterCascadeSelection.level2).map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  {/* 状态筛选 */}
                  <div className="w-[180px]">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="按状态筛选（全部）" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">全部状态</SelectItem>
                        <SelectItem value="未解析">未解析</SelectItem>
                        <SelectItem value="已解析未导入">已解析未导入</SelectItem>
                        <SelectItem value="已导入">已导入</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowCreateFolderDialog(true)}>
                    <Folder className="mr-2 h-4 w-4" />
                    新建文件夹
                  </Button>
                  <Button size="sm" onClick={handleUploadDocument}>
                    <Plus className="mr-2 h-4 w-4" />
                    上传文档
                  </Button>
                </div>

                {/* 面包屑导航 */}
                {(selectedPath.length > 0 || showAllDocuments) && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <button
                      onClick={() => {
                        setSelectedPath([])
                        setShowAllDocuments(false)
                      }}
                      className="hover:text-foreground"
                    >
                      全部文档
                    </button>
                    {showAllDocuments && (
                      <div className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground">所有文档</span>
                      </div>
                    )}
                    {!showAllDocuments && getBreadcrumb().map((name, index) => (
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

                {/* 文档表格 */}
                <Card>
                  <CardContent className="p-0">
                    {(() => {
                      try {
                        // 如果不在全部文档模式且没有进入任何文件夹，显示"全部文档"选项
                        const showAllDocumentsOption = !showAllDocuments && selectedPath.length === 0
                        const items = getCurrentItems()

                        // 只在全部文档模式下显示表格，其他情况显示原有的文件夹列表
                        if (showAllDocuments) {
                          const documents = items.filter(item => item.type === 'file')
                          .filter(doc => {
                            // 分类筛选
                            const selectedFilter = getFilterSelectedPath()
                            if (selectedFilter.path !== 'ALL') {
                              // 使用前缀匹配：选了一级/二级时包含其下所有子分类
                              if (!doc.category || !doc.category.startsWith(selectedFilter.path)) return false
                            }
                            // 状态筛选（映射到展示状态后比较）
                            if (filterStatus !== 'ALL') {
                              const display = getDisplayStatus(doc.status)
                              if (display !== filterStatus) return false
                            }
                            // 关键词搜索（匹配名称、编号、分类）
                            if (searchQuery.trim()) {
                              const q = searchQuery.trim().toLowerCase()
                              const hit =
                                (doc.name || "").toLowerCase().includes(q) ||
                                (doc.docNumber || "").toLowerCase().includes(q) ||
                                (doc.category || "").toLowerCase().includes(q)
                              if (!hit) return false
                            }
                            return true
                          })

                          if (documents.length === 0) {
                            return (
                              <div className="text-center py-8 text-muted-foreground">
                                暂无文档
                              </div>
                            )
                          }

                          const allIds = documents.map((d:any) => d.id as number)

                          return (
                            <>
                              {selectedDocIds.size > 0 && (
                                <div className="flex items-center justify-between p-3 border-b">
                                  <div className="text-sm">已选 {selectedDocIds.size} 项</div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={handleBatchGroup}>批量分组</Button>
                                    <Button variant="outline" size="sm" onClick={handleBatchParse}>批量解析</Button>
                                    <Button variant="outline" size="sm" onClick={handleBatchImport}>批量导入</Button>
                                    <Button variant="outline" size="sm" onClick={handleBatchDelete}>批量删除</Button>
                                    <Button variant="ghost" size="sm" onClick={clearSelection}>清空选择</Button>
                                  </div>
                                </div>
                              )}
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[48px]">
                                      <Checkbox
                                        checked={selectedDocIds.size > 0 && selectedDocIds.size === documents.length}
                                        indeterminate={selectedDocIds.size > 0 && selectedDocIds.size < documents.length}
                                        onCheckedChange={(v:any) => handleSelectAll(allIds, Boolean(v))}
                                      />
                                    </TableHead>
                                    <TableHead className="w-[100px]">文档编号</TableHead>
                                    <TableHead>文档名</TableHead>
                                    <TableHead>文档分类</TableHead>
                                    <TableHead className="w-[100px]">文档状态</TableHead>
                                    <TableHead className="w-[100px]">文档大小</TableHead>
                                    <TableHead className="w-[100px]">操作</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                      <TableCell>
                                        <Checkbox
                                          checked={isSelected(doc.id)}
                                          onCheckedChange={(v:any) => toggleSelect(doc.id, Boolean(v))}
                                        />
                                      </TableCell>
                                      <TableCell className="font-mono text-sm">
                                        {doc.docNumber}
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        <button
                                          type="button"
                                          onClick={() => handleFileAction('view', doc.id)}
                                          className="flex items-center space-x-2 hover:underline text-left"
                                        >
                                          <FileText className="h-4 w-4 text-muted-foreground" />
                                          <span className="cursor-pointer">{doc.name}</span>
                                        </button>
                                      </TableCell>
                                      <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                          {doc.category}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        {(() => {
                                          const displayStatus = getDisplayStatus(doc.status)
                                          return (
                                            <Badge variant={getStatusBadgeVariant(displayStatus) as any}>
                                              {displayStatus}
                                            </Badge>
                                          )
                                        })()}
                                      </TableCell>
                                      <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                          {doc.size}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center space-x-1">
                                          {/* 查看按钮已移除 */}
                                          <Button variant="ghost" size="sm" onClick={() => handleFileAction('share', doc.id)}>
                                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 1 5.367-2.684 3 3 0 0 1-5.367 2.684zm0 9.316a3 3 0 1 1 5.367 2.684 3 3 0 0 1-5.367-2.684z"/>
                                            </svg>
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => handleFileAction('download', doc.id)}>
                                            <Download className="h-3 w-3" />
                                          </Button>
                                          {(() => {
                                            const displayStatus = getDisplayStatus(doc.status)
                                            if (displayStatus === '未解析') {
                                              return (
                                                <Button variant="outline" size="sm" onClick={() => handleFileAction('parse', doc.id)}>
                                                  解析
                                                </Button>
                                              )
                                            }
                                            if (displayStatus === '已解析未导入') {
                                              return (
                                                <>
                                                  <Button variant="outline" size="sm" onClick={() => handleFileAction('import', doc.id)}>
                                                    导入
                                                  </Button>
                                                  <Button variant="outline" size="sm" onClick={() => handleFileAction('edit-doc', doc.id)}>
                                                    编辑文档
                                                  </Button>
                                                </>
                                              )
                                            }
                                            if (displayStatus === '已导入') {
                                              return (
                                                <Button variant="outline" size="sm" onClick={() => handleFileAction('edit-kg', doc.id)}>
                                                  编辑知识图谱
                                                </Button>
                                              )
                                            }
                                            return null
                                          })()}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </>
                          )
                        }

                        // 非全部文档模式：显示原有的文件夹列表
                        if (!items || items.length === 0) {
                          return (
                            <div className="text-center py-8 text-muted-foreground p-4">
                              暂无文档
                            </div>
                          )
                        }

                        return (
                          <div className="p-4 space-y-3">
                            {/* 全部文档选项 - 只在根目录时显示 */}
                            {showAllDocumentsOption && (
                              <div className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-md group">
                                <button
                                  onClick={() => setShowAllDocuments(true)}
                                  className="flex items-center space-x-3 flex-1 text-left hover:bg-muted/50 rounded-md p-2"
                                >
                                  <FileText className="h-4 w-4 text-green-600" />
                                  <span className="font-medium">全部文档</span>
                                  <span className="text-xs text-muted-foreground">
                                    (查看所有文档)
                                  </span>
                                </button>
                              </div>
                            )}

                            {/* 子文件夹列表 */}
                            {items.filter((it:any)=>it.type==='folder').map((folder:any)=>(
                              <div key={folder.id} className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-md group">
                                <div className="flex items-center space-x-3 flex-1">
                                  <button
                                    onClick={() => enterFolder(folder.id)}
                                    className="flex items-center space-x-2 flex-1 text-left hover:bg-muted/50 rounded-md p-2"
                                  >
                                    <FolderOpen className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">{folder.name}</span>
                                    {folder.children && (
                                      <span className="text-xs text-muted-foreground">({folder.children.length})</span>
                                    )}
                                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                                  </button>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" onClick={() => handleFolderAction('share', folder.id)} className="hover:bg-blue-50 hover:text-blue-600">
                                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 1 5.367-2.684 3 3 0 0 1-5.367 2.684zm0 9.316a3 3 0 1 1 5.367 2.684 3 3 0 0 1-5.367-2.684z"/>
                                    </svg>
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleFolderAction('edit', folder.id)}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleFolderAction('delete', folder.id)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}

                            {/* 当前文件夹内文档表格 */}
                            {(() => {
                              const docs = items.filter((it:any)=>it.type==='file')
                              if (docs.length === 0) return null
                              const allIds = docs.map((d:any)=>d.id as number)
                              return (
                                <>
                                  {selectedDocIds.size > 0 && (
                                    <div className="flex items-center justify-between p-3 border-b">
                                      <div className="text-sm">已选 {selectedDocIds.size} 项</div>
                                      <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={handleBatchGroup}>批量分组</Button>
                                        <Button variant="outline" size="sm" onClick={handleBatchParse}>批量解析</Button>
                                        <Button variant="outline" size="sm" onClick={handleBatchImport}>批量导入</Button>
                                        <Button variant="outline" size="sm" onClick={handleBatchDelete}>批量删除</Button>
                                        <Button variant="ghost" size="sm" onClick={clearSelection}>清空选择</Button>
                                      </div>
                                    </div>
                                  )}
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[48px]">
                                          <Checkbox
                                            checked={selectedDocIds.size > 0 && selectedDocIds.size === docs.length}
                                            indeterminate={selectedDocIds.size > 0 && selectedDocIds.size < docs.length}
                                            onCheckedChange={(v:any)=>handleSelectAll(allIds, Boolean(v))}
                                          />
                                        </TableHead>
                                        <TableHead className="w-[100px]">文档编号</TableHead>
                                        <TableHead>文档名</TableHead>
                                        <TableHead>文档分类</TableHead>
                                        <TableHead className="w-[100px]">文档状态</TableHead>
                                        <TableHead className="w-[100px]">文档大小</TableHead>
                                        <TableHead className="w-[100px]">操作</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {docs.map((doc:any)=>(
                                        <TableRow key={doc.id}>
                                          <TableCell>
                                            <Checkbox checked={isSelected(doc.id)} onCheckedChange={(v:any)=>toggleSelect(doc.id, Boolean(v))} />
                                          </TableCell>
                                          <TableCell className="font-mono text-sm">{doc.docNumber}</TableCell>
                                          <TableCell className="font-medium">
                                            <button type="button" onClick={()=>handleFileAction('view', doc.id)} className="flex items-center space-x-2 hover:underline text-left">
                                              <FileText className="h-4 w-4 text-muted-foreground" />
                                              <span className="cursor-pointer">{doc.name}</span>
                                            </button>
                                          </TableCell>
                                          <TableCell>
                                            <span className="text-sm text-muted-foreground">{getBreadcrumb().concat([doc.parentPath || '']).join(' > ') || '当前文件夹'}</span>
                                          </TableCell>
                                          <TableCell>
                                            {(() => {
                                              const displayStatus = getDisplayStatus(doc.status)
                                              return (
                                                <Badge variant={getStatusBadgeVariant(displayStatus) as any}>{displayStatus}</Badge>
                                              )
                                            })()}
                                          </TableCell>
                                          <TableCell>
                                            <span className="text-sm text-muted-foreground">{doc.size}</span>
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex items-center space-x-1">
                                              <Button variant="ghost" size="sm" onClick={()=>handleFileAction('share', doc.id)}>
                                                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 1 5.367-2.684 3 3 0 0 1-5.367 2.684zm0 9.316a3 3 0 1 1 5.367 2.684 3 3 0 0 1-5.367-2.684z"/>
                                                </svg>
                                              </Button>
                                              <Button variant="ghost" size="sm" onClick={()=>handleFileAction('download', doc.id)}>
                                                <Download className="h-3 w-3" />
                                              </Button>
                                              {(() => {
                                                const displayStatus = getDisplayStatus(doc.status)
                                                if (displayStatus === '未解析') {
                                                  return (<Button variant="outline" size="sm" onClick={()=>handleFileAction('parse', doc.id)}>解析</Button>)
                                                }
                                                if (displayStatus === '已解析未导入') {
                                                  return (<><Button variant="outline" size="sm" onClick={()=>handleFileAction('import', doc.id)}>导入</Button><Button variant="outline" size="sm" onClick={()=>handleFileAction('edit-doc', doc.id)}>编辑文档</Button></>)
                                                }
                                                if (displayStatus === '已导入') {
                                                  return (<Button variant="outline" size="sm" onClick={()=>handleFileAction('edit-kg', doc.id)}>编辑知识图谱</Button>)
                                                }
                                                return null
                                              })()}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </>
                              )
                            })()}
                          </div>
                        )
                       } catch (error) {
                         console.error('Error rendering items:', error)
                         return (
                           <div className="text-center py-8 text-red-500 p-4">
                             加载文档时出错
                           </div>
                         )
                       }
                     })()}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>上传文档</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 级联分类选择 */}
            <div className="space-y-4">
              <Label>选择分组</Label>

              {/* 级联下拉菜单 - 一排显示 */}
              <div className="flex items-center space-x-4">
                {/* 一级分类 */}
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground mb-2 block">一级分类</Label>
                  <Select value={cascadeSelection.level1} onValueChange={(value) => handleCascadeChange('level1', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择一级分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">
                        <div className="flex items-center space-x-2">
                          <Folder className="h-4 w-4 text-blue-600" />
                          <span>根目录</span>
                        </div>
                      </SelectItem>
                      {getLevel1Options().map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center space-x-2">
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span>{option.name}</span>
                            {option.hasChildren && (
                              <span className="text-xs text-muted-foreground">(有子分类)</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 二级分类 - 只有选择了一级分类且有子分类时才显示 */}
                {cascadeSelection.level1 && cascadeSelection.level1 !== 'root' && getLevel2Options(cascadeSelection.level1).length > 0 && (
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground mb-2 block">二级分类</Label>
                    <Select value={cascadeSelection.level2} onValueChange={(value) => handleCascadeChange('level2', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择二级分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLevel2Options(cascadeSelection.level1).map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center space-x-2">
                              <FolderOpen className="h-4 w-4 text-amber-600" />
                              <span>{option.name}</span>
                              {option.hasChildren && (
                                <span className="text-xs text-muted-foreground">(有子分类)</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 三级分类 - 只有选择了二级分类且有子分类时才显示 */}
                {cascadeSelection.level2 && getLevel3Options(cascadeSelection.level1, cascadeSelection.level2).length > 0 && (
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground mb-2 block">三级分类</Label>
                    <Select value={cascadeSelection.level3} onValueChange={(value) => handleCascadeChange('level3', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择三级分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLevel3Options(cascadeSelection.level1, cascadeSelection.level2).map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center space-x-2">
                              <FolderOpen className="h-4 w-4 text-green-600" />
                              <span>{option.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">上传文档到个人工作台</h3>
              <p className="mt-2 text-muted-foreground">拖拽文件到此处，或点击浏览</p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
              />
              <label htmlFor="file-upload">
                <Button className="mt-4" asChild>
                  <span>
                    <Plus className="mr-2 h-4 w-4" />
                    选择文件
                  </span>
                </Button>
              </label>
            </div>

            {/* 文件列表 */}
            {uploadFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">选中的文件:</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {uploadFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 上传进度 */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">上传进度</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false)
                  setUploadFiles([])
                  setUploadProgress(0)
                  setCascadeSelection({ level1: "", level2: "", level3: "" })
                }}
                disabled={isUploading}
              >
                取消
              </Button>
              {uploadFiles.length > 0 && !isUploading && (
                <Button onClick={handleUploadFiles}>
                  <Upload className="mr-2 h-4 w-4" />
                  上传文件
                </Button>
              )}
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

      {/* PDF解析对话框 */}
      <Dialog open={showPdfParserDialog} onOpenChange={setShowPdfParserDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>PDF解析工具</DialogTitle>
            <p className="text-sm text-muted-foreground">
              将PDF文件解析为可编辑的DOC格式文档
            </p>
          </DialogHeader>
          <div className="space-y-6">
            {/* 文件上传区域 */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">选择PDF文件</h3>
              <p className="mt-2 text-muted-foreground">支持PDF格式，最大文件大小50MB</p>
              <div className="mt-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload">
                  <Button asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      选择PDF文件
                    </span>
                  </Button>
                </label>
              </div>
              {pdfFile && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">已选择文件：{pdfFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    文件大小：{(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* 解析进度 */}
            {isParsing && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">正在解析PDF文件...</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${parsingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {parsingProgress}% 完成
                </p>
              </div>
            )}

            {/* 解析结果 */}
            {parsedContent && !isParsing && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">解析结果</h3>
                  <Button onClick={handleDownloadDoc}>
                    <Download className="mr-2 h-4 w-4" />
                    下载DOC文件
                  </Button>
                </div>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {parsedContent}
                  </pre>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>✅ 解析完成！文档已转换为可编辑的DOC格式</p>
                  <p>📄 共解析 {parsedContent.split('\n').length} 行内容</p>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPdfParserDialog(false)
                  setPdfFile(null)
                  setParsedContent("")
                  setParsingProgress(0)
                  setIsParsing(false)
                }}
              >
                取消
              </Button>
              {pdfFile && !isParsing && !parsedContent && (
                <Button onClick={handleParsePdf}>
                  开始解析
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 新建文件夹对话框 */}
      <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建文件夹</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">文件夹名称</Label>
              <Input
                id="folderName"
                placeholder="请输入文件夹名称"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>选择父级文件夹</Label>
              <div className="flex items-center gap-3">
                {/* 一级 */}
                <div className="w-[220px]">
                  <Select value={createFolderCascadeSelection.level1} onValueChange={(v)=>setCreateFolderCascadeSelection(prev=>({ ...prev, level1:v, level2:"", level3:"" }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="一级分类（可选）" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">
                        <div className="flex items-center space-x-2">
                          <Folder className="h-4 w-4 text-blue-600" />
                          <span>根目录</span>
                        </div>
                      </SelectItem>
                      {getLevel1Options().map((option)=>(
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center space-x-2">
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span>{option.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* 二级 */}
                {createFolderCascadeSelection.level1 && createFolderCascadeSelection.level1 !== 'root' && getLevel2Options(createFolderCascadeSelection.level1).length>0 && (
                  <div className="w-[220px]">
                    <Select value={createFolderCascadeSelection.level2} onValueChange={(v)=>setCreateFolderCascadeSelection(prev=>({ ...prev, level2:v, level3:"" }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="二级分类（可选）" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLevel2Options(createFolderCascadeSelection.level1).map((option)=>(
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center space-x-2">
                              <FolderOpen className="h-4 w-4 text-amber-600" />
                              <span>{option.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {/* 三级 */}
                {createFolderCascadeSelection.level2 && getLevel3Options(createFolderCascadeSelection.level1, createFolderCascadeSelection.level2).length>0 && (
                  <div className="w-[220px]">
                    <Select value={createFolderCascadeSelection.level3} onValueChange={(v)=>setCreateFolderCascadeSelection(prev=>({ ...prev, level3:v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="三级分类（可选）" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLevel3Options(createFolderCascadeSelection.level1, createFolderCascadeSelection.level2).map((option)=>(
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center space-x-2">
                              <FolderOpen className="h-4 w-4 text-green-600" />
                              <span>{option.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">如果不选择父级文件夹，将在根目录下创建</p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateFolderDialog(false)
                  setNewFolderName("")
                  setSelectedParentFolder("")
                  setCreateFolderCascadeSelection({ level1: "", level2: "", level3: "" })
                }}
              >
                取消
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                创建文件夹
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 批量分组对话框 */}
      <Dialog open={showBatchGroupDialog} onOpenChange={setShowBatchGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量分组</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">已选择 {selectedDocIds.size} 个文档</div>
            {/* 级联分类选择（与上传一致） */}
            <div className="space-y-3">
              <Label>选择目标分组</Label>
              <div className="flex items-center gap-3">
                {/* 一级 */}
                <div className="w-[220px]">
                  <Select value={batchCascadeSelection.level1} onValueChange={(v) => handleBatchCascadeChange('level1', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="一级分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">
                        <div className="flex items-center space-x-2">
                          <Folder className="h-4 w-4 text-blue-600" />
                          <span>根目录</span>
                        </div>
                      </SelectItem>
                      {getLevel1Options().map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center space-x-2">
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span>{option.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* 二级 */}
                {batchCascadeSelection.level1 && batchCascadeSelection.level1 !== 'root' && getLevel2Options(batchCascadeSelection.level1).length > 0 && (
                  <div className="w-[220px]">
                    <Select value={batchCascadeSelection.level2} onValueChange={(v) => handleBatchCascadeChange('level2', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="二级分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLevel2Options(batchCascadeSelection.level1).map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center space-x-2">
                              <FolderOpen className="h-4 w-4 text-amber-600" />
                              <span>{option.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {/* 三级 */}
                {batchCascadeSelection.level2 && getLevel3Options(batchCascadeSelection.level1, batchCascadeSelection.level2).length > 0 && (
                  <div className="w-[220px]">
                    <Select value={batchCascadeSelection.level3} onValueChange={(v) => handleBatchCascadeChange('level3', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="三级分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLevel3Options(batchCascadeSelection.level1, batchCascadeSelection.level2).map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center space-x-2">
                              <FolderOpen className="h-4 w-4 text-green-600" />
                              <span>{option.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelBatchGroup}>取消</Button>
              <Button onClick={confirmBatchGroup} disabled={!(batchCascadeSelection.level1 || selectedBatchFolder)}>确定分组</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 批量解析对话框 */}
      <Dialog open={showBatchParseDialog} onOpenChange={setShowBatchParseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量解析</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">将选中文档标记为"已解析未导入"。</p>
            <div className="text-sm">已选择 {selectedDocIds.size} 个文档</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBatchParseDialog(false)}>取消</Button>
              <Button onClick={confirmBatchParse}>开始解析</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 批量导入对话框 */}
      <Dialog open={showBatchImportDialog} onOpenChange={setShowBatchImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量导入</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">将选中文档标记为"已导入"。</p>
            <div className="text-sm">已选择 {selectedDocIds.size} 个文档</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBatchImportDialog(false)}>取消</Button>
              <Button onClick={confirmBatchImport}>开始导入</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 批量删除对话框 */}
      <Dialog open={showBatchDeleteDialog} onOpenChange={setShowBatchDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量删除</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">此操作不可撤销，将从个人知识库中移除选中文档。</p>
            <div className="text-sm">已选择 {selectedDocIds.size} 个文档</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBatchDeleteDialog(false)}>取消</Button>
              <Button variant="destructive" onClick={confirmBatchDelete}>删除</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}