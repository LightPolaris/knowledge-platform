"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  Bookmark,
  Clock,
  FileText,
  Network,
  User,
  Filter,
  History,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// Mock search results
const mockSearchResults = [
  {
    id: 1,
    title: "Boiler Safety Standards 2024",
    type: "document",
    content:
      "Comprehensive safety standards for boiler operations including temperature monitoring, pressure control, and emergency procedures...",
    source: "Safety Manual v2.1",
    relevance: 0.95,
    lastUpdated: "2024-01-15",
    category: "Safety Standards",
  },
  {
    id: 2,
    title: "Temperature Control Systems",
    type: "concept",
    content:
      "Advanced temperature control mechanisms for industrial boilers, including PID controllers and feedback systems...",
    source: "Technical Specifications",
    relevance: 0.87,
    lastUpdated: "2024-01-14",
    category: "Technical",
  },
  {
    id: 3,
    title: "Maintenance Schedule Q1 2024",
    type: "document",
    content:
      "Quarterly maintenance schedule including routine inspections, component replacements, and system upgrades...",
    source: "Maintenance Manual",
    relevance: 0.82,
    lastUpdated: "2024-01-13",
    category: "Maintenance",
  },
  {
    id: 4,
    title: "Zhang Wei - Safety Expert",
    type: "person",
    content:
      "Senior safety engineer with 15 years of experience in boiler safety protocols and regulatory compliance...",
    source: "Employee Directory",
    relevance: 0.76,
    lastUpdated: "2024-01-12",
    category: "Personnel",
  },
]

// Mock chat messages
const mockChatHistory = [
  {
    id: 1,
    type: "user",
    content: "What are the safety requirements for boiler temperature monitoring?",
    timestamp: "2024-01-15 14:30",
  },
  {
    id: 2,
    type: "assistant",
    content:
      "Based on the Boiler Safety Standards 2024, temperature monitoring requires:\n\n1. **Continuous monitoring** with sensors placed at critical points\n2. **Alarm systems** that trigger at 85% of maximum operating temperature\n3. **Automatic shutdown** procedures when temperature exceeds safe limits\n4. **Regular calibration** of temperature sensors every 6 months\n\nThese requirements are outlined in Section 3.2 of the Safety Manual v2.1.",
    timestamp: "2024-01-15 14:31",
    sources: ["Safety Manual v2.1", "Technical Specifications"],
    confidence: 0.92,
  },
  {
    id: 3,
    type: "user",
    content: "How often should pressure valves be inspected?",
    timestamp: "2024-01-15 14:35",
  },
  {
    id: 4,
    type: "assistant",
    content:
      "According to the maintenance guidelines, pressure valves should be inspected:\n\n• **Daily visual inspections** for obvious damage or leaks\n• **Weekly functional tests** to ensure proper operation\n• **Monthly detailed inspections** including pressure testing\n• **Annual comprehensive overhaul** with component replacement as needed\n\nThis schedule is detailed in the Maintenance Manual Section 4.3.",
    timestamp: "2024-01-15 14:36",
    sources: ["Maintenance Manual", "Quality Control Procedures"],
    confidence: 0.89,
  },
]

