"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookmarkCard } from "@/components/bookmark-card"
import { PlusCircle, Grid, List, Search, SlidersHorizontal, Loader2 } from "lucide-react"
import Link from "next/link"
import { useBookmarkStore } from "@/store"
import { useAuth } from "@/components/auth-provider"

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  
  const { bookmarks, loading, error, fetchBookmarks } = useBookmarkStore()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user, fetchBookmarks])

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const recentBookmarks = [...bookmarks]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)

  const favoriteBookmarks = bookmarks.filter(bookmark => favorites.includes(bookmark.id))
  
  const sharedBookmarks = bookmarks.filter(bookmark => bookmark.isPublic)

  return (
    <DashboardLayout>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your bookmarks and discover new content</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Bookmark
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks by title, tags, or description..."
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

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Bookmarks</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading bookmarks...</span>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-4">
                {filteredBookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "No bookmarks found. Try a different search term." 
                        : "You haven't added any bookmarks yet. Click the 'Add Bookmark' button to get started."}
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
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                {recentBookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No recent bookmarks found.</p>
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                    {recentBookmarks.map((bookmark) => (
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
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4">
                {favoriteBookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      You haven't favorited any bookmarks yet. Click the heart icon on a bookmark to add it to favorites.
                    </p>
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                    {favoriteBookmarks.map((bookmark) => (
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
              </TabsContent>

              <TabsContent value="shared" className="space-y-4">
                {sharedBookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      You haven't shared any bookmarks yet. Make a bookmark public to see it here.
                    </p>
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                    {sharedBookmarks.map((bookmark) => (
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
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

