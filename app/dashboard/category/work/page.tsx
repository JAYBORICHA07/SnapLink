"use client"

import { useState, useEffect } from "react"
import { useBookmarkStore } from "@/store"
import DashboardLayout from "@/components/dashboard-layout"
import { BookmarkCard } from "@/components/bookmark-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Grid, List, Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function WorkCategoryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  
  const { bookmarks, loading, error, fetchBookmarks, getBookmarksByCategory } = useBookmarkStore()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user, fetchBookmarks])

  const categoryBookmarks = getBookmarksByCategory("work")
  
  const filteredBookmarks = categoryBookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work</h1>
          <p className="text-muted-foreground mt-1">Your work-related bookmarks</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in work bookmarks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-muted" : ""}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading bookmarks...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "No work bookmarks found. Try a different search term." 
                  : "You haven't added any work bookmarks yet."}
              </p>
            </div>
          ) : (
            <div
              className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}
            >
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard 
                  key={bookmark.id} 
                  bookmark={bookmark} 
                  viewMode={viewMode} 
                  onToggleFavorite={(id) => {
                    if (favorites.includes(id)) {
                      setFavorites(favorites.filter(favId => favId !== id))
                    } else {
                      setFavorites([...favorites, id])
                    }
                  }}
                  isFavorite={favorites.includes(bookmark.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 