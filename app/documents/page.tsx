"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
  DragOverlayProps,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import {
  CSS,
} from '@dnd-kit/utilities'
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Calendar,
  User,
  FileType,
  ArrowUpDown,
  ArrowLeft,
  X,
  Plus,
  Folder,
  Play,
  CheckCircle2,
  Import,
  Settings,
  FolderPlus,
  FolderEdit,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  FolderOpen,
  File,
  Edit3,
  Copy,
  Move,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Mock data for documents
const mockDocuments = [
  {
    id: 1,
    name: "锅炉安全标准 2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-15",
    lastModified: "2024-01-15",
    uploadedBy: "张伟",
    category: "安全标准",
    version: "v2.1",
  },
  {
    id: 2,
    name: "技术规格说明书.docx",
    type: "Word",
    size: "1.8 MB",
    status: "已解析未审核",
    uploadDate: "2024-01-14",
    lastModified: "2024-01-14",
    uploadedBy: "李明",
    category: "技术文档",
    version: "v1.0",
  },
  {
    id: 3,
    name: "维护保养计划.xlsx",
    type: "Excel",
    size: "856 KB",
    status: "已解析已审核",
    uploadDate: "2024-01-13",
    lastModified: "2024-01-13",
    uploadedBy: "王芳",
    category: "维护保养",
    version: "v3.2",
  },
  {
    id: 4,
    name: "质量控制手册.pdf",
    type: "PDF",
    size: "3.1 MB",
    status: "未解析",
    uploadDate: "2024-01-12",
    lastModified: "2024-01-12",
    uploadedBy: "陈路",
    category: "质量控制",
    version: "v1.5",
  },
  {
    id: 5,
    name: "安装指南.pdf",
    type: "PDF",
    size: "4.2 MB",
    status: "已导入未审核",
    uploadDate: "2024-01-11",
    lastModified: "2024-01-11",
    uploadedBy: "刘刚",
    category: "安装指南",
    version: "v2.0",
  },
  {
    id: 6,
    name: "电气安全规范.pdf",
    type: "PDF",
    size: "1.9 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-10",
    lastModified: "2024-01-10",
    uploadedBy: "赵工程师",
    category: "安全标准",
    version: "v1.3",
  },
  {
    id: 7,
    name: "设备维护手册.docx",
    type: "Word",
    size: "2.1 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-09",
    lastModified: "2024-01-09",
    uploadedBy: "孙技师",
    category: "维护保养",
    version: "v2.1",
  },
  {
    id: 8,
    name: "检验测试报告.xlsx",
    type: "Excel",
    size: "1.2 MB",
    status: "已解析未审核",
    uploadDate: "2024-01-08",
    lastModified: "2024-01-08",
    uploadedBy: "周检验员",
    category: "质量控制",
    version: "v1.0",
  },
  {
    id: 9,
    name: "工艺流程说明.pdf",
    type: "PDF",
    size: "3.5 MB",
    status: "未解析",
    uploadDate: "2024-01-07",
    lastModified: "2024-01-07",
    uploadedBy: "吴工艺师",
    category: "技术文档",
    version: "v1.8",
  },
  {
    id: 10,
    name: "安全培训材料.pptx",
    type: "PowerPoint",
    size: "5.8 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-06",
    lastModified: "2024-01-06",
    uploadedBy: "郑培训师",
    category: "安全标准",
    version: "v3.0",
  },
  {
    id: 11,
    name: "设备故障诊断手册.pdf",
    type: "PDF",
    size: "2.7 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-05",
    lastModified: "2024-01-05",
    uploadedBy: "王维修",
    category: "维护保养",
    version: "v2.3",
  },
  {
    id: 12,
    name: "质量检测标准.docx",
    type: "Word",
    size: "1.5 MB",
    status: "已导入未审核",
    uploadDate: "2024-01-04",
    lastModified: "2024-01-04",
    uploadedBy: "李质检",
    category: "质量控制",
    version: "v1.6",
  },
  {
    id: 13,
    name: "技术参数表.xlsx",
    type: "Excel",
    size: "856 KB",
    status: "已解析已审核",
    uploadDate: "2024-01-03",
    lastModified: "2024-01-03",
    uploadedBy: "陈技术员",
    category: "技术文档",
    version: "v1.2",
  },
  {
    id: 14,
    name: "环保排放标准.pdf",
    type: "PDF",
    size: "1.8 MB",
    status: "未解析",
    uploadDate: "2024-01-02",
    lastModified: "2024-01-02",
    uploadedBy: "张环保",
    category: "安全标准",
    version: "v2.0",
  },
  {
    id: 15,
    name: "操作员手册.docx",
    type: "Word",
    size: "2.3 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-01",
    lastModified: "2024-01-01",
    uploadedBy: "刘操作员",
    category: "技术文档",
    version: "v1.9",
  },
  {
    id: 16,
    name: "维护记录表.xlsx",
    type: "Excel",
    size: "642 KB",
    status: "已解析未审核",
    uploadDate: "2023-12-31",
    lastModified: "2023-12-31",
    uploadedBy: "赵维护",
    category: "维护保养",
    version: "v1.1",
  },
  {
    id: 17,
    name: "安全防护指南.pdf",
    type: "PDF",
    size: "2.9 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-30",
    lastModified: "2023-12-30",
    uploadedBy: "孙安全",
    category: "安全标准",
    version: "v1.7",
  },
  {
    id: 18,
    name: "质量审核报告.docx",
    type: "Word",
    size: "1.7 MB",
    status: "已导入未审核",
    uploadDate: "2023-12-29",
    lastModified: "2023-12-29",
    uploadedBy: "吴审核员",
    category: "质量控制",
    version: "v1.4",
  },
  {
    id: 19,
    name: "设备配置清单.xlsx",
    type: "Excel",
    size: "1.1 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-28",
    lastModified: "2023-12-28",
    uploadedBy: "周配置",
    category: "技术文档",
    version: "v1.3",
  },
  {
    id: 20,
    name: "应急预案.pdf",
    type: "PDF",
    size: "3.2 MB",
    status: "未解析",
    uploadDate: "2023-12-27",
    lastModified: "2023-12-27",
    uploadedBy: "郑应急",
    category: "安全标准",
    version: "v2.2",
  },
  {
    id: 21,
    name: "维护保养计划表.xlsx",
    type: "Excel",
    size: "934 KB",
    status: "已解析已审核",
    uploadDate: "2023-12-26",
    lastModified: "2023-12-26",
    uploadedBy: "王计划",
    category: "维护保养",
    version: "v1.5",
  },
  {
    id: 22,
    name: "技术改进方案.docx",
    type: "Word",
    size: "2.6 MB",
    status: "已导入未审核",
    uploadDate: "2023-12-25",
    lastModified: "2023-12-25",
    uploadedBy: "李改进",
    category: "技术文档",
    version: "v1.0",
  },
  {
    id: 23,
    name: "质量检验规程.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-24",
    lastModified: "2023-12-24",
    uploadedBy: "陈检验",
    category: "质量控制",
    version: "v1.8",
  },
  {
    id: 24,
    name: "安全培训记录.xlsx",
    type: "Excel",
    size: "1.3 MB",
    status: "已解析未审核",
    uploadDate: "2023-12-23",
    lastModified: "2023-12-23",
    uploadedBy: "张培训",
    category: "安全标准",
    version: "v1.2",
  },
  {
    id: 25,
    name: "设备运行日志.docx",
    type: "Word",
    size: "1.9 MB",
    status: "已导入已审核",
    uploadDate: "2023-12-22",
    lastModified: "2023-12-22",
    uploadedBy: "刘运行",
    category: "维护保养",
    version: "v1.6",
  },
  // 待分组文档
  {
    id: 68,
    name: "临时技术方案.docx",
    type: "Word",
    size: "1.2 MB",
    status: "未解析",
    uploadDate: "2024-01-20",
    lastModified: "2024-01-20",
    uploadedBy: "李工程师",
    category: "待分组",
    version: "v1.0",
  },
  {
    id: 69,
    name: "会议纪要 2024-01-19.pdf",
    type: "PDF",
    size: "856 KB",
    status: "已解析未审核",
    uploadDate: "2024-01-19",
    lastModified: "2024-01-19",
    uploadedBy: "王秘书",
    category: "待分组",
    version: "v1.0",
  },
  {
    id: 70,
    name: "设备故障报告.xlsx",
    type: "Excel",
    size: "1.5 MB",
    status: "已导入未审核",
    uploadDate: "2024-01-18",
    lastModified: "2024-01-18",
    uploadedBy: "张技师",
    category: "待分组",
    version: "v1.0",
  },
  {
    id: 71,
    name: "新员工培训资料.pptx",
    type: "PowerPoint",
    size: "3.2 MB",
    status: "未解析",
    uploadDate: "2024-01-17",
    lastModified: "2024-01-17",
    uploadedBy: "陈主管",
    category: "待分组",
    version: "v1.0",
  },
  {
    id: 72,
    name: "供应商评估表.pdf",
    type: "PDF",
    size: "2.1 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-16",
    lastModified: "2024-01-16",
    uploadedBy: "刘采购",
    category: "待分组",
    version: "v1.0",
  },
  {
    id: 26,
    name: "项目进度跟踪表.xlsx",
    type: "Excel",
    size: "1.8 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-15",
    lastModified: "2024-01-15",
    uploadedBy: "赵项目经理",
    category: "待分组",
    version: "v1.0",
  },
  {
    id: 27,
    name: "技术交流会议记录.docx",
    type: "Word",
    size: "1.4 MB",
    status: "已解析未审核",
    uploadDate: "2024-01-14",
    lastModified: "2024-01-14",
    uploadedBy: "孙工程师",
    category: "待分组",
    version: "v1.0",
  },
  {
    id: 28,
    name: "设备运行数据.txt",
    type: "Text",
    size: "512 KB",
    status: "未解析",
    uploadDate: "2024-01-13",
    lastModified: "2024-01-13",
    uploadedBy: "周操作员",
    category: "待分组",
    version: "v1.0",
  },
  {
    id: 29,
    name: "客户反馈意见.pdf",
    type: "PDF",
    size: "1.7 MB",
    status: "已导入未审核",
    uploadDate: "2024-01-12",
    lastModified: "2024-01-12",
    uploadedBy: "吴客服",
    category: "待分组",
    version: "v1.0",
  },
  {
    id: 30,
    name: "临时工作安排.xlsx",
    type: "Excel",
    size: "945 KB",
    status: "已解析已审核",
    uploadDate: "2024-01-11",
    lastModified: "2024-01-11",
    uploadedBy: "郑主管",
    category: "待分组",
    version: "v1.0",
  },
  // 检验规程文档
  {
    id: 31,
    name: "电气设备检验规程.pdf",
    type: "PDF",
    size: "2.1 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-10",
    lastModified: "2024-01-10",
    uploadedBy: "检验员A",
    category: "检验规程",
    version: "v1.0",
  },
  {
    id: 32,
    name: "机械部件检验标准.docx",
    type: "Word",
    size: "1.8 MB",
    status: "已解析未审核",
    uploadDate: "2024-01-09",
    lastModified: "2024-01-09",
    uploadedBy: "检验员B",
    category: "检验规程",
    version: "v1.0",
  },
  {
    id: 33,
    name: "焊接质量检验规程.pdf",
    type: "PDF",
    size: "2.5 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-08",
    lastModified: "2024-01-08",
    uploadedBy: "检验员C",
    category: "检验规程",
    version: "v1.0",
  },
  {
    id: 34,
    name: "材料检验测试报告.xlsx",
    type: "Excel",
    size: "1.2 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-07",
    lastModified: "2024-01-07",
    uploadedBy: "检验员D",
    category: "检验规程",
    version: "v1.0",
  },
  {
    id: 35,
    name: "产品外观检验标准.pdf",
    type: "PDF",
    size: "1.9 MB",
    status: "已解析未审核",
    uploadDate: "2024-01-06",
    lastModified: "2024-01-06",
    uploadedBy: "检验员E",
    category: "检验规程",
    version: "v1.0",
  },
  {
    id: 36,
    name: "尺寸精度检验规程.docx",
    type: "Word",
    size: "1.6 MB",
    status: "已导入未审核",
    uploadDate: "2024-01-05",
    lastModified: "2024-01-05",
    uploadedBy: "检验员F",
    category: "检验规程",
    version: "v1.0",
  },
  {
    id: 37,
    name: "功能性能检验标准.pdf",
    type: "PDF",
    size: "2.3 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-04",
    lastModified: "2024-01-04",
    uploadedBy: "检验员G",
    category: "检验规程",
    version: "v1.0",
  },
  {
    id: 38,
    name: "安全防护检验规程.docx",
    type: "Word",
    size: "1.4 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-03",
    lastModified: "2024-01-03",
    uploadedBy: "检验员H",
    category: "检验规程",
    version: "v1.0",
  },
  {
    id: 39,
    name: "环境适应性检验标准.pdf",
    type: "PDF",
    size: "2.0 MB",
    status: "已导入已审核",
    uploadDate: "2024-01-02",
    lastModified: "2024-01-02",
    uploadedBy: "检验员I",
    category: "检验规程",
    version: "v1.0",
  },
  // 设计规范文档 (需要18个，目前只有1个)
  {
    id: 40,
    name: "建筑设计规范.pdf",
    type: "PDF",
    size: "3.2 MB",
    status: "已解析已审核",
    uploadDate: "2024-01-01",
    lastModified: "2024-01-01",
    uploadedBy: "设计师A",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 41,
    name: "结构设计标准.docx",
    type: "Word",
    size: "2.8 MB",
    status: "已解析未审核",
    uploadDate: "2023-12-31",
    lastModified: "2023-12-31",
    uploadedBy: "设计师B",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 42,
    name: "电气设计规范.pdf",
    type: "PDF",
    size: "2.5 MB",
    status: "已导入已审核",
    uploadDate: "2023-12-30",
    lastModified: "2023-12-30",
    uploadedBy: "设计师C",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 43,
    name: "机械设计标准.docx",
    type: "Word",
    size: "2.1 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-29",
    lastModified: "2023-12-29",
    uploadedBy: "设计师D",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 44,
    name: "管道设计规范.pdf",
    type: "PDF",
    size: "2.9 MB",
    status: "已解析未审核",
    uploadDate: "2023-12-28",
    lastModified: "2023-12-28",
    uploadedBy: "设计师E",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 45,
    name: "暖通设计标准.docx",
    type: "Word",
    size: "2.3 MB",
    status: "已导入未审核",
    uploadDate: "2023-12-27",
    lastModified: "2023-12-27",
    uploadedBy: "设计师F",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 46,
    name: "给排水设计规范.pdf",
    type: "PDF",
    size: "2.7 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-26",
    lastModified: "2023-12-26",
    uploadedBy: "设计师G",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 47,
    name: "消防设计标准.docx",
    type: "Word",
    size: "2.4 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-25",
    lastModified: "2023-12-25",
    uploadedBy: "设计师H",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 48,
    name: "环保设计规范.pdf",
    type: "PDF",
    size: "2.6 MB",
    status: "已导入已审核",
    uploadDate: "2023-12-24",
    lastModified: "2023-12-24",
    uploadedBy: "设计师I",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 49,
    name: "景观设计标准.docx",
    type: "Word",
    size: "2.0 MB",
    status: "已解析未审核",
    uploadDate: "2023-12-23",
    lastModified: "2023-12-23",
    uploadedBy: "设计师J",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 50,
    name: "智能化设计规范.pdf",
    type: "PDF",
    size: "2.8 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-22",
    lastModified: "2023-12-22",
    uploadedBy: "设计师K",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 51,
    name: "节能设计标准.docx",
    type: "Word",
    size: "2.2 MB",
    status: "已导入未审核",
    uploadDate: "2023-12-21",
    lastModified: "2023-12-21",
    uploadedBy: "设计师L",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 52,
    name: "抗震设计规范.pdf",
    type: "PDF",
    size: "3.0 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-20",
    lastModified: "2023-12-20",
    uploadedBy: "设计师M",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 53,
    name: "无障碍设计标准.docx",
    type: "Word",
    size: "1.9 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-19",
    lastModified: "2023-12-19",
    uploadedBy: "设计师N",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 54,
    name: "人防设计规范.pdf",
    type: "PDF",
    size: "2.5 MB",
    status: "已导入已审核",
    uploadDate: "2023-12-18",
    lastModified: "2023-12-18",
    uploadedBy: "设计师O",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 55,
    name: "幕墙设计标准.docx",
    type: "Word",
    size: "2.3 MB",
    status: "已解析未审核",
    uploadDate: "2023-12-17",
    lastModified: "2023-12-17",
    uploadedBy: "设计师P",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 56,
    name: "钢结构设计规范.pdf",
    type: "PDF",
    size: "2.7 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-16",
    lastModified: "2023-12-16",
    uploadedBy: "设计师Q",
    category: "设计规范",
    version: "v1.0",
  },
  {
    id: 57,
    name: "混凝土设计标准.docx",
    type: "Word",
    size: "2.4 MB",
    status: "已导入已审核",
    uploadDate: "2023-12-15",
    lastModified: "2023-12-15",
    uploadedBy: "设计师R",
    category: "设计规范",
    version: "v1.0",
  },
  // 工艺标准文档 (需要11个，目前只有1个)
  {
    id: 58,
    name: "焊接工艺标准.pdf",
    type: "PDF",
    size: "2.1 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-14",
    lastModified: "2023-12-14",
    uploadedBy: "工艺师A",
    category: "工艺标准",
    version: "v1.0",
  },
  {
    id: 59,
    name: "机械加工工艺标准.docx",
    type: "Word",
    size: "1.8 MB",
    status: "已解析未审核",
    uploadDate: "2023-12-13",
    lastModified: "2023-12-13",
    uploadedBy: "工艺师B",
    category: "工艺标准",
    version: "v1.0",
  },
  {
    id: 60,
    name: "热处理工艺标准.pdf",
    type: "PDF",
    size: "2.3 MB",
    status: "已导入已审核",
    uploadDate: "2023-12-12",
    lastModified: "2023-12-12",
    uploadedBy: "工艺师C",
    category: "工艺标准",
    version: "v1.0",
  },
  {
    id: 61,
    name: "表面处理工艺标准.docx",
    type: "Word",
    size: "1.9 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-11",
    lastModified: "2023-12-11",
    uploadedBy: "工艺师D",
    category: "工艺标准",
    version: "v1.0",
  },
  {
    id: 62,
    name: "装配工艺标准.pdf",
    type: "PDF",
    size: "2.0 MB",
    status: "已解析未审核",
    uploadDate: "2023-12-10",
    lastModified: "2023-12-10",
    uploadedBy: "工艺师E",
    category: "工艺标准",
    version: "v1.0",
  },
  {
    id: 63,
    name: "涂装工艺标准.docx",
    type: "Word",
    size: "1.7 MB",
    status: "已导入已审核",
    uploadDate: "2023-12-09",
    lastModified: "2023-12-09",
    uploadedBy: "工艺师F",
    category: "工艺标准",
    version: "v1.0",
  },
  {
    id: 64,
    name: "铸造工艺标准.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-08",
    lastModified: "2023-12-08",
    uploadedBy: "工艺师G",
    category: "工艺标准",
    version: "v1.0",
  },
  {
    id: 65,
    name: "锻造工艺标准.docx",
    type: "Word",
    size: "1.6 MB",
    status: "已解析未审核",
    uploadDate: "2023-12-07",
    lastModified: "2023-12-07",
    uploadedBy: "工艺师H",
    category: "工艺标准",
    version: "v1.0",
  },
  {
    id: 66,
    name: "冲压工艺标准.pdf",
    type: "PDF",
    size: "2.2 MB",
    status: "已导入已审核",
    uploadDate: "2023-12-06",
    lastModified: "2023-12-06",
    uploadedBy: "工艺师I",
    category: "工艺标准",
    version: "v1.0",
  },
  {
    id: 67,
    name: "注塑工艺标准.docx",
    type: "Word",
    size: "1.8 MB",
    status: "已解析已审核",
    uploadDate: "2023-12-05",
    lastModified: "2023-12-05",
    uploadedBy: "工艺师J",
    category: "工艺标准",
    version: "v1.0",
  },
]

