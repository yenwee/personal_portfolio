"use client"

import { useState, useRef, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Filter, X, Search, LayoutGrid, List as ListIcon, ChevronDown, ArrowDownAZ } from "lucide-react"
import projectsData from "@/lib/projects.json"
import { ThemeToggle } from "@/components/theme-toggle"
import SplitText from "@/components/reactbits/SplitText"
import SpotlightCard from "@/components/reactbits/SpotlightCard"
import GlareHover from "@/components/reactbits/GlareHover"
import "@/components/reactbits/SpotlightCard.css"
import AnimatedContent from "@/components/reactbits/AnimatedContent"

export default function ProjectsPage() {
  const { projects } = projectsData
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTech, setSelectedTech] = useState<string>("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [visibleCount, setVisibleCount] = useState(6)

  const [filterOpen, setFilterOpen] = useState(false)
  const [techFilterOpen, setTechFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const filterRef = useRef<HTMLDivElement>(null)
  const techRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (filterRef.current && !filterRef.current.contains(target)) setFilterOpen(false)
      if (techRef.current && !techRef.current.contains(target)) setTechFilterOpen(false)
      if (sortRef.current && !sortRef.current.contains(target)) setSortOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const allCategories = Array.from(new Set(projects.map((p) => p.category)))
  const allTechs = Array.from(new Set(projects.flatMap((p) => p.technologies))).sort()

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === "" || p.category === selectedCategory
    const matchesTech = selectedTech === "" || p.technologies.includes(selectedTech)
    const query = searchQuery.toLowerCase()
    const matchesSearch = query === "" ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.client.toLowerCase().includes(query)

    return matchesCategory && matchesTech && matchesSearch
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const yearA = parseInt(String(a.year).replace(/\D/g, '')) || 0
    const yearB = parseInt(String(b.year).replace(/\D/g, '')) || 0

    if (sortBy === "newest") {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return yearB - yearA
    }
    if (sortBy === "oldest") {
      return yearA - yearB
    }
    if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  const paginatedProjects = sortedProjects.slice(0, visibleCount)
  const hasMore = paginatedProjects.length < sortedProjects.length

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6)
  }

  const resetFilters = () => {
    setSelectedCategory("")
    setSelectedTech("")
    setSearchQuery("")
    setSortBy("newest")
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
              <span className="hidden sm:block text-sm text-foreground font-medium">Projects</span>
              <Link href="/blogs" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <SplitText text="Selected Projects" tag="h1" className="text-4xl sm:text-5xl font-light mb-4" delay={40} duration={0.5} textAlign="left" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            A showcase of AI/ML projects, data engineering solutions, and web applications
            I've built for enterprise clients and personal development.
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
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>

            {/* Category Filter */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors ${selectedCategory
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                  }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{selectedCategory || "Category"}</span>
                <span className="sm:hidden">{selectedCategory ? "Filtered" : "Category"}</span>
              </button>

              {filterOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-lg border border-border bg-background shadow-lg z-30">
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => { setSelectedCategory(""); setFilterOpen(false) }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors ${selectedCategory === ""
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                    >
                      All Categories
                    </button>
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          const newCategory = selectedCategory === category ? "" : category
                          if (newCategory) trackEvent("filter-project-category", { category: newCategory })
                          setSelectedCategory(newCategory)
                          setFilterOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors ${selectedCategory === category
                            ? "bg-foreground/10 text-foreground"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tech Filter */}
            <div className="relative" ref={techRef}>
              <button
                onClick={() => setTechFilterOpen(!techFilterOpen)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors ${selectedTech
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                  }`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{selectedTech || "Technology"}</span>
                <span className="sm:hidden">{selectedTech ? "Filtered" : "Tech"}</span>
              </button>

              {techFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-lg border border-border bg-background shadow-lg z-30">
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => { setSelectedTech(""); setTechFilterOpen(false) }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors ${selectedTech === ""
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                    >
                      All Technologies
                    </button>
                    {allTechs.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => {
                          const newTech = selectedTech === tech ? "" : tech
                          if (newTech) trackEvent("filter-project-tech", { tech: newTech })
                          setSelectedTech(newTech)
                          setTechFilterOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors ${selectedTech === tech
                            ? "bg-foreground/10 text-foreground"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(selectedCategory || selectedTech || searchQuery) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Clear all filters"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
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
                  {sortBy === "newest" ? "Newest First" : sortBy === "oldest" ? "Oldest First" : "Alphabetical"}
                </span>
                <span className="sm:hidden">Sort</span>
              </button>
              {sortOpen && (
                <div className="absolute top-full right-0 lg:right-auto lg:left-0 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg z-30">
                  <div className="p-2 space-y-0.5">
                    {[
                      { id: "newest", label: "Newest First" },
                      { id: "oldest", label: "Oldest First" },
                      { id: "alphabetical", label: "Alphabetical" }
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

        {/* Projects Display */}
        {sortedProjects.length > 0 ? (
          <>
            <div className={`grid gap-8 ${viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
              {paginatedProjects.map((project, index) => (
                <AnimatedContent key={project.id} distance={30} direction="vertical" delay={0.05 + index * 0.05}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="group block"
                    data-umami-event="content-project-click"
                    data-umami-event-project={project.id}
                  >
                    <SpotlightCard
                      className="rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-lg bg-background overflow-hidden"
                    >
                      <div className={`flex ${viewMode === "grid" ? "flex-col" : "flex-col sm:flex-row"} w-full`}>
                        {/* Image Section */}
                        <div className={`relative ${viewMode === "grid" ? "h-64 w-full" : "h-56 sm:h-auto sm:w-1/3 min-w-[240px]"}`}>
                          <GlareHover
                            glareColor="#8888ff"
                            glareOpacity={0.15}
                            glareSize={300}
                            transitionDuration={800}
                            className="relative h-full w-full bg-[#1a1a2e] flex items-center justify-center"
                          >
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-contain p-4 transition-transform group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {project.featured && (
                              <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full shadow-sm">
                                  Featured
                                </span>
                              </div>
                            )}
                            <div className="absolute top-4 right-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${project.status === 'In Production' || project.status === 'Production'
                                  ? 'bg-green-500/10 text-green-600 border border-green-500/20 backdrop-blur-sm'
                                  : 'bg-blue-500/10 text-blue-600 border border-blue-500/20 backdrop-blur-sm'
                                }`}>
                                {project.status}
                              </span>
                            </div>
                          </GlareHover>
                        </div>

                        {/* Content Section */}
                        <div className={`p-6 space-y-4 ${viewMode === "list" ? "sm:w-2/3 flex flex-col justify-center" : ""}`}>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Tag className="w-4 h-4" />
                              {project.category}
                            </div>
                            <h3 className="text-xl font-semibold group-hover:text-muted-foreground transition-colors leading-tight">
                              {project.title}
                            </h3>
                          </div>

                          <p className="text-muted-foreground leading-relaxed line-clamp-2">
                            {project.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {project.year}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              {project.client}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {project.technologies.slice(0, viewMode === "list" ? 6 : 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 text-xs border border-border rounded-md bg-muted/20 text-muted-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > (viewMode === "list" ? 6 : 4) && (
                              <span className="px-2 py-1 text-xs text-muted-foreground flex items-center">
                                +{project.technologies.length - (viewMode === "list" ? 6 : 4)} more
                              </span>
                            )}
                          </div>

                          {viewMode === "grid" && (
                            <div className="flex items-center gap-3 pt-3">
                              <span className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md group-hover:bg-foreground/90 transition-colors text-sm font-medium">
                                View Details
                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          )}
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
                  Load More Projects
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
            <h3 className="text-xl font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              We couldn't find any projects matching your current filters.
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
          <p className="text-muted-foreground mb-4">
            Looking for more details about my work? Let's connect!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors font-medium"
            data-umami-event="nav-back-portfolio"
            data-umami-event-from="projects"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </main>
    </div>
  )
}