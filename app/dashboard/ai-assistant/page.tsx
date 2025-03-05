"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Sparkles, Send, User, Bookmark, Search, Tag, Clock, ThumbsUp, ThumbsDown } from "lucide-react"

// Mock data for AI assistant conversations
const mockConversation = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI assistant for SnapLink. I can help you manage your bookmarks, find information, and provide summaries. How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    role: "user",
    content: "Can you help me find all my bookmarks about React?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    role: "assistant",
    content: "I found 5 bookmarks related to React in your collection. Here are the top results:",
    bookmarks: [
      { id: "b1", title: "React Documentation", url: "https://reactjs.org/docs" },
      { id: "b2", title: "React Hooks Tutorial", url: "https://example.com/react-hooks" },
      { id: "b3", title: "Building React Applications", url: "https://example.com/react-apps" },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: "4",
    role: "user",
    content: "Summarize the React Hooks Tutorial bookmark for me",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "5",
    role: "assistant",
    content:
      "Here's a summary of the React Hooks Tutorial bookmark:\n\nThis tutorial covers the fundamentals of React Hooks, introduced in React 16.8. It explains how hooks let you use state and other React features without writing classes. The main hooks covered are useState, useEffect, useContext, useReducer, and useRef. The tutorial includes practical examples of each hook and best practices for implementing them in your applications.",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
  },
]

// Example suggested queries
const suggestedQueries = [
  "Find bookmarks about machine learning",
  "Summarize my most recent bookmark",
  "What are my most used tags?",
  "Find bookmarks I saved last week",
  "Recommend bookmarks based on my interests",
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(mockConversation)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, []) //Corrected useEffect dependency array

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      let aiResponse

      if (inputValue.toLowerCase().includes("find") || inputValue.toLowerCase().includes("search")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I found several bookmarks that match your query "${inputValue}":`,
          bookmarks: [
            { id: "b4", title: "Advanced JavaScript Techniques", url: "https://example.com/advanced-js" },
            { id: "b5", title: "Modern Web Development", url: "https://example.com/web-dev" },
            { id: "b6", title: "CSS Grid Layout Guide", url: "https://example.com/css-grid" },
          ],
          timestamp: new Date(),
        }
      } else if (inputValue.toLowerCase().includes("summarize") || inputValue.toLowerCase().includes("summary")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Here's a summary of the requested content:\n\nThis article discusses modern web development practices, focusing on performance optimization, accessibility, and responsive design. It covers techniques for reducing bundle sizes, implementing efficient rendering patterns, and ensuring websites work well across all devices and for all users. The article also touches on the importance of semantic HTML and ARIA attributes for creating inclusive web experiences.",
          timestamp: new Date(),
        }
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I've processed your request: "${inputValue}". Is there anything specific you'd like to know about your bookmarks or how I can help you organize them better?`,
          timestamp: new Date(),
        }
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query)
  }

  return (
    <DashboardLayout>
      <div className="container px-4 md:px-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground mt-1">Get help with your bookmarks using our AI-powered assistant</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">SnapLink Assistant</CardTitle>
                    <CardDescription>AI-powered bookmark assistant</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-8rem)] overflow-y-auto">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        <Avatar className="h-8 w-8 mt-1">
                          {message.role === "assistant" ? (
                            <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
                              <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </Avatar>
                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            {message.bookmarks && (
                              <div className="mt-2 space-y-2">
                                {message.bookmarks.map((bookmark) => (
                                  <div
                                    key={bookmark.id}
                                    className="flex items-center gap-2 rounded-md bg-background p-2"
                                  >
                                    <Bookmark className="h-4 w-4 text-primary" />
                                    <div className="overflow-hidden">
                                      <p className="font-medium truncate">{bookmark.title}</p>
                                      <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div
                            className={`text-xs text-muted-foreground mt-1 ${
                              message.role === "assistant" ? "text-left" : "text-right"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                            {message.role === "assistant" && (
                              <div className="flex gap-1 mt-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 mt-1">
                          <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                        </Avatar>
                        <div className="rounded-lg bg-muted p-3">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <div className="flex items-center w-full gap-2">
                  <Input
                    placeholder="Ask something about your bookmarks..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="icon">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Queries</CardTitle>
                <CardDescription>Try asking the AI assistant these questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => handleSuggestedQuery(query)}
                    >
                      <div className="flex gap-2 items-center">
                        {index === 0 && <Search className="h-4 w-4 text-muted-foreground" />}
                        {index === 1 && <Sparkles className="h-4 w-4 text-muted-foreground" />}
                        {index === 2 && <Tag className="h-4 w-4 text-muted-foreground" />}
                        {index === 3 && <Clock className="h-4 w-4 text-muted-foreground" />}
                        {index === 4 && <Bookmark className="h-4 w-4 text-muted-foreground" />}
                        <span>{query}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Capabilities</CardTitle>
                <CardDescription>What the AI assistant can do for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Search className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Smart Search</p>
                      <p className="text-xs text-muted-foreground">Find bookmarks using natural language</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Content Summarization</p>
                      <p className="text-xs text-muted-foreground">Get AI-generated summaries of your bookmarks</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Tag className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Tag Suggestions</p>
                      <p className="text-xs text-muted-foreground">Get AI-recommended tags for better organization</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Time-Based Filtering</p>
                      <p className="text-xs text-muted-foreground">Find bookmarks from specific time periods</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

