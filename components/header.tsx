"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, HelpCircle, Sun, Moon, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title = "仪表板", subtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleNotificationClick = () => {
    router.push("/notifications")
  }

  return (
    <header className="bg-[#0060DF] border-b border-border px-6 py-4 h-[69px] flex items-center">
      <div className="w-full flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="font-serif font-bold text-lg text-white text-balance">{title}</h1>
          {subtitle && <p className="text-white/80 text-sm mt-1">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="搜索文档、知识..." 
              className="pl-10 w-72 bg-white border-white/20 focus:border-white focus:ring-1 focus:ring-white/20 text-gray-900 placeholder:text-gray-500" 
            />
          </div>

          {/* Icon Group */}
          <div className="flex items-center space-x-1">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 text-white hover:bg-white/20" onClick={handleNotificationClick}>
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* Help */}
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white hover:bg-white/20">
              <HelpCircle className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white hover:bg-white/20" onClick={handleThemeToggle}>
              {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </Button>

            {/* User Profile */}
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
  )
}