const getResultIcon = (type: string) => {
  switch (type) {
    case "document":
      return <FileText className="h-4 w-4 text-primary" />
    case "concept":
      return <Network className="h-4 w-4 text-secondary" />
    case "person":
      return <User className="h-4 w-4 text-accent" />
    default:
      return <Search className="h-4 w-4 text-muted-foreground" />
  }
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const [searchResults, setSearchResults] = useState(mockSearchResults)
  const [chatHistory, setChatHistory] = useState(mockChatHistory)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    type: "all",
    category: "all",
    dateRange: "all",
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    const userMessage = {
      id: chatHistory.length + 1,
      type: "user" as const,
      content: chatMessage,
      timestamp: new Date().toLocaleString(),
    }

    setChatHistory([...chatHistory, userMessage])
    setChatMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        type: "assistant" as const,
        content:
          "I understand your question about " +
          chatMessage +
          ". Let me search through the knowledge base to provide you with accurate information...",
        timestamp: new Date().toLocaleString(),
        sources: ["Technical Manual", "Safety Guidelines"],
        confidence: 0.85,
      }
      setChatHistory((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

  const filteredResults = searchResults.filter((result) => {
    const matchesType = selectedFilters.type === "all" || result.type === selectedFilters.type
    const matchesCategory = selectedFilters.category === "all" || result.category === selectedFilters.category
    return matchesType && matchesCategory
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Search & Q&A" subtitle="Find information and get AI-powered answers from your knowledge base" />

        <main className="flex-1 overflow-hidden">
          <Tabs defaultValue="search" className="h-full">
            <div className="border-b border-border px-6">
              <TabsList>
                <TabsTrigger value="search">Advanced Search</TabsTrigger>
                <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                <TabsTrigger value="history">Search History</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="search" className="flex-1 overflow-hidden">
              <div className="flex h-full">
                {/* Search Results Area */}
                <div className="flex-1 flex flex-col">
                  {/* Search Bar */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search documents, concepts, people..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                          className="pl-10 text-base"
                        />
                      </div>
                      <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? "Searching..." : "Search"}
                      </Button>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center space-x-4 mt-4">
                      <Select
                        value={selectedFilters.type}
                        onValueChange={(value) => setSelectedFilters({ ...selectedFilters, type: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="document">Documents</SelectItem>
                          <SelectItem value="concept">Concepts</SelectItem>
                          <SelectItem value="person">People</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedFilters.category}
                        onValueChange={(value) => setSelectedFilters({ ...selectedFilters, category: value })}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Safety Standards">Safety</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Personnel">Personnel</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                        <Filter className="mr-2 h-4 w-4" />
                        Advanced Filters
                        {showAdvancedFilters ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Date Range</label>
                            <Select
                              value={selectedFilters.dateRange}
                              onValueChange={(value) => setSelectedFilters({ ...selectedFilters, dateRange: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="week">Past Week</SelectItem>
                                <SelectItem value="month">Past Month</SelectItem>
                                <SelectItem value="year">Past Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">File Type</label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="pdf" />
                                <label htmlFor="pdf" className="text-sm">
                                  PDF
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="word" />
                                <label htmlFor="word" className="text-sm">
                                  Word
                                </label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Source</label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="manual" />
                                <label htmlFor="manual" className="text-sm">
                                  Manuals
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="specs" />
                                <label htmlFor="specs" className="text-sm">
                                  Specifications
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search Results */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Found {filteredResults.length} results {searchQuery && `for "${searchQuery}"`}
                        </p>
                        <Select defaultValue="relevance">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="relevance">Relevance</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {filteredResults.map((result) => (
                        <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                {getResultIcon(result.type)}
                                <CardTitle className="text-lg font-serif">{result.title}</CardTitle>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(result.relevance * 100)}% match
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Bookmark className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">{result.content}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center space-x-4">
                                <span>Source: {result.source}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {result.category}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Updated {result.lastUpdated}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assistant" className="flex-1 overflow-hidden">
              <div className="flex h-full">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {/* Chat Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold">AI Knowledge Assistant</h3>
                        <p className="text-sm text-muted-foreground">
                          Ask questions about your technical documentation
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      {chatHistory.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-3xl ${message.type === "user" ? "order-2" : "order-1"}`}>
                            <div
                              className={`p-4 rounded-lg ${
                                message.type === "user" ? "bg-primary text-primary-foreground ml-12" : "bg-muted mr-12"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              {message.type === "assistant" && message.sources && (
                                <div className="mt-3 pt-3 border-t border-border/20">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-muted-foreground">Sources:</span>
                                      {message.sources.map((source, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {source}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-muted-foreground">
                                        Confidence: {Math.round((message.confidence || 0) * 100)}%
                                      </span>
                                      <Button variant="ghost" size="sm">
                                        <ThumbsUp className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <ThumbsDown className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-4">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-3xl mr-12">
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                                <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Chat Input */}
                  <div className="p-6 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Ask a question about your knowledge base..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="pr-12"
                        />
                        <Button
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2"
                          onClick={handleSendMessage}
                          disabled={!chatMessage.trim() || isLoading}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Ask questions about safety procedures, technical specifications, maintenance schedules, and more.
                    </p>
                  </div>
                </div>

                {/* Chat Sidebar */}
                <div className="w-80 border-l border-border bg-background p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Suggested Questions</h4>
                      <div className="space-y-2">
                        {[
                          "What are the safety requirements for boiler operation?",
                          "How often should maintenance be performed?",
                          "What is the maximum operating temperature?",
                          "Who is responsible for safety inspections?",
                        ].map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start h-auto p-3 text-xs bg-transparent"
                            onClick={() => setChatMessage(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm mb-3">Recent Topics</h4>
                      <div className="space-y-2">
                        {["Safety Standards", "Temperature Control", "Pressure Valves", "Maintenance Schedule"].map(
                          (topic, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                            >
                              <MessageSquare className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{topic}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 overflow-hidden p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg mb-2">Search History</h3>
                  <p className="text-muted-foreground text-sm">Your recent searches and AI conversations</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-serif">Recent Searches</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { query: "boiler safety standards", time: "2 hours ago", results: 23 },
                          { query: "temperature monitoring", time: "1 day ago", results: 15 },
                          { query: "maintenance schedule", time: "2 days ago", results: 8 },
                          { query: "pressure valve inspection", time: "3 days ago", results: 12 },
                        ].map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded hover:bg-muted cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <History className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{search.query}</p>
                                <p className="text-xs text-muted-foreground">
                                  {search.results} results • {search.time}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-serif">AI Conversations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { topic: "Safety Requirements Discussion", time: "1 hour ago", messages: 6 },
                          { topic: "Maintenance Procedures Q&A", time: "1 day ago", messages: 4 },
                          { topic: "Technical Specifications Help", time: "2 days ago", messages: 8 },
                          { topic: "Emergency Protocols Inquiry", time: "4 days ago", messages: 3 },
                        ].map((conversation, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded hover:bg-muted cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{conversation.topic}</p>
                                <p className="text-xs text-muted-foreground">
                                  {conversation.messages} messages • {conversation.time}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
