"use client"

import { useState, useRef, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Filter, X } from "lucide-react"
import projectsData from "@/lib/projects.json"
import { ThemeToggle } from "@/components/theme-toggle"
import SplitText from "@/components/reactbits/SplitText"
import SpotlightCard from "@/components/reactbits/SpotlightCard"
import GlareHover from "@/components/reactbits/GlareHover"
import "@/components/reactbits/SpotlightCard.css"

export default function ProjectsPage() {
  const { projects } = projectsData
  const [selectedCategory, setSelectedCategory] = useState<string>("")
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

  const allCategories = Array.from(
    new Set(projects.map((p) => p.category))
  )

  const filteredProjects = selectedCategory === ""
    ? projects
    : projects.filter((p) => p.category === selectedCategory)

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
        <div className="mb-12">
          <SplitText text="Selected Projects" tag="h1" className="text-4xl sm:text-5xl font-light mb-4" delay={40} duration={0.5} textAlign="left" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            A showcase of AI/ML projects, data engineering solutions, and web applications
            I've built for enterprise clients and personal development.
          </p>

          {/* Category Filter */}
          <div className="flex items-center gap-3 mt-6" ref={filterRef}>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  selectedCategory
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                {selectedCategory || "Filter by category"}
              </button>

              {filterOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 rounded-lg border border-border bg-background shadow-lg z-30">
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => { setSelectedCategory(""); setFilterOpen(false) }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors ${
                        selectedCategory === ""
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedCategory === "" ? "bg-foreground" : "bg-transparent"}`} />
                        All Projects
                      </span>
                      <span className="text-xs text-muted-foreground/60">{projects.length}</span>
                    </button>
                    {allCategories.map((category) => {
                      const count = projects.filter((p) => p.category === category).length
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            const newCategory = selectedCategory === category ? "" : category
                            if (newCategory) {
                              trackEvent("filter-project-category", { category: newCategory })
                            }
                            setSelectedCategory(newCategory)
                            setFilterOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors ${
                            selectedCategory === category
                              ? "bg-foreground/10 text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${selectedCategory === category ? "bg-foreground" : "bg-transparent"}`} />
                            {category}
                          </span>
                          <span className="text-xs text-muted-foreground/60">{count}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                {selectedCategory}
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block"
                data-umami-event="content-project-click"
                data-umami-event-project={project.id}
              >
              <SpotlightCard
                className="rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-lg bg-background"
              >
                <GlareHover
                  glareColor="#8888ff"
                  glareOpacity={0.15}
                  glareSize={300}
                  transitionDuration={800}
                  className="relative h-64 bg-[#1a1a2e] overflow-hidden flex items-center justify-center"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-contain p-4 transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {project.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      project.status === 'In Production' || project.status === 'Production'
                        ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                        : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </GlareHover>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="w-4 h-4" />
                      {project.category}
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-muted-foreground transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {project.year}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {project.client}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs border border-border rounded-md bg-muted/20"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 text-xs text-muted-foreground">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md group-hover:bg-foreground/90 transition-colors text-sm font-medium">
                      View Details
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </SpotlightCard>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <Tag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              Projects are being curated. Check back soon for a showcase of real-world AI/ML and engineering work.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">
            Looking for more details about my work? Let's connect!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
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