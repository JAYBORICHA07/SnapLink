"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookmarkIcon,
  Home,
  PlusCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Loader2,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/auth-provider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBookmarkStore, useTeamStore } from "@/store"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const { bookmarks, fetchBookmarks, loading: bookmarksLoading } = useBookmarkStore()
  const { teams, fetchTeams, loading: teamsLoading } = useTeamStore()

  useEffect(() => {
    setMounted(true)
    
    if (user) {
      fetchBookmarks()
      fetchTeams()
    }
  }, [user, fetchBookmarks, fetchTeams])

  if (!mounted) {
    return null
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Teams", href: "/dashboard/teams", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]
  
  // Predefined categories
  const categories = [
    { name: "Personal", href: "/dashboard/category/personal", id: "personal" },
    { name: "Work", href: "/dashboard/category/work", id: "work" },
    { name: "Learning", href: "/dashboard/category/learning", id: "learning" },
    { name: "Entertainment", href: "/dashboard/category/entertainment", id: "entertainment" },
  ]
  
  // Count bookmarks in each predefined category
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category.id] = bookmarks.filter(b => 
      b.category === category.id
    ).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-card pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BookmarkIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SnapLink</span>
            </Link>
          </div>
          <div className="px-4 mb-6">
            <Button asChild className="w-full justify-start gap-2">
              <Link href="/dashboard/add">
                <PlusCircle className="h-4 w-4" />
                Add Bookmark
              </Link>
            </Button>
          </div>
          <div className="px-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bookmarks..." className="pl-8" />
            </div>
          </div>
          <div className="mt-2 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}
                `}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="px-3 mt-6">
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</h3>
            <div className="mt-2 space-y-1">
              {bookmarksLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    className={`
                      group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md
                      ${pathname === category.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}
                    `}
                  >
                    <span>{category.name}</span>
                    <span className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full">
                      {categoryCounts[category.id] || 0}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
          <div className="px-3 mt-6">
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Teams</h3>
            <div className="mt-2 space-y-1">
              {teamsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : teams.length > 0 ? (
                teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/dashboard/teams/${team.id}`}
                    className={`
                      group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md
                      ${pathname === `/dashboard/teams/${team.id}` ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}
                    `}
                  >
                    <span>{team.name}</span>
                    <span className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full">
                      {team.members.length}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No teams yet
                </div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t p-4 mt-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center w-full justify-start">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user?.email?.split("@")[0] || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <BookmarkIcon className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">SnapLink</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2 px-2">
              <div className="mb-4">
                <Button asChild className="w-full justify-start gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/dashboard/add">
                    <PlusCircle className="h-4 w-4" />
                    Add Bookmark
                  </Link>
                </Button>
              </div>
              <nav className="space-y-1 px-2 mt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 px-2">
                <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</h3>
                <div className="mt-2 space-y-1">
                  {bookmarksLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={category.href}
                        className={`
                          group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md
                          ${pathname === category.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}
                        `}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{category.name}</span>
                        <span className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full">
                          {categoryCounts[category.id] || 0}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
              <div className="mt-6 px-2">
                <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Teams</h3>
                <div className="mt-2 space-y-1">
                  {teamsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : teams.length > 0 ? (
                    teams.map((team) => (
                      <Link
                        key={team.id}
                        href={`/dashboard/teams/${team.id}`}
                        className={`
                          group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md
                          ${pathname === `/dashboard/teams/${team.id}` ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}
                        `}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{team.name}</span>
                        <span className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full">
                          {team.members.length}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No teams yet
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.email?.split("@")[0] || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/dashboard/settings">
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => logout()}>
                  <LogOut className="mr-3 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="flex-1">
          <div className="py-6">
            <div className="flex items-center px-4 md:hidden mb-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open sidebar</span>
              </Button>
              <div className="ml-3 flex-1 flex justify-between items-center">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <BookmarkIcon className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">SnapLink</span>
                </Link>
                <ModeToggle />
              </div>
            </div>
            <div className="hidden md:flex md:justify-end md:px-8 mb-6">
              <ModeToggle />
            </div>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

