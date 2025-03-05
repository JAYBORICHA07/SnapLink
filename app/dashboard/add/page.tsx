"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Sparkles, X } from "lucide-react"

import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  isPublic: z.boolean().default(false),
})

export default function AddBookmarkPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [aiSummary, setAiSummary] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      category: "",
      isPublic: false,
    },
  })

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const generateAISummary = async () => {
    const url = form.getValues("url")
    if (!url) {
      toast({
        variant: "destructive",
        title: "URL required",
        description: "Please enter a URL to generate an AI summary.",
      })
      return
    }

    setIsGeneratingAI(true)

    // Simulate AI processing
    setTimeout(() => {
      setAiSummary(
        "This is an automatically generated summary of the content at the provided URL. It highlights key points and main topics covered in the article, making it easier to decide if the content is relevant to your needs.",
      )

      // Simulate AI tag suggestions
      if (tags.length === 0) {
        setTags(["ai-suggested", "documentation", "web-development"])
      }

      setIsGeneratingAI(false)

      toast({
        title: "AI Summary Generated",
        description: "The summary and tag suggestions have been generated successfully.",
      })
    }, 2000)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate saving bookmark
    console.log({
      ...values,
      tags,
      aiSummary,
    })

    toast({
      title: "Bookmark added",
      description: "Your bookmark has been added successfully.",
    })

    router.push("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="container px-4 md:px-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add Bookmark</h1>
          <p className="text-muted-foreground mt-1">Save a new bookmark to your collection</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>Enter the full URL including https://</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateAISummary}
                    disabled={isGeneratingAI || !form.getValues("url")}
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Auto-fill with AI
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Let AI fetch the title, generate a summary, and suggest tags
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Bookmark title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a brief description of this bookmark"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {aiSummary && (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">AI-Generated Summary</h3>
                    </div>
                    <p className="text-sm">{aiSummary}</p>
                  </div>
                )}

                <div>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tag} tag</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tags (press Enter or comma to add)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tags help you organize and find your bookmarks more easily
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Bookmark</Button>
                </div>
              </form>
            </Form>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
                <CardDescription>Make the most of your bookmarks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">AI Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the AI button to automatically generate a summary and suggested tags for your bookmark.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Organizing</h3>
                  <p className="text-sm text-muted-foreground">
                    Add relevant tags and select a category to make your bookmarks easier to find later.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    You can share bookmarks with your team after saving them by visiting the bookmark details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

