"use client"

import { useState, useRef, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Calendar, Clock, Star, BookOpen, Filter, X } from "lucide-react"
import blogsData from "@/lib/blogs.json"
import { ThemeToggle } from "@/components/theme-toggle"
import SplitText from "@/components/reactbits/SplitText"
import SpotlightCard from "@/components/reactbits/SpotlightCard"
import "@/components/reactbits/SpotlightCard.css"
import AnimatedContent from "@/components/reactbits/AnimatedContent"

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
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const sortedPosts = [...posts].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags))
  ).sort()

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const isRemoving = prev.includes(tag)
      if (!isRemoving) {
        trackEvent("filter-blog-tag", { tag })
      }
      return isRemoving ? prev.filter((t) => t !== tag) : [...prev, tag]
    })
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
          <SplitText text="Blog" tag="h1" className="text-4xl sm:text-5xl font-light mb-4" delay={40} duration={0.5} textAlign="left" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Thoughts on building AI products, data engineering patterns, and lessons
            from shipping software at startups and enterprises.
          </p>

          {/* Tag Filter */}
          <div className="flex items-center gap-3 mt-6" ref={filterRef}>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  selectedTags.length > 0
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                {selectedTags.length > 0 ? `${selectedTags.length} filter${selectedTags.length > 1 ? "s" : ""}` : "Filter by topic"}
              </button>

              {filterOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-lg border border-border bg-background shadow-lg z-30">
                  <div className="p-2 space-y-0.5">
                    {allTags.map((tag) => {
                      const isActive = selectedTags.includes(tag)
                      const postCount = posts.filter((p) => p.tags.includes(tag)).length
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors ${
                            isActive
                              ? "bg-foreground/10 text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-foreground" : "bg-transparent"}`} />
                            {tag}
                          </span>
                          <span className="text-xs text-muted-foreground/60">{postCount}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {selectedTags.length > 0 && (
              <>
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-md ${getTagColor(tag)}`}
                    >
                      {tag}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
                <span className="text-xs text-muted-foreground">
                  {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <AnimatedContent distance={40} direction="vertical" delay={0.1}>
          <div className="mb-12">
            <Link
              href={`/blogs/${featuredPost.id}`}
              className="group block"
              data-umami-event="content-blog-click"
              data-umami-event-post={featuredPost.id}
            >
              <SpotlightCard
                className="rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-lg bg-background"
                spotlightSize={400}
              >
                <div className="relative bg-gradient-to-br from-foreground/5 via-foreground/[0.02] to-transparent">
                  <div className="grid md:grid-cols-5 gap-0">
                    {/* Left visual accent */}
                    <div className="hidden md:flex md:col-span-2 items-center justify-center bg-muted/30 p-6 sm:p-8 overflow-hidden">
                      {featuredPost.featuredImage ? (
                        <div className="relative w-full aspect-[4/3]">
                          <Image
                            src={featuredPost.featuredImage}
                            alt={featuredPost.title}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <BookOpen className="w-16 h-16 text-muted-foreground/40 mx-auto" />
                          <div className="space-y-2">
                            <div className="text-2xl font-light text-foreground/70">{featuredPost.readTime ?? 5} min</div>
                            <div className="text-xs font-mono text-muted-foreground tracking-wider">READ TIME</div>
                          </div>
                        </div>
                      )}
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
              </SpotlightCard>
            </Link>
          </div>
          </AnimatedContent>
        )}

        {/* Posts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {otherPosts.map((post, index) => (
            <AnimatedContent key={post.id} distance={30} direction="vertical" delay={0.1 + index * 0.05}>
            <Link
              href={`/blogs/${post.id}`}
              className="group block"
              data-umami-event="content-blog-click"
              data-umami-event-post={post.id}
            >
              <SpotlightCard
                className="rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-lg bg-background"
              >
                {/* Featured image or gradient header */}
                {post.featuredImage ? (
                  <div className="relative h-40 sm:h-48 bg-muted/30 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className={`h-2 bg-gradient-to-r ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`} />
                )}
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
              </SpotlightCard>
            </Link>
            </AnimatedContent>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
            data-umami-event="nav-back-portfolio"
            data-umami-event-from="blogs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </main>
    </div>
  )
}
