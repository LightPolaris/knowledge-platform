"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Network,
  Search,
  MessageSquare,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  UserCircle,
  Shield,
  Cloud,
  Workflow,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const navigation = [
  { name: "智能问答", href: "/", icon: MessageSquare },
  { name: "知识搜索", href: "/search", icon: Search },
  { name: "知识图谱", href: "/knowledge-graph", icon: Network },
  { name: "文件对比", href: "/compare", icon: GitCompare },
  { name: "文档管理", href: "/documents", icon: FileText },
  { name: "个人知识库", href: "/personal-library", icon: Cloud },
  { name: "个人中心", href: "/profile", icon: UserCircle },
  { name: "流程处理", href: "/workflow", icon: Workflow },
  { name: "权限管理", href: "/permissions", icon: Shield },
  { name: "系统设置", href: "/settings", icon: Settings },
]

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-48",
        className,
      )}
      data-testid="sidebar"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-[69px] bg-[#0060DF]">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="知识平台" 
                width={32} 
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-serif font-bold text-white text-sm">知识平台</h1>
              <p className="text-xs text-white/80">东方电气</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0 text-white hover:bg-white/20" data-testid="sidebar-collapse">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2" data-testid="sidebar-nav">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed ? "px-2" : "px-3",
                  pathname === item.href && "bg-[#0060DF] text-white",
                )}
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                {!collapsed && <span className="text-sm">{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>


      </ScrollArea>

    </div>
  )
}
