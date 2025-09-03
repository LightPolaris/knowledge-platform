"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, HelpCircle, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface QAHeaderProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const tabs = [
  { id: "intelligent-dialogue", label: "智能对话" },
  { id: "expert-optimization", label: "专家优化" },
  { id: "dialogue-history", label: "对话历史" }
]

export function QAHeader({
  activeTab = "intelligent-dialogue",
  onTabChange
}: QAHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId)
  }

  return (
    <div className="w-full">
      {/* 统一的导航栏 - 标题、标签页、搜索和图标在同一行 */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：标题和标签页 */}
          <div className="flex items-center space-x-8">
            {/* 标题部分 */}
            <div>
              <h1 className="font-serif font-bold text-2xl text-foreground text-balance">智能问答</h1>
              <p className="text-muted-foreground text-sm mt-1">基于AI的智能问答系统，快速获取知识解答</p>
            </div>

            {/* 标签页 */}
            <div className="flex space-x-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "text-sm font-medium px-4 py-2 rounded-t-lg border-t border-l border-r border-gray-200 transition-all duration-200 whitespace-nowrap",
                    activeTab === tab.id
                      ? "text-blue-600 bg-white relative z-10 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-50 -ml-px"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧：搜索和图标 */}
          <div className="flex items-center space-x-4">
            {/* 搜索栏 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索文档、知识..." className="pl-10 w-80 bg-input" />
            </div>

            {/* 通知 */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* 帮助 */}
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4" />
            </Button>

            {/* 主题切换 */}
            <Button variant="ghost" size="sm" onClick={handleThemeToggle}>
              {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </Button>
          </div>
        </div>
      </header>
    </div>
  )
}

