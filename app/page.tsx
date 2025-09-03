"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { QAHeader } from "@/components/qa-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  MessageSquare,
  Bot,
  User,
  Clock,
  Sparkles,
  RotateCcw,
  Plus,
  Globe,
  Brain,
  Zap,
  ChevronDown,
} from "lucide-react"

export default function QAPage() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [activeTab, setActiveTab] = useState("intelligent-dialogue")
  const [messages, setMessages] = useState<Array<{
    id: number;
    type: string;
    content: string;
    timestamp: string;
    feedback: string | null;
  }>>([
    {
      id: 1,
      type: "assistant",
      content: "您好！我是东方电气集团的智能助手。我可以帮您解答关于锅炉技术、安全规范、维护流程等方面的问题。请问有什么可以帮助您的吗？",
      timestamp: "11:04:30",
      feedback: null,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [deepThinkingEnabled, setDeepThinkingEnabled] = useState(false)
  const [selectedModel, setSelectedModel] = useState("deepseek")
  const [contextEnabled, setContextEnabled] = useState(true)

  const handleFeedback = (messageId: number, type: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, feedback: type }
        : msg
    ))
  }

  const handleSendMessage = () => {
    if (!question.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString(),
      feedback: null,
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setQuestion("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "assistant",
        content: `关于"${question}"的问题，我为您找到以下答案：\n\n根据东方电气集团的技术规范，关于这个问题的详细说明如下...\n\n建议您参考相关标准文件获取更详细的信息。`,
        timestamp: new Date().toLocaleTimeString(),
        feedback: null,
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

  return (
      <div className="flex h-screen bg-background">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <QAHeader 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

        <main className="flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="h-full flex flex-col">
            {activeTab === "intelligent-dialogue" && (
              <>
                {/* Chat Messages Area */}
                <div className="flex-1 p-6 bg-gray-50 min-h-0">
                  <div className="max-w-4xl mx-auto h-full">
                    {/* Chat Messages */}
                    <div className="h-full space-y-6 overflow-y-auto pb-6">
                            {messages.map((message) => (
                              <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                                {message.type === 'assistant' && (
                            <Avatar className="w-10 h-10 bg-green-100">
                              <AvatarFallback className="bg-green-600 text-white">
                                <Bot className="w-5 h-5" />
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                          <div className={`flex-1 max-w-[85%] ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                            <div className={`rounded-2xl p-4 ${
                                    message.type === 'user'
                                ? 'bg-blue-600 text-white ml-auto'
                                : 'bg-white border border-gray-200 shadow-sm'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>

                                    {/* Feedback buttons for assistant messages */}
                                    {message.type === 'assistant' && (
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                      className={`h-8 px-3 rounded-full ${message.feedback === 'thumbsUp' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
                                            onClick={() => handleFeedback(message.id, 'thumbsUp')}
                                          >
                                      <ThumbsUp className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                      className={`h-8 px-3 rounded-full ${message.feedback === 'thumbsDown' ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                                            onClick={() => handleFeedback(message.id, 'thumbsDown')}
                                          >
                                      <ThumbsDown className="w-4 h-4" />
                                          </Button>
                                        </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full text-gray-500 hover:text-gray-700">
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full text-gray-500 hover:text-gray-700">
                                      <Share className="w-4 h-4" />
                                          </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full text-gray-500 hover:text-gray-700">
                                      <MessageSquare className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                            <div className="text-xs text-gray-500 mt-2 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {message.timestamp}
                                  </div>
                                </div>
                                {message.type === 'user' && (
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gray-600 text-white">
                                <User className="w-5 h-5" />
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            ))}
                            {isLoading && (
                              <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10 bg-green-100">
                            <AvatarFallback className="bg-green-600 text-white">
                              <Bot className="w-5 h-5" />
                                  </AvatarFallback>
                                </Avatar>
                          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
                                  <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 animate-spin text-green-600" />
                                    <span className="text-sm">正在思考...</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                  </div>
                </div>

                {/* Bottom Input Area */}
                <div className="border-t border-gray-200 bg-white p-6 flex-shrink-0 min-h-[149px]">
                  <div className="max-w-4xl mx-auto">
                    <div className="space-y-4">
                      {/* Main Input Row */}
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                          <Input
                            placeholder="请输入您的问题，或从上方选择热门问题..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="h-12 text-base border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-0"
                          />
                        </div>
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={!question.trim() || isLoading}
                          className="h-12 w-12 rounded-xl bg-green-600 hover:bg-green-700 shadow-md"
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Bottom Controls Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {/* Model Selection */}
                          <div className="flex items-center space-x-1">
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                              <SelectTrigger className="w-36 h-8 border-0 bg-transparent text-sm font-medium">
                                <SelectValue placeholder="DeepSeek" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="deepseek">DeepSeek</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="r1">R1</SelectItem>
                                <SelectItem value="claude">Claude</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Deep Thinking Toggle */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeepThinkingEnabled(!deepThinkingEnabled)}
                            className={`h-8 px-3 rounded-full text-sm ${deepThinkingEnabled ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
                          >
                            <Brain className="w-4 h-4 mr-1" />
                            深度思考
                          </Button>

                          {/* New Chat Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMessages([messages[0]])}
                            className="h-8 px-3 rounded-full text-sm text-gray-600 hover:bg-gray-100"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            新开对话
                          </Button>

                          {/* More Options */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-xs text-gray-500">
                          内容由AI生成，仅供参考
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "expert-optimization" && (
              <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  <h3 className="font-serif font-bold text-lg mb-4">专家优化</h3>
                  <p className="text-muted-foreground">专家优化功能正在开发中...</p>
                </div>
              </div>
            )}

            {activeTab === "dialogue-history" && (
              <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  <h3 className="font-serif font-bold text-lg mb-4">对话历史</h3>
                  <p className="text-muted-foreground">对话历史功能正在开发中...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}