// Document groups for upload
const documentGroups = [
  "待分组",
  "安全标准",
  "技术文档", 
  "维护保养",
  "质量控制",
  "安装指南",
  "检验规程",
  "设计规范",
  "工艺标准"
]

// Mock data for document groups management with hierarchical structure
const mockGroups = [
  { 
    id: 0, 
    name: "待分组", 
    description: "尚未分类的文档", 
    documentCount: 10, 
    color: "gray",
    parentId: null,
    children: []
  },
  { 
    id: 1, 
    name: "安全标准", 
    description: "安全相关的标准和规范文档", 
    documentCount: 7, 
    color: "blue",
    parentId: null,
    children: [
      { id: 11, name: "电气安全", description: "电气安全相关文档", documentCount: 1, color: "blue", parentId: 1, children: [] },
      { id: 12, name: "机械安全", description: "机械安全相关文档", documentCount: 6, color: "blue", parentId: 1, children: [] }
    ]
  },
  { 
    id: 2, 
    name: "技术文档", 
    description: "技术规格和说明文档", 
    documentCount: 6, 
    color: "green",
    parentId: null,
    children: [
      { id: 21, name: "设备规格", description: "设备技术规格文档", documentCount: 5, color: "green", parentId: 2, children: [] },
      { id: 22, name: "操作手册", description: "设备操作手册", documentCount: 1, color: "green", parentId: 2, children: [] }
    ]
  },
  { 
    id: 3, 
    name: "维护保养", 
    description: "设备维护和保养相关文档", 
    documentCount: 6, 
    color: "orange",
    parentId: null,
    children: [
      { id: 31, name: "设备维护", description: "设备维护相关文档", documentCount: 4, color: "orange", parentId: 3, children: [] }
    ]
  },
  { 
    id: 4, 
    name: "质量控制", 
    description: "质量管理和控制文档", 
    documentCount: 5, 
    color: "purple",
    parentId: null,
    children: [
      { id: 41, name: "质量检测", description: "质量检测相关文档", documentCount: 4, color: "purple", parentId: 4, children: [] }
    ]
  },
  { 
    id: 5, 
    name: "安装指南", 
    description: "设备安装和操作指南", 
    documentCount: 1, 
    color: "red",
    parentId: null,
    children: []
  },
  { 
    id: 6, 
    name: "检验规程", 
    description: "检验和测试规程文档", 
    documentCount: 9, 
    color: "yellow",
    parentId: null,
    children: []
  },
  { 
    id: 7, 
    name: "设计规范", 
    description: "设计标准和规范文档", 
    documentCount: 18, 
    color: "indigo",
    parentId: null,
    children: []
  },
  { 
    id: 8, 
    name: "工艺标准", 
    description: "工艺流程和标准文档", 
    documentCount: 10, 
    color: "pink",
    parentId: null,
    children: []
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "未解析":
      return <Clock className="h-4 w-4 text-gray-600" />
    case "已解析未审核":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "已解析已审核":
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "已导入未审核":
      return <AlertCircle className="h-4 w-4 text-orange-600" />
    case "已导入已审核":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants = {
    "未解析": "secondary",
    "已解析未审核": "outline",
    "已解析已审核": "default",
    "已导入未审核": "outline",
    "已导入已审核": "default",
  } as const

  return (
    <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
      {status}
    </Badge>
  )
}

// Generate document number like DF-2024-001
const getDocumentNumber = (id: number) => `DF-2024-${String(id).padStart(3, '0')}`

// Draggable Folder Component
const DraggableFolder = ({ folder, isSelected, isRenaming, onRename, onConfirmRename, onCancelRename, onSelect, onDoubleClick, onContextMenu, isDragOver }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder.id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'bg-blue-50 border-blue-200' : 
        isDragOver ? 'bg-green-50 border-green-300 ring-2 ring-green-200' :
        'hover:bg-muted/50'
      }`}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {/* 复选框 */}
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <div 
        {...listeners} 
        className="absolute inset-0 z-10"
        style={{ top: '8px', left: '8px', right: '8px', bottom: '8px' }}
        onDoubleClick={(e) => {
          e.stopPropagation()
          onDoubleClick()
        }}
        onMouseDown={(e) => {
          // Prevent drag start on double click
          if (e.detail === 2) {
            e.preventDefault()
          }
        }}
        onTouchStart={(e) => {
          // Prevent drag start on double tap
          if (e.touches.length === 1) {
            const touch = e.touches[0]
            const now = Date.now()
            if (now - (window as any).lastTouchTime < 300) {
              e.preventDefault()
              onDoubleClick()
            }
            (window as any).lastTouchTime = now
          }
        }}
        onPointerDown={(e) => {
          // Prevent drag start on double click
          if (e.detail === 2) {
            e.preventDefault()
          }
        }}
      />
      
      {/* 文件夹图标 */}
      <div className="mt-2">
        <Folder className="h-8 w-8 text-blue-500" />
      </div>
      
      {/* 文件夹名称 */}
      <div className="mt-2 text-center">
        <p className="text-sm font-medium truncate w-full">
          {isRenaming ? (
            <Input
              value={isRenaming.name}
              onChange={(e) => onRename({ ...isRenaming, name: e.target.value })}
              onBlur={onConfirmRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onConfirmRename()
                if (e.key === 'Escape') onCancelRename()
              }}
              className="h-6 text-sm text-center"
              autoFocus
            />
          ) : (
            folder.name
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {folder.documentCount} 个文档
        </p>
      </div>
    </div>
  )
}

// Draggable Document Component
const DraggableDocument = ({ document, onContextMenu }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: document.id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:bg-muted/50"
      onContextMenu={onContextMenu}
    >
      {/* 文档图标 */}
      <div className="mt-2">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      
      {/* 文档名称 */}
      <div className="mt-2 text-center">
        <p className="text-sm font-medium truncate w-full">{document.name}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {document.size}
        </p>
      </div>
    </div>
  )
}

// All Documents Content Component
function AllDocumentsContent() {
  const { toast } = useToast()
  const router = useRouter()
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [cascadeSelections, setCascadeSelections] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("uploadDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // 批量操作状态
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(0)
  const [bulkOperation, setBulkOperation] = useState<string>("")
  
  // 批量修改分组状态
  const [showBulkGroupDialog, setShowBulkGroupDialog] = useState(false)
  const [selectedTargetGroup, setSelectedTargetGroup] = useState("")

  // Access groups from the parent component
  const groups = mockGroups

  // Use the same documents data as the groups tab
  const allDocuments = mockDocuments.map(doc => {
    // 根据文档的category和名称找到对应的分组层级
    let groupName = doc.category
    let depth = 1
    
    // 特殊映射规则：根据文档名称和内容确定二级分组
    const documentGroupMapping: { [key: string]: string } = {
      // 安全标准 -> 电气安全
      "电气安全规范.pdf": "电气安全",
      
      // 安全标准 -> 机械安全
      "锅炉安全标准 2024.pdf": "机械安全",
      "安全培训材料.pptx": "机械安全", 
      "安全培训记录.xlsx": "机械安全",
      "安全防护指南.pdf": "机械安全",
      "应急预案.pdf": "机械安全",
      "环保排放标准.pdf": "机械安全",
      
      // 技术文档 -> 设备规格
      "技术规格说明书.docx": "设备规格",
      "工艺流程说明.pdf": "设备规格",
      "技术参数表.xlsx": "设备规格",
      "设备配置清单.xlsx": "设备规格",
      "技术改进方案.docx": "设备规格",
      
      // 技术文档 -> 操作手册
      "操作员手册.docx": "操作手册",
      
      // 维护保养 -> 设备维护
      "维护保养计划.xlsx": "设备维护",
      "设备维护手册.docx": "设备维护",
      "设备故障诊断手册.pdf": "设备维护",
      "维护记录表.xlsx": "设备维护",
      
      // 质量控制 -> 质量检测
      "质量控制手册.pdf": "质量检测",
      "检验测试报告.xlsx": "质量检测",
      "质量检测标准.docx": "质量检测",
      "质量审核报告.pdf": "质量检测",
      
      // 安装指南 -> 安装指南 (保持一级分组)
      "安装指南.pdf": "安装指南",
      
      // 检验规程 -> 检验规程 (保持一级分组)
      "检验规程手册.pdf": "检验规程",
      "测试标准.docx": "检验规程"
    }
    
    // 首先检查特殊映射
    if (documentGroupMapping[doc.name]) {
      groupName = documentGroupMapping[doc.name]
      depth = 2
    } else {
      // 查找文档所属的分组层级
      for (const topGroup of groups) {
        if (topGroup.name === doc.category) {
          groupName = doc.category
          depth = 1
          break
        }
        if (topGroup.children) {
          for (const subGroup of topGroup.children) {
            // 检查文档名称是否包含子分类关键词
            if (subGroup.name === doc.category || 
                doc.name.toLowerCase().includes(subGroup.name.toLowerCase()) ||
                (topGroup.name === doc.category && doc.name.toLowerCase().includes(subGroup.name.toLowerCase()))) {
              groupName = subGroup.name // 使用二级分类名称
              depth = 2
              break
            }
          }
        }
      }
    }
    
    return {
      ...doc,
      group: groupName, // 使用正确的分组名称
      depth: depth, // 使用正确的深度
    }
  })


  // 级联选择器渲染函数
  const renderCascadeSelects = () => {
    const selects = []
    
    // 第一个下拉菜单：始终显示所有顶级分组
    selects.push(
      <div key={0} className="space-y-2">
        <Label className="text-sm font-medium">
          分组筛选 1
        </Label>
        <Select
          value={cascadeSelections[0] || ""}
          onValueChange={(value) => {
            const newSelections = [value]
            setCascadeSelections(newSelections)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择第1级分组" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分组</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.name}>
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4" />
                  <span>{group.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {group.documentCount}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
    
    // 第二个下拉菜单：当第一个有选择且该分组有子分类时显示
    if (cascadeSelections[0] && cascadeSelections[0] !== "all") {
      const selectedGroup = groups.find(group => group.name === cascadeSelections[0])
      
      if (selectedGroup && selectedGroup.children && selectedGroup.children.length > 0) {
        // 如果第二个下拉菜单还没有选择，自动选择第一个选项
        if (!cascadeSelections[1] && selectedGroup.children.length > 0) {
          const firstChild = selectedGroup.children[0]
          const newSelections = [cascadeSelections[0], firstChild.name]
          setCascadeSelections(newSelections)
        }
        
        selects.push(
          <div key={1} className="space-y-2">
            <Label className="text-sm font-medium">
              分组筛选 2
            </Label>
            <Select
              value={cascadeSelections[1] || ""}
              onValueChange={(value) => {
                const newSelections = [cascadeSelections[0], value]
                setCascadeSelections(newSelections)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择第2级分组" />
              </SelectTrigger>
              <SelectContent>
                {selectedGroup.children.map((group) => (
                  <SelectItem key={group.id} value={group.name}>
                    <div className="flex items-center space-x-2">
                      <Folder className="h-4 w-4" />
                      <span>{group.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {group.documentCount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }
    }
    
    return selects
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "已导入已审核":
      case "已解析已审核":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "已解析未审核":
      case "已导入未审核":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "未解析":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已导入已审核":
      case "已解析已审核":
        return "bg-green-100 text-green-800"
      case "已解析未审核":
      case "已导入未审核":
        return "bg-yellow-100 text-yellow-800"
      case "未解析":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-4 w-4 text-red-500" />
      case "Word":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "Excel":
        return <FileText className="h-4 w-4 text-green-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  // Filter and sort documents
  const filteredDocuments = allDocuments
    .filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
      
      // 级联分组筛选逻辑
      let matchesGroup = true
      if (cascadeSelections.length > 0) {
        if (cascadeSelections[0] === "all") {
          matchesGroup = true
        } else if (cascadeSelections.length === 1) {
          // 只选择了第一级分组，需要匹配该分组下的所有文档（包括子分组）
          const selectedGroup = groups.find(g => g.name === cascadeSelections[0])
          if (selectedGroup) {
            // 匹配一级分组或该分组下的所有子分组
            const allSubGroupNames = selectedGroup.children ? selectedGroup.children.map(child => child.name) : []
            matchesGroup = doc.group === cascadeSelections[0] || allSubGroupNames.includes(doc.group)
          } else {
            matchesGroup = doc.group === cascadeSelections[0]
          }
        } else if (cascadeSelections.length === 2) {
          // 选择了第二级分组
          matchesGroup = doc.group === cascadeSelections[1]
        }
      }
      
      // 状态筛选逻辑
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter
      
      return matchesSearch && matchesGroup && matchesStatus
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a]
      let bValue = b[sortBy as keyof typeof b]
      
      if (sortBy === "uploadDate" || sortBy === "lastModified") {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(paginatedDocuments.map(doc => doc.id))
    } else {
      setSelectedDocuments([])
    }
  }

  const handleSelectDocument = (docId: number, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, docId])
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== docId))
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "请选择文档",
        description: "请先选择要操作的文档",
      })
      return
    }

    switch (action) {
      case "parse":
        setIsBulkProcessing(true)
        setBulkOperation("解析")
        setBulkProgress(0)
        toast({
          title: "批量解析",
          description: `正在解析 ${selectedDocuments.length} 个文档，请稍候...`,
        })
        // 模拟解析过程
        const parseInterval = setInterval(() => {
          setBulkProgress(prev => {
            if (prev >= 100) {
              clearInterval(parseInterval)
              setIsBulkProcessing(false)
              setBulkOperation("")
              toast({
                title: "解析完成",
                description: `成功解析 ${selectedDocuments.length} 个文档`,
              })
              return 100
            }
            return prev + 10
          })
        }, 200)
        break
      case "import":
        setIsBulkProcessing(true)
        setBulkOperation("导入")
        setBulkProgress(0)
        toast({
          title: "批量导入",
          description: `正在导入 ${selectedDocuments.length} 个文档，请稍候...`,
        })
        // 模拟导入过程
        const importInterval = setInterval(() => {
          setBulkProgress(prev => {
            if (prev >= 100) {
              clearInterval(importInterval)
              setIsBulkProcessing(false)
              setBulkOperation("")
              toast({
                title: "导入完成",
                description: `成功导入 ${selectedDocuments.length} 个文档`,
              })
              return 100
            }
            return prev + 8
          })
        }, 250)
        break
      case "download":
        toast({
          title: "下载文档",
          description: `正在下载 ${selectedDocuments.length} 个文档`,
        })
        break
      case "delete":
        toast({
          title: "删除文档",
          description: `正在删除 ${selectedDocuments.length} 个文档`,
        })
        break
      case "move":
        setShowBulkGroupDialog(true)
        break
    }
  }

  const handleBulkGroupChange = () => {
    if (selectedTargetGroup && selectedDocuments.length > 0) {
      toast({
        title: "批量修改分组",
        description: `已将 ${selectedDocuments.length} 个文档移动到分组: ${selectedTargetGroup}`,
      })
      setShowBulkGroupDialog(false)
      setSelectedTargetGroup("")
      setSelectedDocuments([])
    }
  }

  const handleDocumentAction = (docId: number, action: string) => {
    const doc = allDocuments.find(d => d.id === docId)
    if (!doc) return

    switch (action) {
      case "view":
        toast({
          title: "查看文档",
          description: `正在打开 ${doc.name}`,
        })
        break
      case "edit":
        toast({
          title: "编辑文档",
          description: `正在编辑 ${doc.name}`,
        })
        break
      case "download":
        toast({
          title: "下载文档",
          description: `正在下载 ${doc.name}`,
        })
        break
      case "delete":
        toast({
          title: "删除文档",
          description: `正在删除 ${doc.name}`,
        })
        break
      case "parse":
        toast({
          title: "解析文档",
          description: `正在解析 ${doc.name}`,
        })
        break
      case "review":
        // 跳转到审核页面
        router.push(`/documents/review/${docId}`)
        break
      case "import":
        toast({
          title: "导入文档",
          description: `正在导入 ${doc.name}`,
        })
        break
    }
  }

  return (
    <div className="space-y-6">

      {/* Filters and Search */}
      <Card>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">搜索文档</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="搜索文档名称、分类或上传者..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Cascade Group Filters */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-4">
                {renderCascadeSelects()}
              </div>
              {cascadeSelections.length > 0 && cascadeSelections[0] !== "all" && (
                <div className="text-sm text-muted-foreground">
                  当前筛选: {cascadeSelections.join(" > ")}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex-1 space-y-2">
              <Label>状态筛选</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="未解析">未解析</SelectItem>
                  <SelectItem value="已解析未审核">已解析未审核</SelectItem>
                  <SelectItem value="已解析已审核">已解析已审核</SelectItem>
                  <SelectItem value="已导入未审核">已导入未审核</SelectItem>
                  <SelectItem value="已导入已审核">已导入已审核</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedDocuments.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-blue-900">
              已选择 {selectedDocuments.length} 个文档
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("parse")}
                disabled={isBulkProcessing}
              >
                <FileText className="h-4 w-4 mr-2" />
                批量解析
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("import")}
                disabled={isBulkProcessing}
              >
                <Import className="h-4 w-4 mr-2" />
                批量导入
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("download")}
                disabled={isBulkProcessing}
              >
                <Download className="h-4 w-4 mr-2" />
                批量下载
              </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("move")}
                  disabled={isBulkProcessing}
                >
                  <Move className="h-4 w-4 mr-2" />
                  批量分组
                </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("delete")}
                className="text-red-600 hover:text-red-700"
                disabled={isBulkProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                批量删除
              </Button>
            </div>
          </div>
          
          {/* 进度显示 */}
          {isBulkProcessing && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  正在{bulkOperation} {selectedDocuments.length} 个文档...
                </span>
                <span className="text-muted-foreground">{bulkProgress}%</span>
              </div>
              <Progress value={bulkProgress} className="h-2" />
            </div>
          )}
        </div>
      )}

      {/* Documents List */}
      <Card>
        <CardContent className="p-0">
          {viewMode === "list" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4">
                      <Checkbox
                        checked={selectedDocuments.length === paginatedDocuments.length && paginatedDocuments.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                        <th className="text-left p-4">文档信息</th>
                        <th className="text-left p-4">状态</th>
                        <th className="text-left p-4">分组</th>
                        <th className="text-left p-4">上传者</th>
                        <th className="text-left p-4">上传时间</th>
                        <th className="text-left p-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedDocuments.includes(doc.id)}
                          onCheckedChange={(checked) => handleSelectDocument(doc.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {getFileTypeIcon(doc.type)}
                          <div>
                            <div 
                              className="font-medium cursor-pointer hover:text-primary hover:underline transition-colors"
                              onClick={() => router.push(`/documents/review/${doc.id}`)}
                            >
                              {doc.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {doc.type} • {doc.size} • v{doc.version}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(doc.status)}
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doc.group}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doc.uploadedBy}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {doc.uploadDate}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {/* 根据状态显示不同的操作按钮 */}
                          {doc.status === "未解析" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDocumentAction(doc.id, "parse")}
                              className="h-8"
                            >
                              <Play className="mr-1 h-3 w-3" />
                              解析
                            </Button>
                          )}
                          {(doc.status === "已解析未审核" || doc.status === "已导入未审核") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDocumentAction(doc.id, "review")
                              }}
                              className="h-8"
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              审核
                            </Button>
                          )}
                          {doc.status === "已解析已审核" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDocumentAction(doc.id, "import")}
                              className="h-8"
                            >
                              <Import className="mr-1 h-3 w-3" />
                              导入
                            </Button>
                          )}
                          
                          {/* 更多操作菜单 */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDocumentAction(doc.id, "view")}>
                                <Eye className="h-4 w-4 mr-2" />
                                查看
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDocumentAction(doc.id, "edit")}>
                                <Edit className="h-4 w-4 mr-2" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDocumentAction(doc.id, "download")}>
                                <Download className="h-4 w-4 mr-2" />
                                下载
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDocumentAction(doc.id, "delete")}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {paginatedDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={(checked) => handleSelectDocument(doc.id, checked as boolean)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDocumentAction(doc.id, "view")}>
                            <Eye className="h-4 w-4 mr-2" />
                            查看
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDocumentAction(doc.id, "edit")}>
                            <Edit className="h-4 w-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDocumentAction(doc.id, "download")}>
                            <Download className="h-4 w-4 mr-2" />
                            下载
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDocumentAction(doc.id, "delete")}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      {getFileTypeIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{doc.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {doc.type} • {doc.size}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Folder className="h-3 w-3" />
                        <span className="truncate">{doc.group}</span>
                      </div>
                      
                      
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{doc.uploadedBy}</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {doc.uploadDate}
                      </div>
                      
                      {/* 根据状态显示不同的操作按钮 */}
                      <div className="flex gap-2 pt-2">
                        {doc.status === "未解析" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDocumentAction(doc.id, "parse")}
                            className="h-7 text-xs flex-1"
                          >
                            <Play className="mr-1 h-3 w-3" />
                            解析
                          </Button>
                        )}
                        {(doc.status === "已解析未审核" || doc.status === "已导入未审核") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDocumentAction(doc.id, "review")
                            }}
                            className="h-7 text-xs flex-1"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            审核
                          </Button>
                        )}
                        {doc.status === "已解析已审核" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDocumentAction(doc.id, "import")}
                            className="h-7 text-xs flex-1"
                          >
                            <Import className="mr-1 h-3 w-3" />
                            导入
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            显示第 {startIndex + 1} - {Math.min(endIndex, filteredDocuments.length)} 条，
            共 {filteredDocuments.length} 条
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* 批量修改分组对话框 */}
      <Dialog open={showBulkGroupDialog} onOpenChange={setShowBulkGroupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>修改文档分组</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              已选择 {selectedDocuments.length} 个文档，请选择目标分组：
            </div>
            <div className="space-y-2">
              <Label>选择分组</Label>
              <Select value={selectedTargetGroup} onValueChange={setSelectedTargetGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="选择目标分组" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="机械安全">机械安全</SelectItem>
                  <SelectItem value="电气安全">电气安全</SelectItem>
                  <SelectItem value="工艺技术">工艺技术</SelectItem>
                  <SelectItem value="质量管理">质量管理</SelectItem>
                  <SelectItem value="待分组">待分组</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBulkGroupDialog(false)}>
                取消
              </Button>
              <Button onClick={handleBulkGroupChange} disabled={!selectedTargetGroup}>
                确认修改
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default function DocumentsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // Upload related states
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [selectedGroup, setSelectedGroup] = useState("待分组")
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [uploadContextGroup, setUploadContextGroup] = useState<string | null>(null) // 上传上下文分组
  const [uploadMode, setUploadMode] = useState<"file" | "link">("file") // 上传方式：文件上传或链接上传
  const [uploadLinks, setUploadLinks] = useState<string[]>([]) // 链接上传的URL列表
  const [currentLink, setCurrentLink] = useState("") // 当前输入的链接
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Group management states
  const [groups, setGroups] = useState(mockGroups)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupColor, setNewGroupColor] = useState("blue")
  
  // File manager states
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set([1, 2]))
  const [selectedFolder, setSelectedFolder] = useState<number | null>(1)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, item: any} | null>(null)
  const [renamingItem, setRenamingItem] = useState<{id: number, name: string} | null>(null)
  const [selectedFolders, setSelectedFolders] = useState<number[]>([])
  const [currentPath, setCurrentPath] = useState<number[]>([]) // 当前路径栈
  
  // Document categorization states
  const [selectedDocumentsForGroup, setSelectedDocumentsForGroup] = useState<number[]>([])
  const [showDocumentSelection, setShowDocumentSelection] = useState(false)
  const [activeTab, setActiveTab] = useState("all-documents")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Change group dialog states
  const [showGroupChangeDialog, setShowGroupChangeDialog] = useState(false)
  const [selectedGroupForChange, setSelectedGroupForChange] = useState("")
  
  // Move file dialog states
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [fileToMove, setFileToMove] = useState<any>(null)
  const [targetGroupForMove, setTargetGroupForMove] = useState("")
  
  // Modify group dialog states
  const [showModifyGroupDialog, setShowModifyGroupDialog] = useState(false)
  const [selectedTargetGroup, setSelectedTargetGroup] = useState("")
  const [cascadeSelections, setCascadeSelections] = useState<string[]>([])
  
  // 上传文档页面的级联选择状态
  const [uploadCascadeSelections, setUploadCascadeSelections] = useState<string[]>([])
  
  // Drag and drop states
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showHoverHint, setShowHoverHint] = useState(false)
  
  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const filteredDocuments = mockDocuments.filter((doc) => {
    const query = searchQuery.toLowerCase().trim()
    const nameMatch = doc.name.toLowerCase().includes(query)
    const numberMatch = getDocumentNumber(doc.id).toLowerCase().includes(query)
    const matchesSearch = query === "" || nameMatch || numberMatch
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    // 如果选中了特定分组，只显示该分组的文档
    const matchesSelectedFolder = !selectedFolder || doc.category === groups.find(g => g.id === selectedFolder)?.name

    return matchesSearch && matchesStatus && matchesCategory && matchesSelectedFolder
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredDocuments.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, categoryFilter])

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        closeContextMenu()
      }
    }
    
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id))
    } else {
      setSelectedDocuments([])
    }
  }

  const handleSelectDocument = (docId: number, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, docId])
    } else {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== docId))
    }
  }

  // Upload functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadFiles(prev => [...prev, ...files])
  }

  const handleRemoveFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Link upload functions
  const handleAddLink = () => {
    if (currentLink.trim() && !uploadLinks.includes(currentLink.trim())) {
      setUploadLinks(prev => [...prev, currentLink.trim()])
      setCurrentLink("")
    }
  }

  const handleRemoveLink = (index: number) => {
    setUploadLinks(prev => prev.filter((_, i) => i !== index))
  }

  const handleLinkUpload = () => {
    // Simulate link upload progress
    uploadLinks.forEach((link, index) => {
      const linkName = `链接文档_${index + 1}`
      setUploadProgress(prev => ({ ...prev, [linkName]: 0 }))
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[linkName] || 0
          if (current >= 100) {
            clearInterval(interval)
            return prev
          }
          return { ...prev, [linkName]: current + 10 }
        })
      }, 200)
    })

    // 模拟将链接文档添加到正确的分组
    if (uploadContextGroup) {
      const targetGroup = uploadCascadeSelections[uploadCascadeSelections.length - 1] || "待分组"
      // 这里可以添加实际的链接处理逻辑
      console.log("上传链接到分组:", targetGroup, uploadLinks)
    }

    // 清空链接列表
    setTimeout(() => {
      setUploadLinks([])
      setUploadProgress({})
    }, 2000)
  }

  const handleUpload = () => {
    // Simulate upload progress
    uploadFiles.forEach((file, index) => {
      const fileName = file.name
      setUploadProgress(prev => ({ ...prev, [fileName]: 0 }))
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[fileName] || 0
          if (current >= 100) {
            clearInterval(interval)
            return prev
          }
          return { ...prev, [fileName]: current + 10 }
        })
      }, 200)
    })

    // 模拟将文档添加到正确的分组
    if (uploadContextGroup) {
      // 这里可以添加逻辑将文档实际分配到 uploadContextGroup 分组
      console.log(`文档将上传到分组: ${uploadContextGroup}`)
    }

    // Clear files after upload
    setTimeout(() => {
      setUploadFiles([])
      setUploadProgress({})
      setUploadContextGroup(null) // 清除上传上下文
    }, 3000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Group management functions
  // 检查分组名称是否唯一
  const isGroupNameUnique = (name: string, excludeId?: number): boolean => {
    const checkInGroups = (groupList: any[]): boolean => {
      for (const group of groupList) {
        if (group.name === name && group.id !== excludeId) {
          return false
        }
        if (group.children && group.children.length > 0) {
          if (!checkInGroups(group.children)) {
            return false
          }
        }
      }
      return true
    }
    return checkInGroups(groups)
  }

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      // 检查分组名称是否唯一
      if (!isGroupNameUnique(newGroupName.trim())) {
        toast({
          title: "分组名称重复",
          description: "该分组名称已存在，请使用其他名称",
          variant: "destructive",
        })
        return
      }

      const newGroup = {
        id: groups.length + 1,
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        documentCount: 0,
        color: newGroupColor,
        parentId: currentPath.length > 0 ? currentPath[currentPath.length - 1] : null,
        children: []
      }
      
      // 如果当前在根目录，直接添加到顶级分组
      if (currentPath.length === 0) {
        setGroups([...groups, newGroup])
      } else {
        // 如果在子文件夹内，需要递归添加到对应的父分组
        const addToParentGroup = (groupList: any[], parentId: number, newGroup: any) => {
          return groupList.map(group => {
            if (group.id === parentId) {
              return {
                ...group,
                children: [...(group.children || []), newGroup]
              }
            }
            if (group.children) {
              return {
                ...group,
                children: addToParentGroup(group.children, parentId, newGroup)
              }
            }
            return group
          })
        }
        
        const parentId = currentPath[currentPath.length - 1]
        setGroups(prev => addToParentGroup(prev, parentId, newGroup))
      }
      
      setNewGroupName("")
      setNewGroupDescription("")
      setNewGroupColor("blue")
      setIsGroupDialogOpen(false)
    }
  }

  const handleEditGroup = (group: any) => {
    setEditingGroup(group)
    setNewGroupName(group.name)
    setNewGroupDescription(group.description)
    setNewGroupColor(group.color)
    setSelectedDocumentsForGroup([])
    setShowDocumentSelection(false)
    setIsGroupDialogOpen(true)
  }

  const handleUpdateGroup = () => {
    if (editingGroup && newGroupName.trim()) {
      // 检查分组名称是否唯一（排除当前编辑的分组）
      if (!isGroupNameUnique(newGroupName.trim(), editingGroup.id)) {
        toast({
          title: "分组名称重复",
          description: "该分组名称已存在，请使用其他名称",
          variant: "destructive",
        })
        return
      }

      setGroups(groups.map(group => 
        group.id === editingGroup.id 
          ? { ...group, name: newGroupName.trim(), description: newGroupDescription.trim(), color: newGroupColor }
          : group
      ))
      setEditingGroup(null)
      setNewGroupName("")
      setNewGroupDescription("")
      setNewGroupColor("blue")
      setIsGroupDialogOpen(false)
    }
  }

  const handleDeleteGroup = (groupId: number) => {
    setGroups(groups.filter(group => group.id !== groupId))
  }

  const handleCloseGroupDialog = () => {
    setIsGroupDialogOpen(false)
    setEditingGroup(null)
    setNewGroupName("")
    setNewGroupDescription("")
    setNewGroupColor("blue")
    setSelectedDocumentsForGroup([])
    setShowDocumentSelection(false)
  }

  // Document categorization functions
  const handleSelectDocumentForGroup = (docId: number, checked: boolean) => {
    if (checked) {
      setSelectedDocumentsForGroup([...selectedDocumentsForGroup, docId])
    } else {
      setSelectedDocumentsForGroup(selectedDocumentsForGroup.filter(id => id !== docId))
    }
  }

  const handleSelectAllDocumentsForGroup = (checked: boolean) => {
    if (checked) {
      setSelectedDocumentsForGroup(mockDocuments.map(doc => doc.id))
    } else {
      setSelectedDocumentsForGroup([])
    }
  }

  const handleCategorizeDocuments = () => {
    if (editingGroup && selectedDocumentsForGroup.length > 0) {
      // Update document categories
      const updatedDocuments = mockDocuments.map(doc => 
        selectedDocumentsForGroup.includes(doc.id) 
          ? { ...doc, category: editingGroup.name }
          : doc
      )
      
      // Update group document count
      const updatedGroups = groups.map(group => 
        group.id === editingGroup.id 
          ? { ...group, documentCount: group.documentCount + selectedDocumentsForGroup.length }
          : group
      )
      
      setGroups(updatedGroups)
      setSelectedDocumentsForGroup([])
      setShowDocumentSelection(false)
      console.log(`已将 ${selectedDocumentsForGroup.length} 个文档归类到分组 "${editingGroup.name}"`)
    }
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      gray: "bg-gray-100 text-gray-800 border-gray-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      red: "bg-red-100 text-red-800 border-red-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
      pink: "bg-pink-100 text-pink-800 border-pink-200",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  // File manager helper functions
  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const getFolderIcon = (folderId: number) => {
    return expandedFolders.has(folderId) ? FolderOpen : Folder
  }

  const getDocumentsInFolder = (folderId: number) => {
    return mockDocuments.filter(doc => doc.category === groups.find(g => g.id === folderId)?.name)
  }

  const handleContextMenu = (e: React.MouseEvent, item: any) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, item })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const handleRename = (item: any) => {
    setRenamingItem({ id: item.id, name: item.name })
    closeContextMenu()
  }

  const handleMove = (item: any) => {
    setFileToMove(item)
    setShowMoveDialog(true)
    closeContextMenu()
  }

  // 修改分组处理函数
  const handleModifyGroup = () => {
    if (selectedDocuments.length === 0 || !selectedTargetGroup) return
    
    // 更新选中文档的分组
    const updatedDocuments = mockDocuments.map(doc => 
      selectedDocuments.includes(doc.id) 
        ? { ...doc, category: selectedTargetGroup }
        : doc
    )
    
    // 这里可以添加实际的API调用来更新文档分组
    console.log(`已将 ${selectedDocuments.length} 个文档移动到分组: ${selectedTargetGroup}`)
    
    // 关闭对话框并清除选择
    setShowModifyGroupDialog(false)
    setSelectedDocuments([])
    setSelectedTargetGroup("")
    setCascadeSelections([])
  }

  const confirmMove = () => {
    if (fileToMove && targetGroupForMove) {
      // Update document category
      const updatedDocuments = mockDocuments.map(doc => 
        doc.id === fileToMove.id 
          ? { ...doc, category: targetGroupForMove }
          : doc
      )
      
      // Update group document counts
      const updatedGroups = groups.map(group => {
        if (group.name === fileToMove.category) {
          return { ...group, documentCount: Math.max(0, group.documentCount - 1) }
        } else if (group.name === targetGroupForMove) {
          return { ...group, documentCount: group.documentCount + 1 }
        }
        return group
      })
      
      setGroups(updatedGroups)
      console.log(`文档 "${fileToMove.name}" 已移动到分组 "${targetGroupForMove}"`)
      
      // Reset states
      setShowMoveDialog(false)
      setFileToMove(null)
      setTargetGroupForMove("")
    }
  }

  // 根据级联选择获取当前深度的分组选项
  const getCascadeGroupsAtDepth = (depth: number): any[] => {
    if (depth === 0) {
      return groups
    }
    
    // 根据前面的选择找到父分组
    let currentGroups = groups
    for (let i = 0; i < depth; i++) {
      const selectedGroupName = cascadeSelections[i]
      if (!selectedGroupName) return []
      
      const parentGroup = currentGroups.find(group => group.name === selectedGroupName)
      if (!parentGroup || !parentGroup.children) return []
      
      currentGroups = parentGroup.children
    }
    
    return currentGroups
  }

  // 获取当前路径对应的分组选项
  const getCurrentPathGroups = (): any[] => {
    if (currentPath.length === 0) {
      return groups
    }
    
    // 根据当前路径找到对应的分组
    let currentGroups = groups
    for (let i = 0; i < currentPath.length; i++) {
      const folderId = currentPath[i]
      const folder = currentGroups.find(group => group.id === folderId)
      if (!folder || !folder.children) return []
      currentGroups = folder.children
    }
    
    return currentGroups
  }

  // 递归查找分组
  const findGroupByName = (groupList: any[], name: string): any => {
    for (const group of groupList) {
      if (group.name === name) {
        return group
      }
      if (group.children && group.children.length > 0) {
        const found = findGroupByName(group.children, name)
        if (found) return found
      }
    }
    return null
  }

  // 渲染级联下拉菜单
  const renderCascadeSelects = () => {
    const selects = []
    
    // 第一个下拉菜单：始终显示所有顶级分组
    selects.push(
      <div key={0} className="space-y-2">
        <Label className="text-sm font-medium">
          选择分组 1
        </Label>
        <Select
          value={cascadeSelections[0] || ""}
          onValueChange={(value) => {
            const newSelections = [value]
            setCascadeSelections(newSelections)
            setSelectedTargetGroup(value)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择第1级分组" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.name}>
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4" />
                  <span>{group.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {group.documentCount}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
    
    // 第二个下拉菜单：当第一个有选择且该分组有子分类时显示
    if (cascadeSelections[0]) {
      const selectedGroup = groups.find(group => group.name === cascadeSelections[0])
      if (selectedGroup && selectedGroup.children && selectedGroup.children.length > 0) {
        // 如果第二个下拉菜单还没有选择，自动选择第一个选项
        if (!cascadeSelections[1] && selectedGroup.children.length > 0) {
          const firstChild = selectedGroup.children[0]
          const newSelections = [cascadeSelections[0], firstChild.name]
          setCascadeSelections(newSelections)
          setSelectedTargetGroup(firstChild.name)
        }
        
        selects.push(
          <div key={1} className="space-y-2">
            <Label className="text-sm font-medium">
              选择分组 2
            </Label>
            <Select
              value={cascadeSelections[1] || ""}
              onValueChange={(value) => {
                const newSelections = [cascadeSelections[0], value]
                setCascadeSelections(newSelections)
                setSelectedTargetGroup(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择第2级分组" />
              </SelectTrigger>
              <SelectContent>
                {selectedGroup.children.map((group) => (
                  <SelectItem key={group.id} value={group.name}>
                    <div className="flex items-center space-x-2">
                      <Folder className="h-4 w-4" />
                      <span>{group.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {group.documentCount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }
    }
    
    return selects
  }

  // 上传文档页面的级联下拉菜单渲染函数
  const renderUploadCascadeSelects = () => {
    const selects = []
    
    // 第一个下拉菜单：始终显示所有顶级分组
    selects.push(
      <div key={0} className="space-y-2">
        <Label className="text-sm font-medium">
          选择分组 1
        </Label>
        <Select
          value={uploadCascadeSelections[0] || ""}
          onValueChange={(value) => {
            const newSelections = [value]
            setUploadCascadeSelections(newSelections)
            setSelectedGroup(value)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择第1级分组" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.name}>
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4" />
                  <span>{group.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {group.documentCount}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
    
    // 第二个下拉菜单：当第一个有选择且该分组有子分类时显示
    if (uploadCascadeSelections[0]) {
      let selectedGroup = null
      if (uploadCascadeSelections[0] === "待分组") {
        // 待分组没有子分类
        return selects
      } else {
        selectedGroup = groups.find(group => group.name === uploadCascadeSelections[0])
      }
      
      if (selectedGroup && selectedGroup.children && selectedGroup.children.length > 0) {
        // 如果第二个下拉菜单还没有选择，自动选择第一个选项
        if (!uploadCascadeSelections[1] && selectedGroup.children.length > 0) {
          const firstChild = selectedGroup.children[0]
          const newSelections = [uploadCascadeSelections[0], firstChild.name]
          setUploadCascadeSelections(newSelections)
          setSelectedGroup(firstChild.name)
        }
        
        selects.push(
          <div key={1} className="space-y-2">
            <Label className="text-sm font-medium">
              选择分组 2
            </Label>
            <Select
              value={uploadCascadeSelections[1] || ""}
              onValueChange={(value) => {
                const newSelections = [uploadCascadeSelections[0], value]
                setUploadCascadeSelections(newSelections)
                setSelectedGroup(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择第2级分组" />
              </SelectTrigger>
              <SelectContent>
                {selectedGroup.children.map((group) => (
                  <SelectItem key={group.id} value={group.name}>
                    <div className="flex items-center space-x-2">
                      <Folder className="h-4 w-4" />
                      <span>{group.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {group.documentCount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }
    }
    
    return selects
  }

  // 判断当前文件夹是否为叶子节点（只有文档，没有子文件夹）
  const isCurrentFolderLeafNode = () => {
    const currentSubFolders = getCurrentSubFolders()
    return currentSubFolders.length === 0
  }

  const confirmRename = () => {
    if (renamingItem) {
      setGroups(prev => prev.map(group => 
        group.id === renamingItem.id 
          ? { ...group, name: renamingItem.name }
          : group
      ))
      setRenamingItem(null)
    }
  }

  const cancelRename = () => {
    setRenamingItem(null)
  }

  // Folder selection functions
  // 递归获取文件夹下的所有子项ID
  const getAllSubItemIds = (folderId: number): number[] => {
    const folder = findFolderById(groups, folderId)
    if (!folder) return []
    
    let allIds: number[] = []
    
    // 添加当前文件夹ID
    allIds.push(folderId)
    
    // 递归添加所有子文件夹ID
    if (folder.children) {
      for (const child of folder.children) {
        allIds.push(...getAllSubItemIds(child.id))
      }
    }
    
    return allIds
  }

  const handleSelectFolder = (folderId: number, checked: boolean) => {
    if (checked) {
      // 获取该文件夹及其所有子项的ID
      const allSubItemIds = getAllSubItemIds(folderId)
      setSelectedFolders(prev => {
        const newSelection = [...prev]
        allSubItemIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id)
          }
        })
        return newSelection
      })
    } else {
      // 取消选择时，只取消当前文件夹，子项保持原状态
      setSelectedFolders(prev => prev.filter(id => id !== folderId))
    }
  }

  const handleSelectAllFolders = (checked: boolean) => {
    if (checked) {
      // 递归获取所有文件夹ID
      const allFolderIds: number[] = []
      const getAllFolderIds = (folderList: any[]) => {
        folderList.forEach(folder => {
          allFolderIds.push(folder.id)
          if (folder.children) {
            getAllFolderIds(folder.children)
          }
        })
      }
      getAllFolderIds(groups)
      setSelectedFolders(allFolderIds)
    } else {
      setSelectedFolders([])
    }
  }

  const isAllFoldersSelected = () => {
    // 递归获取所有文件夹ID
    const allFolderIds: number[] = []
    const getAllFolderIds = (folderList: any[]) => {
      folderList.forEach(folder => {
        allFolderIds.push(folder.id)
        if (folder.children) {
          getAllFolderIds(folder.children)
        }
      })
    }
    getAllFolderIds(groups)
    return allFolderIds.length > 0 && allFolderIds.every(id => selectedFolders.includes(id))
  }

  // 进入文件夹
  const enterFolder = (folderId: number) => {
    setCurrentPath(prev => [...prev, folderId])
    setSelectedFolder(folderId)
  }

  // 返回上级目录
  const goBack = () => {
    if (currentPath.length > 0) {
      const newPath = [...currentPath]
      newPath.pop()
      setCurrentPath(newPath)
      setSelectedFolder(newPath.length > 0 ? newPath[newPath.length - 1] : null)
    }
  }

  // 递归查找文件夹
  const findFolderById = (folders: any[], folderId: number): any => {
    for (const folder of folders) {
      if (folder.id === folderId) {
        return folder
      }
      if (folder.children) {
        const found = findFolderById(folder.children, folderId)
        if (found) return found
      }
    }
    return null
  }

  // 获取当前路径的文件夹
  const getCurrentFolder = () => {
    if (currentPath.length === 0) return null
    const currentFolderId = currentPath[currentPath.length - 1]
    return findFolderById(groups, currentFolderId)
  }

  // 获取文件夹的完整路径（从根目录到目标文件夹）
  const getFolderPath = (folderId: number): string[] => {
    const path: string[] = []
    
    const findPath = (folderList: any[], targetId: number, currentPath: string[]): boolean => {
      for (const folder of folderList) {
        const newPath = [...currentPath, folder.name]
        if (folder.id === targetId) {
          path.push(...newPath)
          return true
        }
        if (folder.children && findPath(folder.children, targetId, newPath)) {
          return true
        }
      }
      return false
    }
    
    findPath(groups, folderId, [])
    return path
  }

  // 获取当前文件夹的子文件夹
  const getCurrentSubFolders = () => {
    const currentFolder = getCurrentFolder()
    if (currentFolder) {
      return currentFolder.children || []
    }
    // 在根目录时，显示所有顶级分组
    return groups
  }

  // 获取文档的实际分组名称（与AllDocumentsContent中的逻辑保持一致）
  const getDocumentGroupName = (doc: any) => {
    // 特殊映射规则：根据文档名称和内容确定二级分组
    const documentGroupMapping: { [key: string]: string } = {
      // 安全标准 -> 电气安全
      "电气安全规范.pdf": "电气安全",
      
      // 安全标准 -> 机械安全
      "锅炉安全标准 2024.pdf": "机械安全",
      "安全培训材料.pptx": "机械安全", 
      "安全培训记录.xlsx": "机械安全",
      "安全防护指南.pdf": "机械安全",
      "应急预案.pdf": "机械安全",
      "环保排放标准.pdf": "机械安全",
      
      // 技术文档 -> 设备规格
      "技术规格说明书.docx": "设备规格",
      "工艺流程说明.pdf": "设备规格",
      "技术参数表.xlsx": "设备规格",
      "设备配置清单.xlsx": "设备规格",
      "技术改进方案.docx": "设备规格",
      
      // 技术文档 -> 操作手册
      "操作员手册.docx": "操作手册",
      
      // 维护保养 -> 设备维护
      "维护保养计划.xlsx": "设备维护",
      "设备维护手册.docx": "设备维护",
      "设备故障诊断手册.pdf": "设备维护",
      "维护记录表.xlsx": "设备维护",
      
      // 质量控制 -> 质量检测
      "质量控制手册.pdf": "质量检测",
      "检验测试报告.xlsx": "质量检测",
      "质量检测标准.docx": "质量检测",
      "质量审核报告.pdf": "质量检测",
      
      // 安装指南 -> 安装指南 (保持一级分组)
      "安装指南.pdf": "安装指南",
      
      // 检验规程 -> 检验规程 (保持一级分组)
      "检验规程手册.pdf": "检验规程",
      "测试标准.docx": "检验规程"
    }
    
    // 首先检查特殊映射
    if (documentGroupMapping[doc.name]) {
      return documentGroupMapping[doc.name]
    }
    
    // 查找文档所属的分组层级
    for (const topGroup of groups) {
      if (topGroup.name === doc.category) {
        return doc.category
      }
      if (topGroup.children) {
        for (const subGroup of topGroup.children) {
          // 检查文档名称是否包含子分类关键词
          if (subGroup.name === doc.category || 
              doc.name.toLowerCase().includes(subGroup.name.toLowerCase()) ||
              (topGroup.name === doc.category && doc.name.toLowerCase().includes(subGroup.name.toLowerCase()))) {
            return subGroup.name // 使用二级分类名称
          }
        }
      }
    }
    
    return doc.category
  }

  // 获取当前路径下的文档
  const getCurrentDocuments = () => {
    const currentFolder = getCurrentFolder()
    if (currentFolder) {
      // 只有在没有子文件夹的叶子节点才显示文档
      const hasSubFolders = currentFolder.children && currentFolder.children.length > 0
      if (!hasSubFolders) {
        // 对于子文件夹，需要根据子文件夹的名称来过滤文档
        if (currentFolder.parentId) {
          // 子文件夹：根据文档的实际分组来过滤
          return mockDocuments.filter(doc => {
            const groupName = getDocumentGroupName(doc)
            return groupName === currentFolder.name
          })
        } else {
          // 顶级文件夹直接按名称过滤
          return mockDocuments.filter(doc => doc.category === currentFolder.name)
        }
      }
    }
    // 在根目录或有子文件夹的文件夹中，不显示文档
    return []
  }

  // Document action handlers
  const handleParseDocument = (docId: number) => {
    console.log(`开始解析文档 ${docId}`)
    // TODO: 实现解析逻辑
  }

  const handleReviewDocument = (docId: number) => {
    // 跳转到审核页面
    router.push(`/documents/review/${docId}`)
  }

  const handleImportDocument = (docId: number) => {
    console.log(`开始导入文档 ${docId}`)
    // TODO: 实现导入逻辑
  }

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    
    // Find the dragged item
    const item = getCurrentSubFolders().find(f => f.id.toString() === active.id) || 
                 getCurrentDocuments().find(d => d.id.toString() === active.id)
    setDraggedItem(item)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    // Clear all drag states first
    setActiveId(null)
    setDraggedItem(null)
    setDragOverId(null)
    setShowHoverHint(false)
    
    // Clear any pending hover timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    
    if (!over) {
      return
    }

    // Handle document to folder drop
    const draggedDoc = getCurrentDocuments().find(d => d.id.toString() === active.id)
    const targetFolder = getCurrentSubFolders().find(f => f.id.toString() === over.id)
    
    if (draggedDoc && targetFolder) {
      // Update document category
      const updatedDocuments = mockDocuments.map(doc => 
        doc.id === draggedDoc.id 
          ? { ...doc, category: targetFolder.name }
          : doc
      )
      
      // Update folder document count
      setGroups(prev => prev.map(group => 
        group.id === targetFolder.id 
          ? { ...group, documentCount: group.documentCount + 1 }
          : group
      ))
      console.log(`文档 "${draggedDoc.name}" 已移动到分组 "${targetFolder.name}"`)
    }
    // Handle folder reordering
    else if (active.id !== over.id) {
      const oldIndex = getCurrentSubFolders().findIndex(f => f.id.toString() === active.id)
      const newIndex = getCurrentSubFolders().findIndex(f => f.id.toString() === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newGroups = [...groups]
        const currentFolder = getCurrentFolder()
        
        if (currentFolder) {
          // Reorder within subfolder
          const updatedChildren = arrayMove(currentFolder.children || [], oldIndex, newIndex)
          const updatedFolder = { ...currentFolder, children: updatedChildren }
          setGroups(prev => prev.map(g => g.id === currentFolder.id ? updatedFolder : g))
        } else {
          // Reorder top-level folders
          const reorderedGroups = arrayMove(newGroups, oldIndex, newIndex)
          setGroups(reorderedGroups)
        }
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) {
      setDragOverId(null)
      // Clear any existing timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
      }
      setShowHoverHint(false)
      return
    }

    // Set visual feedback for drop target
    setDragOverId(over.id as string)
    
    // Check if dragging a document over a folder
    const draggedDoc = getCurrentDocuments().find(d => d.id.toString() === active.id)
    const targetFolder = getCurrentSubFolders().find(f => f.id.toString() === over.id)
    
    if (draggedDoc && targetFolder) {
      // Clear any existing timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
      
      // Show hover hint immediately
      setShowHoverHint(true)
      
      // Set a timeout to navigate to the folder after 1 second of hovering
      const timeout = setTimeout(() => {
        console.log(`自动跳转到分组: ${targetFolder.name}`)
        enterFolder(targetFolder.id)
        setHoverTimeout(null)
        setShowHoverHint(false)
        setDragOverId(null)
      }, 1000)
      
      setHoverTimeout(timeout)
    } else {
      // Clear timeout if not hovering over a valid target
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
      }
      setShowHoverHint(false)
    }
  }

  // Get action buttons based on document status
  const getActionButtons = (doc: any) => {
    const buttons = []
    
    switch (doc.status) {
      case "未解析":
        buttons.push(
          <Button
            key="parse"
            variant="outline"
            size="sm"
            onClick={() => handleParseDocument(doc.id)}
            className="h-8 shrink-0"
          >
            <Play className="mr-1 h-3 w-3" />
            解析
          </Button>
        )
        break
      case "已解析未审核":
        buttons.push(
          <Button
            key="review"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleReviewDocument(doc.id)
            }}
            className="h-8 shrink-0"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            审核
          </Button>
        )
        break
      case "已解析已审核":
        buttons.push(
          <Button
            key="import"
            variant="outline"
            size="sm"
            onClick={() => handleImportDocument(doc.id)}
            className="h-8 shrink-0"
          >
            <Import className="mr-1 h-3 w-3" />
            导入
          </Button>
        )
        break
      case "已导入未审核":
        buttons.push(
          <Button
            key="review"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleReviewDocument(doc.id)
            }}
            className="h-8 shrink-0"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            审核
          </Button>
        )
        break
      case "已导入已审核":
        // 已导入已审核的文档不需要额外操作按钮
        break
      default:
        break
    }
    
    return buttons
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="文档管理" subtitle="上传、组织和管理您的技术文档" />

        <main className="flex-1 overflow-auto p-6">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all-documents">所有文档</TabsTrigger>
            <TabsTrigger value="upload">上传文档</TabsTrigger>
            <TabsTrigger value="groups">文档分组</TabsTrigger>
          </TabsList>

            <TabsContent value="all-documents" className="space-y-6">
              <AllDocumentsContent />
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">上传文档</CardTitle>
                  <CardDescription>
                    向知识平台上传新文档，支持文件上传、链接上传和分组选择
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Group Selection - 级联下拉菜单 */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {renderUploadCascadeSelects()}
                    </div>
                    {uploadCascadeSelections.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        目标分组: {uploadCascadeSelections[uploadCascadeSelections.length - 1]}
                      </div>
                    )}
                  </div>

                  {/* Upload Mode Toggle */}
                  <div className="flex space-x-2">
                    <Button
                      variant={uploadMode === "file" ? "default" : "outline"}
                      onClick={() => setUploadMode("file")}
                      className="flex-1"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      文件上传
                    </Button>
                    <Button
                      variant={uploadMode === "link" ? "default" : "outline"}
                      onClick={() => setUploadMode("link")}
                      className="flex-1"
                    >
                      <Import className="mr-2 h-4 w-4" />
                      链接上传
                    </Button>
                  </div>

                  {/* Selected Files */}
                  {uploadMode === "file" && uploadFiles.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        已选择的文件 ({uploadFiles.length} 个)
                      </Label>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {uploadFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected Links */}
                  {uploadMode === "link" && uploadLinks.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        已添加的链接 ({uploadLinks.length} 个)
                      </Label>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {uploadLinks.map((link, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <File className="h-5 w-5 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{link}</p>
                                <p className="text-xs text-muted-foreground">链接文档</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveLink(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Area */}
                  {uploadMode === "file" ? (
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">批量上传文档</h3>
                      <p className="mt-2 text-muted-foreground">拖拽文件到此处，或点击浏览</p>
                      <p className="mt-1 text-sm text-muted-foreground">支持PDF、Word、Excel、PowerPoint和文本文件</p>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        选择文件
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Import className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">通过链接上传文档</h3>
                        <p className="mt-2 text-muted-foreground">输入文档链接，系统将自动获取并处理文档内容</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="请输入文档链接 (如: https://example.com/document.pdf)"
                          value={currentLink}
                          onChange={(e) => setCurrentLink(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                        />
                        <Button onClick={handleAddLink} disabled={!currentLink.trim()}>
                          <Plus className="mr-2 h-4 w-4" />
                          添加链接
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Upload Actions */}
                  {((uploadMode === "file" && uploadFiles.length > 0) || (uploadMode === "link" && uploadLinks.length > 0)) && (
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          if (uploadMode === "file") {
                            setUploadFiles([])
                          } else {
                            setUploadLinks([])
                          }
                        }}
                      >
                        清空选择
                      </Button>
                      <Button 
                        onClick={uploadMode === "file" ? handleUpload : handleLinkUpload}
                        disabled={(uploadMode === "file" && uploadFiles.length === 0) || (uploadMode === "link" && uploadLinks.length === 0)}
                      >
                        {uploadMode === "file" ? (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            开始上传
                          </>
                        ) : (
                          <>
                            <Import className="mr-2 h-4 w-4" />
                            开始上传
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium">上传进度</h4>
                      <div className="space-y-3">
                        {Object.entries(uploadProgress).map(([fileName, progress]) => (
                          <div key={fileName} className="flex items-center space-x-4 p-3 border rounded-lg">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{fileName}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Progress value={progress} className="flex-1 h-2" />
                                <span className="text-xs text-muted-foreground">{progress}%</span>
                              </div>
                            </div>
                            <Badge variant={progress === 100 ? "default" : "outline"}>
                              {progress === 100 ? "已完成" : "上传中"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <Card>
                <CardContent>

                  <div className="min-h-96 max-h-[800px] overflow-y-auto">
                    {/* 面包屑导航和操作按钮 */}
                    <div className="flex items-center justify-between mb-4">
                      {/* 面包屑导航 */}
                      <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={goBack}
                          disabled={currentPath.length === 0}
                          className="h-8 px-3"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          返回
                        </Button>
                        <div className="flex items-center space-x-1 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentPath([])
                              setSelectedFolder(null)
                            }}
                            className="h-6 px-2 text-sm font-medium"
                          >
                            <Folder className="h-4 w-4 mr-1" />
                            根目录
                          </Button>
                          {currentPath.length > 0 && (
                            <>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              {currentPath.map((folderId, index) => {
                                const folder = findFolderById(groups, folderId)
                                return (
                                  <div key={folderId} className="flex items-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newPath = currentPath.slice(0, index + 1)
                                        setCurrentPath(newPath)
                                        setSelectedFolder(folderId)
                                      }}
                                      className="h-6 px-2 text-sm"
                                    >
                                      <Folder className="h-4 w-4 mr-1" />
                                      {folder?.name}
                                    </Button>
                                    {index < currentPath.length - 1 && (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </div>
                                )
                              })}
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex items-center space-x-2">
                        {/* 只有在非叶子节点（多级分组目录）才显示新建分组按钮 */}
                        {!isCurrentFolderLeafNode() && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsGroupDialogOpen(true)}
                          >
                            <FolderPlus className="h-4 w-4 mr-2" />
                            新建分组
                          </Button>
                        )}
                        {/* 在叶子节点（纯文档文件夹）或根目录显示上传文档按钮 */}
                        {(isCurrentFolderLeafNode() || currentPath.length === 0) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // 获取当前文件夹名称作为上传上下文
                              const currentFolder = getCurrentFolder()
                              const contextGroup = currentFolder ? currentFolder.name : "待分组"
                              setUploadContextGroup(contextGroup)
                              setSelectedGroup(contextGroup)
                              // 设置级联选择状态
                              if (currentFolder) {
                                // 如果有当前文件夹，需要找到其完整路径
                                const path = getFolderPath(currentFolder.id)
                                setUploadCascadeSelections(path)
                              } else {
                                // 根目录默认到待分组
                                setUploadCascadeSelections(["待分组"])
                              }
                              setActiveTab("upload")
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            上传文档
                          </Button>
                        )}
                      </div>
                    </div>


                    {/* 拖拽上下文和文件夹文档网格 */}
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                    >
                      <SortableContext
                        items={[...getCurrentSubFolders().map(f => f.id.toString()), ...getCurrentDocuments().map(d => d.id.toString())]}
                        strategy={rectSortingStrategy}
                      >
                        {/* 当有子文件夹时显示网格布局 */}
                        {getCurrentSubFolders().length > 0 && (
                          <div className="grid grid-cols-4 gap-4">
                            {/* 显示子文件夹 */}
                            {getCurrentSubFolders().map((folder) => (
                              <DraggableFolder
                                key={folder.id}
                                folder={folder}
                                isSelected={selectedFolders.includes(folder.id)}
                                isRenaming={renamingItem?.id === folder.id ? renamingItem : null}
                                onRename={setRenamingItem}
                                onConfirmRename={confirmRename}
                                onCancelRename={cancelRename}
                                onSelect={(checked) => handleSelectFolder(folder.id, checked as boolean)}
                                onDoubleClick={() => enterFolder(folder.id)}
                                onContextMenu={(e) => handleContextMenu(e, folder)}
                                isDragOver={dragOverId === folder.id.toString()}
                              />
                            ))}
                          </div>
                        )}

                        {/* 当有文档时显示列表布局 */}
                        {getCurrentDocuments().length > 0 && (
                          <div className="space-y-4">

                            {/* 文档搜索和筛选 */}
                            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-background">
                              <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="在文件夹内搜索文档..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                              <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="状态筛选" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">所有状态</SelectItem>
                                  <SelectItem value="未解析">未解析</SelectItem>
                                  <SelectItem value="已解析未审核">已解析未审核</SelectItem>
                                  <SelectItem value="已解析已审核">已解析已审核</SelectItem>
                                  <SelectItem value="已导入未审核">已导入未审核</SelectItem>
                                  <SelectItem value="已导入已审核">已导入已审核</SelectItem>
                                  <SelectItem value="失败">失败</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* 批量操作栏 */}
                            {selectedDocuments.length > 0 && (
                              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <span className="text-sm font-medium text-blue-900">
                                  已选择 {selectedDocuments.length} 个文档
                                </span>
                                <div className="flex items-center space-x-2">
                                  <Button variant="outline" size="sm" className="h-8">
                                    <Download className="mr-2 h-4 w-4" />
                                    批量下载
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8"
                                    onClick={() => setShowModifyGroupDialog(true)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    修改分组
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    批量删除
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8"
                                    onClick={() => setSelectedDocuments([])}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    取消选择
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* 文档列表表格 */}
                            <div className="border rounded-lg">
                              <div className="grid grid-cols-21 gap-2 p-4 border-b bg-muted/50 font-medium text-sm">
                                <div className="col-span-1 w-8">
                                  <Checkbox
                                    checked={
                                      selectedDocuments.length === getCurrentDocuments().length && getCurrentDocuments().length > 0
                                    }
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedDocuments(getCurrentDocuments().map(doc => doc.id))
                                      } else {
                                        setSelectedDocuments([])
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-span-2">文档编号</div>
                                <div className="col-span-3 text-center">
                                  文档名称
                                </div>
                                <div className="col-span-2">分组</div>
                                <div className="col-span-2">类型</div>
                                <div className="col-span-2">大小</div>
                                <div className="col-span-2">状态</div>
                                <div className="col-span-2">上传日期</div>
                                <div className="col-span-2">上传者</div>
                                <div className="col-span-3">操作</div>
                              </div>

                              {getCurrentDocuments()
                                .filter((doc) => {
                                  const query = searchQuery.toLowerCase().trim()
                                  const nameMatch = doc.name.toLowerCase().includes(query)
                                  const numberMatch = getDocumentNumber(doc.id).toLowerCase().includes(query)
                                  const matchesSearch = query === "" || nameMatch || numberMatch
                                  const matchesStatus = statusFilter === "all" || doc.status === statusFilter
                                  return matchesSearch && matchesStatus
                                })
                                .map((doc) => (
                                <div
                                  key={doc.id}
                                  className="grid grid-cols-21 gap-2 p-4 border-b hover:bg-muted/30 transition-colors"
                                  onContextMenu={(e) => handleContextMenu(e, doc)}
                                >
                                  <div className="col-span-1 w-8">
                                    <Checkbox
                                      checked={selectedDocuments.includes(doc.id)}
                                      onCheckedChange={(checked) => handleSelectDocument(doc.id, checked as boolean)}
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-xs font-mono text-muted-foreground whitespace-nowrap">{getDocumentNumber(doc.id)}</p>
                                  </div>
                                  <div className="col-span-3">
                                    <div className="flex items-center space-x-3">
                                      <FileText className="h-5 w-5 text-muted-foreground" />
                                      <div>
                                        <p className="font-medium text-sm truncate">{doc.name}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {doc.category}
                                    </Badge>
                                  </div>
                                  <div className="col-span-2">
                                    <Badge variant="outline" className="text-xs">
                                      {doc.type}
                                    </Badge>
                                  </div>
                                  <div className="col-span-2 text-sm text-muted-foreground">{doc.size}</div>
                                  <div className="col-span-2">
                                    <div className="flex items-center space-x-2">
                                      {getStatusIcon(doc.status)}
                                      {getStatusBadge(doc.status)}
                                    </div>
                                  </div>
                                  <div className="col-span-2 text-sm text-muted-foreground">{doc.uploadDate}</div>
                                  <div className="col-span-2 text-sm text-muted-foreground truncate">{doc.uploadedBy}</div>
                                  <div className="col-span-3">
                                    <div className="flex items-center justify-end gap-1 flex-wrap">
                                      {getActionButtons(doc)}
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>
                                            <Eye className="mr-2 h-4 w-4" />
                                            预览
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <Download className="mr-2 h-4 w-4" />
                                            下载
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            编辑详情
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            删除
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </SortableContext>

                      {/* 拖拽覆盖层 */}
                      <DragOverlay>
                        {activeId && draggedItem ? (
                          <div className="relative flex flex-col items-center p-3 border rounded-lg bg-background shadow-lg">
                            {draggedItem.documentCount !== undefined ? (
                              // 文件夹
                              <>
                                <div className="mt-2">
                                  <Folder className="h-8 w-8 text-blue-500" />
                                </div>
                                <div className="mt-2 text-center">
                                  <p className="text-sm font-medium truncate w-full">{draggedItem.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {draggedItem.documentCount} 个文档
                                  </p>
                                </div>
                              </>
                            ) : (
                              // 文档
                              <>
                                <div className="mt-2">
                                  <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="mt-2 text-center">
                                  <p className="text-sm font-medium truncate w-full">{draggedItem.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {draggedItem.size}
                                  </p>
                                </div>
                              </>
                            )}
                            {/* 悬停提示 */}
                            {showHoverHint && draggedItem && !draggedItem.documentCount && (
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                  <span>悬停1秒自动跳转到文件夹</span>
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                    
                    {/* 空文件夹提示 */}
                    {getCurrentSubFolders().length === 0 && getCurrentDocuments().length === 0 && (
                      <div className="text-center py-12">
                        <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">此文件夹为空</h3>
                        <p className="mt-2 text-muted-foreground">
                          {currentPath.length === 0 ? '创建新分组或上传文档开始使用' : '双击文件夹进入或上传文档'}
                        </p>
                        {currentPath.length === 0 && (
                          <div className="mt-4 flex justify-center space-x-2">
                            <Button onClick={() => setIsGroupDialogOpen(true)}>
                              <FolderPlus className="mr-2 h-4 w-4" />
                              新建分组
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                // 根目录上传文档默认到待分组
                                setUploadContextGroup("待分组")
                                setSelectedGroup("待分组")
                                setUploadCascadeSelections(["待分组"])
                                setActiveTab("upload")
                              }}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              上传文档
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </main>
      </div>

      {/* Group Management Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={handleCloseGroupDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? '编辑分组' : '新建分组'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Group Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="groupName">分组名称</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="输入分组名称"
                />
              </div>
              <div>
                <Label htmlFor="groupDescription">分组描述</Label>
                <Input
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="输入分组描述"
                />
              </div>
              <div>
                <Label htmlFor="groupColor">分组颜色</Label>
                <Select value={newGroupColor} onValueChange={setNewGroupColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择颜色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gray">灰色</SelectItem>
                    <SelectItem value="blue">蓝色</SelectItem>
                    <SelectItem value="green">绿色</SelectItem>
                    <SelectItem value="orange">橙色</SelectItem>
                    <SelectItem value="purple">紫色</SelectItem>
                    <SelectItem value="red">红色</SelectItem>
                    <SelectItem value="yellow">黄色</SelectItem>
                    <SelectItem value="indigo">靛蓝</SelectItem>
                    <SelectItem value="pink">粉色</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Document Categorization (only for editing) */}
            {editingGroup && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">文档归类</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDocumentSelection(!showDocumentSelection)}
                  >
                    {showDocumentSelection ? '隐藏文档列表' : '选择文档归类'}
                  </Button>
                </div>
                
                {showDocumentSelection && (
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        checked={selectedDocumentsForGroup.length === mockDocuments.length && mockDocuments.length > 0}
                        onCheckedChange={handleSelectAllDocumentsForGroup}
                      />
                      <Label className="text-sm font-medium">全选文档</Label>
                    </div>
                    
                    <div className="space-y-2">
                      {mockDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                          <Checkbox
                            checked={selectedDocumentsForGroup.includes(doc.id)}
                            onCheckedChange={(checked) => handleSelectDocumentForGroup(doc.id, checked as boolean)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {doc.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    {selectedDocumentsForGroup.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            已选择 {selectedDocumentsForGroup.length} 个文档
                          </span>
                          <Button
                            size="sm"
                            onClick={handleCategorizeDocuments}
                          >
                            归类到分组
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCloseGroupDialog}>
                取消
              </Button>
              <Button 
                onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}
                disabled={!newGroupName.trim()}
              >
                {editingGroup ? '更新' : '创建'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 修改分组对话框 */}
      <Dialog open={showGroupChangeDialog} onOpenChange={setShowGroupChangeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              修改文档分组
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">已选择 {selectedDocuments.length} 个文档</p>
            <div>
              <Label className="text-sm font-medium mb-2 block">选择目标分组</Label>
              <Select value={selectedGroupForChange} onValueChange={setSelectedGroupForChange}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择分组" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowGroupChangeDialog(false)}>取消</Button>
            <Button onClick={() => {
              if (!selectedGroupForChange) return
              setShowGroupChangeDialog(false)
              setSelectedGroupForChange("")
              setSelectedDocuments([])
            }} disabled={!selectedGroupForChange}>确认修改</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 移动文件对话框 */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Move className="h-5 w-5" />
              移动文件
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fileToMove && (
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{fileToMove.name}</p>
                  <p className="text-xs text-muted-foreground">当前分组: {fileToMove.category}</p>
                </div>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium mb-2 block">选择目标分组</Label>
              <Select value={targetGroupForMove} onValueChange={setTargetGroupForMove}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择目标分组" />
                </SelectTrigger>
                <SelectContent>
                  {groups.filter(g => g.name !== fileToMove?.category).map((g) => (
                    <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => {
              setShowMoveDialog(false)
              setFileToMove(null)
              setTargetGroupForMove("")
            }}>取消</Button>
            <Button onClick={confirmMove} disabled={!targetGroupForMove}>确认移动</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 修改分组对话框 */}
      <Dialog open={showModifyGroupDialog} onOpenChange={setShowModifyGroupDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              修改文档分组
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              已选择 {selectedDocuments.length} 个文档，请选择目标分组：
            </p>
            
            {/* 级联分组选择区域 */}
            <div className="flex flex-wrap gap-4">
              {renderCascadeSelects()}
            </div>
            
            {selectedTargetGroup && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  目标分组: <span className="font-medium">{selectedTargetGroup}</span>
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowModifyGroupDialog(false)
                setSelectedTargetGroup("")
                setCascadeSelections([])
              }}
            >
              取消
            </Button>
            <Button 
              onClick={handleModifyGroup} 
              disabled={!selectedTargetGroup}
            >
              确认修改
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-background border rounded-md shadow-lg py-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={closeContextMenu}
        >
          <div className="w-48">
            <div 
              className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleRename(contextMenu.item)}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              重命名
            </div>
            <div className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
              <Copy className="mr-2 h-4 w-4" />
              复制
            </div>
            <div 
              className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleMove(contextMenu.item)}
            >
              <Move className="mr-2 h-4 w-4" />
              移动
            </div>
            <div className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

