"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, HelpCircle, Sun, Moon } from "lucide-react"
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
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="font-serif font-bold text-2xl text-foreground text-balance">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜索文档、知识..." className="pl-10 w-80 bg-input" />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative" onClick={handleNotificationClick}>
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={handleThemeToggle}>
            {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          </Button>
        </div>
      </div>
    </header>
  )
}
