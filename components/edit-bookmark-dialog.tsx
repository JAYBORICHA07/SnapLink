"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useBookmarkStore, useUserStore } from "@/store"
import type { Bookmark } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  isPublic: z.boolean().default(false),
})

interface EditBookmarkDialogProps {
  bookmark: Bookmark | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBookmarkDialog({ bookmark, open, onOpenChange }: EditBookmarkDialogProps) {
  const { toast } = useToast()
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [aiSummary, setAiSummary] = useState("")

  const { updateBookmark, loading, error } = useBookmarkStore()
  const { user } = useUserStore()

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

  // Reset form when dialog opens with a new bookmark
  useEffect(() => {
    if (bookmark && open) {
      form.reset({
        url: bookmark.url,
        title: bookmark.title,
        description: bookmark.description || "",
        category: bookmark.category || "personal",
        isPublic: bookmark.isPublic,
      })
      
      setTags(bookmark.tags || [])
      setAiSummary(bookmark.aiSummary || "")
    }
  }, [bookmark, form, open])

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
    if (!bookmark || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing bookmark data or not authenticated.",
      })
      return
    }
    
    try {
      // Prepare bookmark data
      const bookmarkData = {
        ...values,
        tags,
        aiSummary,
        isPublic: values.isPublic,
        category: values.category,
      }
      
      // Update bookmark in the database
      await updateBookmark(bookmark.id, bookmarkData)
      
      toast({
        title: "Bookmark updated",
        description: "Your bookmark has been updated successfully.",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating bookmark:", error)
      toast({
        variant: "destructive",
        title: "Failed to update bookmark",
        description: "There was an error updating your bookmark. Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
          <DialogDescription>
            Update your bookmark details below
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
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
                size="sm"
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
              <p className="text-xs text-muted-foreground">
                Let AI generate a summary and suggest tags
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
                      className="resize-none max-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {aiSummary && (
              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">AI-Generated Summary</h3>
                </div>
                <p className="text-xs">{aiSummary}</p>
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
                <Button type="button" variant="outline" onClick={handleAddTag} size="sm">
                  Add
                </Button>
              </div>
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

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Make Public</FormLabel>
                    <FormDescription className="text-xs">
                      Public bookmarks can be viewed by anyone with the link
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 