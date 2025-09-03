"use client"

import { useState } from "react"
import Link from "next/link"
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
  { name: "个人知识库（云文档）", href: "/upload", icon: Cloud },
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
        collapsed ? "w-16" : "w-64",
        className,
      )}
      data-testid="sidebar"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Network className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sidebar-foreground text-sm">知识平台</h1>
              <p className="text-xs text-muted-foreground">东方电气</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0" data-testid="sidebar-collapse">
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
                  pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                {!collapsed && <span className="text-sm">{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>


      </ScrollArea>

      {/* User Profile */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "px-2" : "px-3",
          )}
        >
          <div className="w-6 h-6 bg-sidebar-primary rounded-full flex items-center justify-center mr-3">
            <User className="h-3 w-3 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">管理员</p>
              <p className="text-xs text-muted-foreground">admin@dongfang.com</p>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
