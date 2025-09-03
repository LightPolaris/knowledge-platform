"use client"

import React, { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ArrowLeft, Send, CheckCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function FeedbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 从URL参数获取消息ID和内容
  const messageId = searchParams.get('messageId')
  const messageContent = searchParams.get('content')
  
  const [feedbackForm, setFeedbackForm] = useState({
    description: '',
    category: 'none',
    isSubmitting: false,
    isSubmitted: false
  })

  const handleSubmit = async () => {
    if (!feedbackForm.description.trim()) return

    setFeedbackForm(prev => ({ ...prev, isSubmitting: true }))

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 这里通常会发送反馈到后端
    console.log('反馈已提交:', {
      messageId,
      description: feedbackForm.description,
      category: feedbackForm.category,
      messageContent,
      timestamp: new Date().toISOString()
    })

    setFeedbackForm(prev => ({ 
      ...prev, 
      isSubmitting: false,
      isSubmitted: true 
    }))

    // 2秒后自动返回
    setTimeout(() => {
      router.back()
    }, 2000)
  }

  const handleBack = () => {
    router.back()
  }

  if (feedbackForm.isSubmitted) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="反馈提交成功" subtitle="感谢您的宝贵意见" />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">反馈提交成功！</h2>
                  <p className="text-muted-foreground mb-6">
                    感谢您提供的宝贵反馈，我们将根据您的建议持续改进系统质量。
                    系统将在2秒后自动返回上一页面。
                  </p>
                  <Button onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    立即返回
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="提交反馈" subtitle="帮助我们改进AI回答质量" />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <CardTitle className="font-serif">提交详细反馈</CardTitle>
                </div>
                <CardDescription>
                  感谢您提供反馈！请详细描述您对这个答案的意见，这将帮助我们持续改进系统质量。
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 原始消息显示 */}
                {messageContent && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">您反馈的AI回答：</h4>
                    <p className="text-sm text-muted-foreground">
                      {decodeURIComponent(messageContent)}
                    </p>
                  </div>
                )}

                {/* 反馈描述 */}
                <div className="space-y-2">
                  <Label htmlFor="feedback-description">
                    反馈描述 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="feedback-description"
                    placeholder="请详细描述问题或建议，例如：答案不够准确、缺少相关信息、表述不够清晰等..."
                    value={feedbackForm.description}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    请尽量具体描述问题，这将帮助我们更准确地改进相关功能。
                  </p>
                </div>

                {/* 问题领域分类 */}
                <div className="space-y-2">
                  <Label htmlFor="feedback-category">问题领域（可选）</Label>
                  <Select
                    value={feedbackForm.category}
                    onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger id="feedback-category">
                      <SelectValue placeholder="请选择问题所属领域，不选择表示不指定领域" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">不指定领域</SelectItem>
                      <SelectItem value="boiler">锅炉技术</SelectItem>
                      <SelectItem value="safety">安全规范</SelectItem>
                      <SelectItem value="maintenance">设备维护</SelectItem>
                      <SelectItem value="diagnostic">故障诊断</SelectItem>
                      <SelectItem value="regulation">技术标准</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    指定领域将帮助我们更有针对性地改进相关内容，并分配给相应的技术专家处理。
                  </p>
                </div>

                {/* 反馈建议 */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">💡 反馈建议</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 具体描述问题，例如"答案中缺少了GB/T16507-2022标准的引用"</li>
                    <li>• 说明期望的改进方向，例如"希望增加更多实际案例"</li>
                    <li>• 避免简单的"答案不对"等模糊描述</li>
                  </ul>
                </div>

                {/* 隐私说明 */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    🔒 <strong>隐私保护：</strong>您的反馈将严格保密处理，仅用于系统改进，不会泄露给第三方。
                  </p>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={handleBack} disabled={feedbackForm.isSubmitting}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回
                  </Button>
                  
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!feedbackForm.description.trim() || feedbackForm.isSubmitting}
                    className="min-w-[120px]"
                  >
                    {feedbackForm.isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        提交反馈
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
