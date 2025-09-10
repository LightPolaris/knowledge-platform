"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, HelpCircle, Sun, Moon, User } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface QAHeaderProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  onFeedbackClick?: () => void
  onNotificationClick?: () => void
}

const tabs = [
  { id: "intelligent-dialogue", label: "智能对话" },
  { id: "dialogue-history", label: "对话历史" }
]

export function QAHeader({
  activeTab = "intelligent-dialogue",
  onTabChange,
  onFeedbackClick,
  onNotificationClick
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
      <header className="bg-[#0060DF] border-b border-border px-6 py-4 h-[69px] flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* 左侧：标签页 */}
          <div className="flex items-center">
            <div className="flex space-x-6 items-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "text-base font-medium py-3 px-2 border-b-2 transition-all duration-200 whitespace-nowrap flex items-center hover:bg-white/20 rounded-t-md",
                    activeTab === tab.id
                      ? "text-white border-white"
                      : "text-white/80 border-transparent hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧：搜索和图标 */}
          <div className="flex items-center space-x-3">
            {/* 搜索栏 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="搜索文档、知识..." 
                className="pl-10 w-72 bg-white border-white/20 focus:border-white focus:ring-1 focus:ring-white/20 text-gray-900 placeholder:text-gray-500" 
              />
            </div>

            {/* 图标组 */}
            <div className="flex items-center space-x-1">
              {/* 通知 */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onNotificationClick}
                className="relative h-9 w-9 p-0 text-white hover:bg-white/20"
              >
                <Bell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* 帮助 */}
              <Button variant="ghost" size="sm" onClick={onFeedbackClick} className="h-9 w-9 p-0 text-white hover:bg-white/20">
                <HelpCircle className="h-4 w-4" />
              </Button>

              {/* 主题切换 */}
              <Button variant="ghost" size="sm" onClick={handleThemeToggle} className="h-9 w-9 p-0 text-white hover:bg-white/20">
                {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
              </Button>

              {/* 用户信息 */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-white/20">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-white">
                  <p className="text-sm font-medium">管理员</p>
                  <p className="text-xs text-white/80">admin@dongfang.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

