"use client"

import { useState } from "react"
import Link from "next/link"
import { BookmarkIcon, ExternalLink, MoreHorizontal, Edit, Trash2, Share2, Heart, Copy, Sparkles } from "lucide-react"
import type { Bookmark } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface BookmarkCardProps {
  bookmark: Bookmark
  viewMode: "grid" | "list"
}

export function BookmarkCard({ bookmark, viewMode }: BookmarkCardProps) {
  const [showAiSummary, setShowAiSummary] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookmark.url)
    toast({
      title: "Link copied",
      description: "The bookmark URL has been copied to your clipboard.",
    })
  }

  const handleDelete = () => {
    toast({
      title: "Bookmark deleted",
      description: "The bookmark has been deleted successfully.",
    })
    setShowDeleteConfirm(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {bookmark.favicon ? (
              <img src={bookmark.favicon || "/placeholder.svg"} alt="" className="h-6 w-6" />
            ) : (
              <BookmarkIcon className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-base truncate">{bookmark.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="truncate max-w-[300px]">{bookmark.url}</span>
              <span>•</span>
              <span>{formatDate(bookmark.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="hidden md:flex gap-1">
            {bookmark.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{bookmark.tags.length - 2}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            <span className="sr-only">Favorite</span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Open link</span>
            </a>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowAiSummary(!showAiSummary)}>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>{showAiSummary ? "Hide" : "Show"} AI Summary</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/edit/${bookmark.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {showDeleteConfirm ? (
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium">Delete Bookmark?</p>
                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={handleCancelDelete}>
                      Cancel
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <DropdownMenuItem onSelect={(e) => {
                  e.preventDefault();
                  setShowDeleteConfirm(true);
                }}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {bookmark.favicon ? (
                <img src={bookmark.favicon || "/placeholder.svg"} alt="" className="h-5 w-5" />
              ) : (
                <BookmarkIcon className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-base line-clamp-1">{bookmark.title}</h3>
              <p className="text-xs text-muted-foreground">{formatDate(bookmark.createdAt)}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowAiSummary(!showAiSummary)}>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>{showAiSummary ? "Hide" : "Show"} AI Summary</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/edit/${bookmark.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {showDeleteConfirm ? (
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium">Delete Bookmark?</p>
                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={handleCancelDelete}>
                      Cancel
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <DropdownMenuItem onSelect={(e) => {
                  e.preventDefault();
                  setShowDeleteConfirm(true);
                }}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:underline line-clamp-1 flex items-center gap-1"
          >
            {bookmark.url}
            <ExternalLink className="h-3 w-3 inline" />
          </a>
          {bookmark.description && !showAiSummary && <p className="text-sm line-clamp-2">{bookmark.description}</p>}
          {showAiSummary && bookmark.aiSummary && (
            <div className="bg-muted p-3 rounded-md">
              <div className="flex items-center gap-1 text-xs font-medium mb-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>AI Summary</span>
              </div>
              <p className="text-sm">{bookmark.aiSummary}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-1 pt-1">
            {bookmark.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <div className="flex justify-between items-center w-full">
          <Button variant="ghost" size="sm" onClick={() => setShowAiSummary(!showAiSummary)}>
            <Sparkles className="mr-2 h-4 w-4" />
            {showAiSummary ? "Hide Summary" : "AI Summary"}
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Favorite</span>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open link</span>
              </a>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

