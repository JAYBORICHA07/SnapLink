"use client"

import { useState } from "react"
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
import { Users, PlusCircle, Search, UserPlus, Settings, BookmarkIcon } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Mock data for teams
const mockTeams = [
  {
    id: "1",
    name: "Design Team",
    description: "Team for design resources and inspiration",
    memberCount: 5,
    bookmarkCount: 27,
    createdAt: new Date("2023-05-10"),
  },
  {
    id: "2",
    name: "Development",
    description: "Web development resources and documentation",
    memberCount: 8,
    bookmarkCount: 42,
    createdAt: new Date("2023-04-15"),
  },
  {
    id: "3",
    name: "Marketing",
    description: "Marketing strategies and tools",
    memberCount: 4,
    bookmarkCount: 18,
    createdAt: new Date("2023-06-20"),
  },
]

const formSchema = z.object({
  name: z.string().min(1, { message: "Team name is required" }),
  description: z.string().optional(),
})

export default function TeamsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const filteredTeams = mockTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.description?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate creating a team
    console.log(values)

    toast({
      title: "Team created",
      description: `${values.name} has been created successfully.`,
    })

    form.reset()
  }

  return (
    <DashboardLayout>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
            <p className="text-muted-foreground mt-1">Manage your teams and collaborate on bookmarks</p>
          </div>
          <Popover>
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
                      <Button type="button" variant="outline" onClick={() => form.reset()}>
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

        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium mb-2">No teams found</h2>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try a different search term." : "Create your first team to start collaborating."}
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
                      <span>{team.memberCount} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{team.bookmarkCount} bookmarks</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teams/${team.id}`}>View Team</Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <UserPlus className="h-4 w-4" />
                      <span className="sr-only">Add Member</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Team Settings</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

