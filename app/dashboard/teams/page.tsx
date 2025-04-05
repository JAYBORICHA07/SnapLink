"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Users, PlusCircle, Search, Settings, BookmarkIcon, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTeamStore, useUserStore } from "@/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

const formSchema = z.object({
  name: z.string().min(1, { message: "Team name is required" }),
  description: z.string().optional(),
})

export default function TeamsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { user } = useUserStore()
  const { teams, loading, error, fetchTeams, createTeam, deleteTeam } = useTeamStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.description?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createTeam({
        name: values.name,
        description: values.description,
        ownerId: user?.uid || '',
      })

      toast({
        title: "Team created",
        description: `${values.name} has been created successfully.`,
      })

      form.reset()
      setPopoverOpen(false)
    } catch (error) {
      console.error("Error creating team:", error)
      toast({
        variant: "destructive",
        title: "Failed to create team",
        description: "There was an error creating your team. Please try again.",
      })
    }
  }

  const handleDeleteTeam = async () => {
    if (!deleteTeamId) return

    setIsDeleting(true)
    try {
      await deleteTeam(deleteTeamId)
      
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting team:", error)
      toast({
        variant: "destructive",
        title: "Failed to delete team",
        description: "There was an error deleting the team. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setDeleteTeamId(null)
    }
  }

  const getMemberCount = (team: typeof teams[0]) => {
    return team.members.length
  }

  return (
    <DashboardLayout>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
            <p className="text-muted-foreground mt-1">Manage your teams and collaborate on bookmarks</p>
          </div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Create a new team</h4>
                  <p className="text-sm text-muted-foreground">Create a team to collaborate on bookmarks with others.</p>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Design Team" {...field} />
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
                              placeholder="Describe the purpose of this team"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => {
                        form.reset()
                        setPopoverOpen(false)
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Team</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading teams...</span>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium mb-2">No teams found</h2>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "Try a different search term." 
                : teams.length === 0 
                  ? "Create your first team to start collaborating." 
                  : "No teams match your search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription>{team.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{getMemberCount(team)} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Shared bookmarks</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teams/${team.id}`}>View Team</Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/teams/${team.id}`}>
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Team Settings</span>
                      </Link>
                    </Button>
                    {team.ownerId === user?.uid && (
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteTeamId(team.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Team</span>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!deleteTeamId} onOpenChange={(open: boolean) => !open && setDeleteTeamId(null)}>
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
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Team'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

