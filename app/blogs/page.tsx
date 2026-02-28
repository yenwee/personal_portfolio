"use client"

import { useState, useRef, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Calendar, Clock, Star, BookOpen, Filter, X, Search, LayoutGrid, List as ListIcon, ArrowDownAZ } from "lucide-react"
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
  const posts = blogsData.posts.filter((p: any) => !p.draft)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "popular">("recent")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [visibleCount, setVisibleCount] = useState(6)

  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const filterRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (filterRef.current && !filterRef.current.contains(target)) setFilterOpen(false)
      if (sortRef.current && !sortRef.current.contains(target)) setSortOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const isRemoving = prev.includes(tag)
      if (!isRemoving) trackEvent("filter-blog-tag", { tag })
      return isRemoving ? prev.filter((t) => t !== tag) : [...prev, tag]
    })
  }

  const filteredPosts = posts.filter((post) => {
    const matchesTags = selectedTags.length === 0 || post.tags.some((tag) => selectedTags.includes(tag))
    const query = searchQuery.toLowerCase()
    const matchesSearch = query === "" ||
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query)

    return matchesTags && matchesSearch
  })

  let featuredPost = sortedPostsMethod("recent", filteredPosts).find((p) => p.featured && selectedTags.length === 0 && searchQuery === "")

  const sortedPosts = sortedPostsMethod(sortBy, filteredPosts).filter(p => p !== featuredPost)

  function sortedPostsMethod(sortType: string, list: typeof posts) {
    return [...list].sort((a, b) => {
      const timeA = new Date(a.date).getTime()
      const timeB = new Date(b.date).getTime()

      if (sortType === "recent") {
        if (a.featured !== b.featured && searchQuery === "") return a.featured ? -1 : 1
        return timeB - timeA
      }
      if (sortType === "oldest") {
        return timeA - timeB
      }
      if (sortType === "popular") {
        // approximate popularity by reading time + featured
        const popA = (a.featured ? 50 : 0) + (a.readTime || 5)
        const popB = (b.featured ? 50 : 0) + (b.readTime || 5)
        return popB - popA
      }
      return 0
    })
  }

  const paginatedPosts = sortedPosts.slice(0, visibleCount)
  const hasMore = paginatedPosts.length < sortedPosts.length

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6)
  }

  const resetFilters = () => {
    setSelectedTags([])
    setSearchQuery("")
    setSortBy("recent")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const getTagColor = (tag: string) => {
    return TAG_COLORS[tag] || "bg-foreground/5 text-foreground/70 border-border"
  }

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
        <div className="mb-8">
          <SplitText text="Blog" tag="h1" className="text-4xl sm:text-5xl font-light mb-4" delay={40} duration={0.5} textAlign="left" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Thoughts on building AI products, data engineering patterns, and lessons
            from shipping software at startups and enterprises.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-10 pb-6 border-b border-border/50">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none sm:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>

            {/* Tag Filter */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors ${selectedTags.length > 0
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                  }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {selectedTags.length > 0 ? `${selectedTags.length} filter${selectedTags.length > 1 ? "s" : ""}` : "Topics"}
                </span>
                <span className="sm:hidden">{selectedTags.length > 0 ? "Filtered" : "Topics"}</span>
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
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors ${isActive
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

            {(selectedTags.length > 0 || searchQuery) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}

            {(selectedTags.length > 0) && (
              <div className="hidden sm:flex flex-wrap items-center gap-1.5 ml-2">
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
            )}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0 justify-between lg:justify-end">
            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-border hover:border-muted-foreground/50 text-muted-foreground transition-colors bg-transparent"
              >
                <ArrowDownAZ className="w-3.5 h-3.5" />
                <span className="hidden sm:inline whitespace-nowrap">
                  {sortBy === "recent" ? "Most Recent" : sortBy === "oldest" ? "Oldest First" : "Most Popular"}
                </span>
                <span className="sm:hidden">Sort</span>
              </button>
              {sortOpen && (
                <div className="absolute top-full right-0 lg:right-auto lg:left-0 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg z-30">
                  <div className="p-2 space-y-0.5">
                    {[
                      { id: "recent", label: "Most Recent" },
                      { id: "oldest", label: "Oldest First" },
                      { id: "popular", label: "Most Popular" }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setSortBy(s.id as any); setSortOpen(false) }}
                        className={`w-full flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${sortBy === s.id
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-md p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === "grid" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === "list" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
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
                      {/* Visual accent */}
                      {featuredPost.featuredImage ? (
                        <div className="md:col-span-2 flex items-center justify-center p-6 sm:p-8 overflow-hidden">
                          <div className="relative w-full aspect-[4/3] bg-white rounded-lg overflow-hidden">
                            <Image
                              src={featuredPost.featuredImage}
                              alt={featuredPost.title}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                              priority
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="hidden md:flex md:col-span-2 items-center justify-center bg-muted/30 p-6 sm:p-8 overflow-hidden">
                          <div className="text-center space-y-4">
                            <BookOpen className="w-16 h-16 text-muted-foreground/40 mx-auto" />
                            <div className="space-y-2">
                              <div className="text-2xl font-light text-foreground/70">{featuredPost.readTime ?? 5} min</div>
                              <div className="text-xs font-mono text-muted-foreground tracking-wider">READ TIME</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Right content */}
                      <div className="md:col-span-3 p-8 sm:p-12 flex flex-col justify-center">
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
                        <div className="flex items-center justify-between gap-4 mt-auto pt-2">
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
        {sortedPosts.length > 0 ? (
          <>
            <div className={`grid gap-6 sm:gap-8 ${viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
              {paginatedPosts.map((post, index) => (
                <AnimatedContent key={post.id} distance={30} direction="vertical" delay={0.05 + index * 0.05}>
                  <Link
                    href={`/blogs/${post.id}`}
                    className="group block h-full"
                    data-umami-event="content-blog-click"
                    data-umami-event-post={post.id}
                  >
                    <SpotlightCard
                      className="h-full rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-lg bg-background"
                    >
                      <div className={`flex flex-col h-full ${viewMode === "grid" ? "" : "sm:flex-row"}`}>
                        {/* Featured image or gradient header */}
                        {post.featuredImage ? (
                          <div className={`relative overflow-hidden flex items-center justify-center p-3 ${viewMode === "grid" ? "h-40 sm:h-48" : "h-48 sm:h-auto sm:w-1/3 min-w-[240px]"}`}>
                            <div className="relative w-full h-full bg-white rounded-lg overflow-hidden border border-border/50">
                              <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                priority={index < 4}
                                sizes={viewMode === "grid" ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 640px) 100vw, 20vw"}
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className={`${viewMode === "grid" ? "h-2 w-full" : "h-2 w-full sm:h-full sm:w-2"} bg-gradient-to-r ${viewMode === "list" ? "sm:bg-gradient-to-b" : ""} ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`} />
                        )}

                        <div className={`p-6 sm:p-8 flex flex-col flex-1 ${viewMode === "list" ? "sm:w-2/3 justify-center" : "space-y-4"}`}>
                          <div className="flex items-center justify-between mb-4">
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

                          <div className="space-y-2 mb-4">
                            <h2 className="text-xl font-medium group-hover:text-muted-foreground transition-colors leading-snug">
                              {post.title}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm">
                              {post.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-4 mt-auto pt-2">
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
                      </div>
                    </SpotlightCard>
                  </Link>
                </AnimatedContent>
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium border border-border rounded-full hover:bg-muted/50 transition-colors"
                >
                  Load More Articles
                  <ArrowDownAZ className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              We couldn't find any articles matching your current filters.
              Try adjusting your search criteria or clearing your filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

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
