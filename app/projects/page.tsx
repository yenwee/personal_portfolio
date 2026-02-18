"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Calendar, User, Tag } from "lucide-react"
import projectsData from "@/lib/projects.json"

export default function ProjectsPage() {
  const { projects } = projectsData
  const [selectedCategory, setSelectedCategory] = useState<string>("")

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
            <div className="text-sm text-muted-foreground font-mono">PROJECTS</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-light mb-4">Selected Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A showcase of AI/ML projects, data engineering solutions, and web applications
            I've built for enterprise clients and personal development.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                selectedCategory === ""
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
              }`}
            >
              All
            </button>
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(
                  selectedCategory === category ? "" : category
                )}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  selectedCategory === category
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group border border-border rounded-lg overflow-hidden hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-lg bg-background"
              >
                <div className="relative h-64 bg-[#1a1a2e] overflow-hidden flex items-center justify-center">
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
                </div>

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
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors text-sm font-medium"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
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
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </main>
    </div>
  )
}