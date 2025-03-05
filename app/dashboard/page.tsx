"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookmarkCard } from "@/components/bookmark-card"
import { PlusCircle, Grid, List, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

// Mock data for bookmarks
const mockBookmarks = [
  {
    id: "1",
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description: "The official Next.js documentation with guides and API reference.",
    tags: ["nextjs", "react", "documentation"],
    aiSummary:
      "Comprehensive guide to Next.js features including pages, routing, data fetching, and deployment options.",
    favicon: "https://nextjs.org/favicon.ico",
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
    userId: "user1",
    isPublic: true,
  },
  {
    id: "2",
    title: "Tailwind CSS Documentation",
    url: "https://tailwindcss.com/docs",
    description: "The official Tailwind CSS documentation.",
    tags: ["tailwind", "css", "documentation"],
    aiSummary:
      "Utility-first CSS framework documentation with class references, customization guides, and component examples.",
    favicon: "https://tailwindcss.com/favicon.ico",
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-10"),
    userId: "user1",
    isPublic: true,
  },
  {
    id: "3",
    title: "React Documentation",
    url: "https://react.dev",
    description: "The official React documentation.",
    tags: ["react", "javascript", "documentation"],
    aiSummary:
      "Learn React from the official documentation covering components, hooks, state management, and advanced patterns.",
    favicon: "https://react.dev/favicon.ico",
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2023-04-20"),
    userId: "user1",
    isPublic: true,
  },
  {
    id: "4",
    title: "TypeScript Documentation",
    url: "https://www.typescriptlang.org/docs/",
    description: "The official TypeScript documentation.",
    tags: ["typescript", "javascript", "documentation"],
    aiSummary:
      "TypeScript language documentation with type system explanations, interfaces, generics, and migration guides from JavaScript.",
    favicon: "https://www.typescriptlang.org/favicon.ico",
    createdAt: new Date("2023-07-05"),
    updatedAt: new Date("2023-07-05"),
    userId: "user1",
    isPublic: true,
  },
  {
    id: "5",
    title: "Vercel Platform Documentation",
    url: "https://vercel.com/docs",
    description: "Documentation for the Vercel platform.",
    tags: ["vercel", "deployment", "documentation"],
    aiSummary:
      "Vercel platform documentation covering deployments, serverless functions, environment variables, and integrations.",
    favicon: "https://vercel.com/favicon.ico",
    createdAt: new Date("2023-08-12"),
    updatedAt: new Date("2023-08-12"),
    userId: "user1",
    isPublic: true,
  },
  {
    id: "6",
    title: "Firebase Documentation",
    url: "https://firebase.google.com/docs",
    description: "Documentation for Firebase services.",
    tags: ["firebase", "database", "authentication"],
    aiSummary:
      "Firebase platform documentation covering Firestore, Authentication, Storage, and other Google Cloud services.",
    favicon: "https://firebase.google.com/favicon.ico",
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2023-09-01"),
    userId: "user1",
    isPublic: true,
  },
]

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBookmarks = mockBookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

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

          <TabsContent value="all" className="space-y-4">
            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bookmarks found. Try a different search term.</p>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}
              >
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} viewMode={viewMode} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {filteredBookmarks.slice(0, 3).map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} viewMode={viewMode} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {filteredBookmarks.slice(1, 4).map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} viewMode={viewMode} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shared" className="space-y-4">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {filteredBookmarks.slice(3, 6).map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} viewMode={viewMode} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

