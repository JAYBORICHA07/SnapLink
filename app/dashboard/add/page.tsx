"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { useBookmarkStore, useUserStore, useTeamStore } from "@/store"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  isPublic: z.boolean().default(false),
  teamId: z.string().optional(),
})

export default function AddBookmarkPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [aiSummary, setAiSummary] = useState("")
  
  const { addBookmark, loading, error } = useBookmarkStore()
  const { user } = useUserStore()
  const { teams, fetchTeams } = useTeamStore()

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      category: "",
      isPublic: false,
      teamId: "",
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
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to add a bookmark.",
      })
      return
    }
    
    try {
      // Prepare bookmark data
      const bookmarkData = {
        ...values,
        tags,
        aiSummary,
        userId: user.uid,
        isPublic: values.isPublic,
        category: values.category,
        teamId: values.teamId === "none" ? undefined : values.teamId,
      }
      
      // Add bookmark to the database
      await addBookmark(bookmarkData)
      
      toast({
        title: "Bookmark added",
        description: "Your bookmark has been added successfully.",
      })

      if (values.teamId) {
        router.push(`/dashboard/teams/${values.teamId}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error adding bookmark:", error)
      toast({
        variant: "destructive",
        title: "Failed to add bookmark",
        description: "There was an error adding your bookmark. Please try again.",
      })
    }
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

                {teams.length > 0 && (
                  <FormField
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Personal Bookmark</SelectItem>
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          If selected, this bookmark will be shared with the team
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Make Public</FormLabel>
                        <FormDescription>
                          Public bookmarks can be viewed by anyone with the link. Private bookmarks are only visible to you.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add Bookmark'
                  )}
                </Button>
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
                  <h3 className="font-medium mb-1">Organize with Tags</h3>
                  <p className="text-sm text-muted-foreground">
                    Add multiple tags to categorize your bookmarks and make them easier to find later.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Assign bookmarks to teams to share valuable resources with your colleagues.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">AI Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Let our AI generate a summary of the page content to help you remember why you saved it.
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

