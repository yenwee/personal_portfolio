"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, Clock, Star, BookOpen } from "lucide-react"
import blogsData from "@/lib/blogs.json"
import { ThemeToggle } from "@/components/theme-toggle"

const TAG_COLORS: Record<string, string> = {
  "AI Agents": "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  "LangGraph": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "Production": "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  "RAG": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  "Document AI": "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  "AI Safety": "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  "LLM Security": "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  "Architecture": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  "Career": "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
  "Data Science": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  "Data Engineering": "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  "PostgreSQL": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "ETL": "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  "General": "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  "AI": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  "Ansible": "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  "DevOps": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "Infrastructure": "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
}

const CARD_GRADIENTS = [
  "from-violet-500/8 via-transparent to-transparent",
  "from-blue-500/8 via-transparent to-transparent",
  "from-amber-500/8 via-transparent to-transparent",
  "from-emerald-500/8 via-transparent to-transparent",
  "from-rose-500/8 via-transparent to-transparent",
  "from-cyan-500/8 via-transparent to-transparent",
]

export default function BlogsPage() {
  const { posts } = blogsData
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags))
  ).sort()

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const filteredPosts = selectedTags.length === 0
    ? sortedPosts
    : sortedPosts.filter((post) =>
        post.tags.some((tag) => selectedTags.includes(tag))
      )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTagColor = (tag: string) => {
    return TAG_COLORS[tag] || "bg-foreground/5 text-foreground/70 border-border"
  }

  const featuredPost = filteredPosts.find((p) => p.featured)
  const otherPosts = filteredPosts.filter((p) => p !== featuredPost)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-mono tracking-wider hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              YEN WEE LIM
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/projects" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <span className="hidden sm:block text-sm text-foreground font-medium">Blog</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-light mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Thoughts on building AI products, data engineering patterns, and lessons
            from shipping software at startups and enterprises.
          </p>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setSelectedTags([])}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                selectedTags.length === 0
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => {
              const isActive = selectedTags.includes(tag)
              const colorClass = getTagColor(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    isActive
                      ? colorClass
                      : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
          {selectedTags.length > 0 && (
            <p className="text-sm text-muted-foreground mt-3">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
            </p>
          )}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Link
              href={`/blogs/${featuredPost.id}`}
              className="group block border border-border rounded-lg overflow-hidden hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-lg bg-background"
            >
              <div className="relative bg-gradient-to-br from-foreground/5 via-foreground/[0.02] to-transparent">
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Left visual accent */}
                  <div className="hidden md:flex md:col-span-2 items-center justify-center bg-[#1a1a2e] p-8 sm:p-12">
                    <div className="text-center space-y-4">
                      <BookOpen className="w-16 h-16 text-violet-400/60 mx-auto" />
                      <div className="space-y-2">
                        <div className="text-2xl font-light text-white/90">{featuredPost.readTime ?? 5} min</div>
                        <div className="text-xs font-mono text-white/50 tracking-wider">READ TIME</div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {featuredPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-xs rounded-md bg-white/10 text-white/70 border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right content */}
                  <div className="md:col-span-3 p-8 sm:p-12">
                    <div className="mb-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
                      </div>
                      <div className="flex items-center gap-1.5 md:hidden">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime ?? 5} min read
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-light mb-3 group-hover:text-muted-foreground transition-colors leading-snug">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 text-base sm:text-lg">
                      {featuredPost.description}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2 md:hidden">
                        {featuredPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2.5 py-1 text-xs border rounded-md ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:text-muted-foreground transition-colors whitespace-nowrap">
                        Read Article
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {otherPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blogs/${post.id}`}
              className="group block border border-border rounded-lg overflow-hidden hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-lg bg-background"
            >
              {/* Colored gradient header */}
              <div className={`h-2 bg-gradient-to-r ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`} />
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {post.readTime ?? 5} min
                    </div>
                  </div>
                  {post.featured && (
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-foreground/10 text-foreground rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-medium group-hover:text-muted-foreground transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm">
                    {post.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 text-xs border rounded-md ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                    Read
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </main>
    </div>
  )
}
