"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookmarkCard } from "@/components/bookmark-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import {
  PlusCircle,
  Search,
  UserPlus,
  Settings,
  MoreHorizontal,
  Grid,
  List,
  SlidersHorizontal,
  Mail,
  Shield,
  UserX,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

// Mock data for team details
const mockTeamDetails = {
  id: "1",
  name: "Design Team",
  description: "Team for design resources and inspiration",
  createdAt: new Date("2023-05-10"),
  members: [
    { id: "user1", name: "Alex Johnson", email: "alex@example.com", role: "admin", avatarUrl: "" },
    { id: "user2", name: "Sam Wilson", email: "sam@example.com", role: "editor", avatarUrl: "" },
    { id: "user3", name: "Taylor Kim", email: "taylor@example.com", role: "viewer", avatarUrl: "" },
    { id: "user4", name: "Jordan Lee", email: "jordan@example.com", role: "editor", avatarUrl: "" },
    { id: "user5", name: "Casey Smith", email: "casey@example.com", role: "viewer", avatarUrl: "" },
  ],
}

// Mock data for bookmarks
const mockBookmarks = [
  {
    id: "1",
    title: "Design System Guidelines",
    url: "https://example.com/design-system",
    description: "Our company's design system documentation and guidelines.",
    tags: ["design", "guidelines", "ui"],
    aiSummary: "Comprehensive guide to the design system including color palettes, typography, and component usage.",
    favicon: "",
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
    userId: "user1",
    teamId: "1",
    isPublic: true,
  },
  {
    id: "2",
    title: "UI Inspiration Collection",
    url: "https://example.com/ui-inspiration",
    description: "Collection of UI design inspiration from various sources.",
    tags: ["design", "inspiration", "ui"],
    aiSummary: "Curated collection of UI design examples and patterns from top websites and applications.",
    favicon: "",
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-10"),
    userId: "user2",
    teamId: "1",
    isPublic: true,
  },
  {
    id: "3",
    title: "Color Theory Guide",
    url: "https://example.com/color-theory",
    description: "Comprehensive guide to color theory for designers.",
    tags: ["design", "color", "theory"],
    aiSummary:
      "In-depth guide to color theory including color psychology, harmony, and practical applications in design.",
    favicon: "",
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2023-04-20"),
    userId: "user3",
    teamId: "1",
    isPublic: true,
  },
]

export default function TeamDetailsPage() {
  const params = useParams()
  const teamId = params.id as string
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")

  // In a real app, we would fetch the team details and bookmarks based on the teamId
  const team = mockTeamDetails

  const filteredBookmarks = mockBookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleInviteMember = () => {
    if (!inviteEmail) return

    // Simulate inviting a member
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}.`,
    })

    setInviteEmail("")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-primary text-primary-foreground"
      case "editor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DashboardLayout>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
            <p className="text-muted-foreground mt-1">{team.description}</p>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Invite team member</h4>
                    <p className="text-sm text-muted-foreground">Invite a new member to join the {team.name} team.</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      placeholder="Enter member's email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setInviteEmail("")}>
                      Cancel
                    </Button>
                    <Button onClick={handleInviteMember}>Send Invitation</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Team Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Team Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Manage Permissions</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Leave Team</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="bookmarks">
          <TabsList className="mb-6">
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="members">Members ({team.members.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team bookmarks..."
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

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage members and their permissions in the {team.name} team.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(member.role)}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Send Message</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Change Role</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <UserX className="mr-2 h-4 w-4" />
                              <span>Remove from Team</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Recent actions and changes in the {team.name} team.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <UserPlus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Alex Johnson</span> added{" "}
                        <span className="font-medium">Casey Smith</span> to the team
                      </p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <PlusCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Sam Wilson</span> added a new bookmark:{" "}
                        <span className="font-medium">UI Inspiration Collection</span>
                      </p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Settings className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Alex Johnson</span> updated team settings
                      </p>
                      <p className="text-xs text-muted-foreground">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <PlusCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Taylor Kim</span> added a new bookmark:{" "}
                        <span className="font-medium">Color Theory Guide</span>
                      </p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

