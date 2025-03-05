export type Bookmark = {
  id: string
  title: string
  url: string
  description?: string
  tags: string[]
  aiSummary?: string
  favicon?: string
  createdAt: Date
  updatedAt: Date
  userId: string
  teamId?: string
  isPublic: boolean
}

export type Team = {
  id: string
  name: string
  description?: string
  createdAt: Date
  ownerId: string
  members: TeamMember[]
}

export type TeamMember = {
  userId: string
  role: "admin" | "editor" | "viewer"
  email: string
  name?: string
}

export type Category = {
  id: string
  name: string
  userId: string
  teamId?: string
  bookmarkIds: string[]
}

