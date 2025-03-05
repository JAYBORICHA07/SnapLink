import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BookmarkIcon, Sparkles, Users, Shield, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SnapLink</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary">
                Pricing
              </Link>
              <Link href="#about" className="text-sm font-medium hover:text-primary">
                About
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">AI-Powered Bookmark Management for Teams</h1>
              <p className="text-xl text-muted-foreground">
                Save, organize, and retrieve bookmarks with AI-powered summarization, smart search, and team
                collaboration.
              </p>
              <div className="flex gap-4">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-md border p-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookmarkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Next.js Documentation</h3>
                    <p className="text-sm text-muted-foreground">https://nextjs.org/docs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-md border p-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookmarkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Tailwind CSS Documentation</h3>
                    <p className="text-sm text-muted-foreground">https://tailwindcss.com/docs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-md border p-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookmarkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">shadcn/ui Components</h3>
                    <p className="text-sm text-muted-foreground">https://ui.shadcn.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-muted py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                SnapLink combines powerful features to make bookmark management efficient and collaborative.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <BookmarkIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Bookmark Organization</h3>
                <p className="text-muted-foreground">
                  Save, categorize, and tag bookmarks for easy retrieval and organization.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">AI-Powered Features</h3>
                <p className="text-muted-foreground">
                  Auto-generated summaries, smart search, and intelligent recommendations.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Share bookmarks, manage permissions, and work together efficiently.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Secure Data Handling</h3>
                <p className="text-muted-foreground">
                  Encrypted bookmark IDs, role-based access control, and secure API requests.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">AI-Powered Bookmark Management</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">AI Summary Generation</h3>
                      <p className="text-muted-foreground">
                        Automatically generate concise summaries of bookmarked content.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Smart Search</h3>
                      <p className="text-muted-foreground">
                        Retrieve bookmarks using natural language queries and AI-powered search.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Tag Suggestions</h3>
                      <p className="text-muted-foreground">
                        AI recommends relevant tags based on bookmark content for better organization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border shadow-lg p-6">
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="font-medium mb-2">AI Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      This article explains how to implement authentication in Next.js applications using various
                      providers like Firebase, Auth0, and NextAuth.js. It covers best practices for secure user
                      authentication and session management.
                    </p>
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="font-medium mb-2">Smart Search Example</h4>
                    <div className="bg-background rounded-md p-2 mb-3 border">
                      <p className="text-sm">Find all bookmarks related to machine learning</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10">
                        <BookmarkIcon className="h-4 w-4 text-primary" />
                        <span className="text-sm">Introduction to Machine Learning with Python</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10">
                        <BookmarkIcon className="h-4 w-4 text-primary" />
                        <span className="text-sm">TensorFlow Documentation</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10">
                        <BookmarkIcon className="h-4 w-4 text-primary" />
                        <span className="text-sm">Neural Networks Explained</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookmarkIcon className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">SnapLink</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered bookmark management for individuals and teams.</p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SnapLink. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

