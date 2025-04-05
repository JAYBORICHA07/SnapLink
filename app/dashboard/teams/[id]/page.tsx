"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
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
  Loader2,
  Trash2,
  Check,
  BookmarkIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTeamStore, useUserStore, useBookmarkStore } from "@/store"
import type { TeamMember } from "@/lib/types"

export default function TeamDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params.id as string
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("viewer")
  const [isInviting, setIsInviting] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [memberToUpdate, setMemberToUpdate] = useState<{userId: string, currentRole: TeamMember["role"]} | null>(null)
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)
  
  const { teams, loading, error, fetchTeams, addMember, removeMember, updateMemberRole, deleteTeam } = useTeamStore()
  const { bookmarks, fetchBookmarks } = useBookmarkStore()
  const { user } = useUserStore()

  useEffect(() => {
    fetchTeams()
    fetchBookmarks()
  }, [fetchTeams, fetchBookmarks])

  // Find the team in the store
  const team = useMemo(() => {
    return teams.find(t => t.id === teamId)
  }, [teams, teamId])

  // Filter bookmarks that belong to this team
  const teamBookmarks = useMemo(() => {
    return useBookmarkStore.getState().getBookmarksByTeam(teamId)
  }, [teamId])

  // Filter bookmarks by search query
  const filteredBookmarks = useMemo(() => {
    return teamBookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }, [teamBookmarks, searchQuery])

  // Check if user is team owner
  const isOwner = useMemo(() => {
    return team?.ownerId === user?.uid
  }, [team, user])

  // Get current user role
  const currentUserRole = useMemo(() => {
    if (!team || !user) return null
    return team.members.find(m => m.userId === user.uid)?.role || null
  }, [team, user])

  // Check if current user can manage team members (owner or admin)
  const canManageMembers = useMemo(() => {
    return isOwner || currentUserRole === "admin"
  }, [isOwner, currentUserRole])

  const handleInviteMember = async () => {
    if (!inviteEmail || !team || !user) return

    setIsInviting(true)
    try {
      // Using a dummy userId for demonstration
      // In a real app, you would send an invitation and get the userId when they accept
      const dummyUserId = `invited-${Date.now()}`
      
      await addMember(teamId, {
        userId: dummyUserId,
        email: inviteEmail,
        role: inviteRole,
        name: inviteEmail.split('@')[0]
      })
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}.`,
      })

      setInviteEmail("")
    } catch (error) {
      console.error("Error inviting member:", error)
      toast({
        variant: "destructive",
        title: "Failed to invite member",
        description: "There was an error sending the invitation. Please try again.",
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleUpdateMemberRole = async () => {
    if (!memberToUpdate || !team) return

    try {
      await updateMemberRole(teamId, memberToUpdate.userId, memberToUpdate.currentRole)
      
      toast({
        title: "Role updated",
        description: "The team member's role has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating member role:", error)
      toast({
        variant: "destructive",
        title: "Failed to update role",
        description: "There was an error updating the team member's role. Please try again.",
      })
    } finally {
      setMemberToUpdate(null)
    }
  }

  const handleRemoveMember = async () => {
    if (!memberToRemove || !team) return

    try {
      await removeMember(teamId, memberToRemove)
      
      toast({
        title: "Member removed",
        description: "The team member has been removed from the team.",
      })
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        variant: "destructive", 
        title: "Failed to remove member",
        description: "There was an error removing the team member. Please try again.",
      })
    } finally {
      setMemberToRemove(null)
    }
  }

  const handleLeaveTeam = async () => {
    if (!user || !team) return

    setIsLeaving(true)
    try {
      await removeMember(teamId, user.uid)
      
      toast({
        title: "Left team",
        description: "You have left the team successfully.",
      })
      
      router.push('/dashboard/teams')
    } catch (error) {
      console.error("Error leaving team:", error)
      toast({
        variant: "destructive",
        title: "Failed to leave team",
        description: "There was an error leaving the team. Please try again.",
      })
    } finally {
      setIsLeaving(false)
      setShowLeaveDialog(false)
    }
  }

  const handleDeleteTeam = async () => {
    if (!team) return

    try {
      await deleteTeam(teamId)
      
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      })
      
      router.push('/dashboard/teams')
    } catch (error) {
      console.error("Error deleting team:", error)
      toast({
        variant: "destructive",
        title: "Failed to delete team", 
        description: "There was an error deleting the team. Please try again.",
      })
    } finally {
      setShowDeleteDialog(false)
    }
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

  const handleInviteMemberClick = () => {
    // Find the button in the popover trigger using a data attribute
    const inviteButton = document.querySelector('[data-invite-button="true"]') as HTMLButtonElement;
    if (inviteButton) {
      inviteButton.click();
    }
  }

  if (loading || !team) {
    return (
      <DashboardLayout>
        <div className="container px-4 md:px-6 py-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading team...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container px-4 md:px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Error Loading Team</h2>
            <p className="text-muted-foreground mt-2">
              {error || "There was an error loading the team. Please try again."}
            </p>
            <Button className="mt-4" onClick={() => fetchTeams()}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
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
            {canManageMembers && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button data-invite-button="true">
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
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as TeamMember["role"])}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Admins can manage team members, editors can add/edit bookmarks, viewers can only view.
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setInviteEmail("")}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleInviteMember} 
                        disabled={!inviteEmail || isInviting}
                      >
                        {isInviting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Invitation'
                        )}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
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
                {isOwner && (
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/teams/${teamId}/settings`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Team Settings</span>
                  </DropdownMenuItem>
                )}
                {isOwner && (
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/teams/${teamId}/permissions`)}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Manage Permissions</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {isOwner && (
                  <DropdownMenuItem 
                    className="text-destructive" 
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Team</span>
                  </DropdownMenuItem>
                )}
                {!isOwner && (
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => setShowLeaveDialog(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Leave Team</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="bookmarks">
          <TabsList className="mb-6">
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="members">Members ({team.members.length})</TabsTrigger>
            {/* <TabsTrigger value="activity">Activity</TabsTrigger> */}
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
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <BookmarkIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-medium mb-2">No bookmarks found</h2>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try a different search term." : "Add your first bookmark to this team."}
                </p>
                <Button asChild>
                  <Link href="/dashboard/add">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Bookmark
                  </Link>
                </Button>
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} viewMode={viewMode} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="members">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                {team.members.map((member) => (
                  <div key={member.userId} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="" alt={member.name || member.email} />
                        <AvatarFallback>{getInitials(member.name || member.email)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name || member.email.split("@")[0]}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getRoleColor(member.role)}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                      {canManageMembers && member.userId !== user?.uid && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Member options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {isOwner && (
                              <>
                                <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setMemberToUpdate({userId: member.userId, currentRole: "admin"})}>
                                  {member.role === "admin" && <Check className="mr-2 h-4 w-4" />}
                                  <span className={member.role === "admin" ? "font-medium" : ""}>Admin</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMemberToUpdate({userId: member.userId, currentRole: "editor"})}>
                                  {member.role === "editor" && <Check className="mr-2 h-4 w-4" />}
                                  <span className={member.role === "editor" ? "font-medium" : ""}>Editor</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMemberToUpdate({userId: member.userId, currentRole: "viewer"})}>
                                  {member.role === "viewer" && <Check className="mr-2 h-4 w-4" />}
                                  <span className={member.role === "viewer" ? "font-medium" : ""}>Viewer</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setMemberToRemove(member.userId)}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              <span>Remove from Team</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {canManageMembers && (
                <Button className="mt-4" onClick={handleInviteMemberClick}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite New Member
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Leave Team Dialog */}
        <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave Team</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave this team? You will no longer have access to the team's bookmarks.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleLeaveTeam} 
                variant="destructive"
                disabled={isLeaving}
              >
                {isLeaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Leaving...
                  </>
                ) : (
                  'Leave Team'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Team Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Team</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this team? This action cannot be undone and will remove all team members and shared bookmarks.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleDeleteTeam} 
                variant="destructive"
              >
                Delete Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Member Role Dialog */}
        <Dialog open={!!memberToUpdate} onOpenChange={(open) => !open && setMemberToUpdate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Member Role</DialogTitle>
              <DialogDescription>
                Are you sure you want to change this member's role to {memberToUpdate?.currentRole}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateMemberRole}>
                Update Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Member Dialog */}
        <Dialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Team Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this member from the team? They will no longer have access to the team's bookmarks.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleRemoveMember} 
                variant="destructive"
              >
                Remove Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

