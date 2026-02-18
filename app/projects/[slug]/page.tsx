"use client"

import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Github } from "lucide-react"
import { notFound } from "next/navigation"
import React, { useEffect, useState } from "react"
import projectsData from "@/lib/projects.json"
import { StatsBar } from "@/components/project/stats-bar"
import { Callout } from "@/components/project/callout"
import { TableOfContents } from "@/components/project/table-of-contents"
import { AnimatedSection } from "@/components/project/animated-section"
import { PullQuote } from "@/components/project/pull-quote"
import { ThemeToggle } from "@/components/theme-toggle"
import "highlight.js/styles/github-dark.css"

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

type CalloutType = "insight" | "challenge" | "decision" | "metric" | "note"

const CALLOUT_TYPES = "insight|challenge|decision|metric|note"
const CALLOUT_REGEX = new RegExp(
  `^> \\[!(${CALLOUT_TYPES})\\]\\s*(.+)\\n> (.+)$`,
  "gm"
)

function preprocessCallouts(markdown: string): string {
  return markdown.replace(CALLOUT_REGEX, (_, type, title, body) => {
    const encodedTitle = title.trim().replace(/\|/g, "\\|")
    return `[CALLOUT:${type}:${encodedTitle}] ${body.trim()}`
  })
}

const SECTION_ACCENTS: Record<string, string> = {
  challenge: "bg-amber-500",
  approach: "bg-blue-500",
  solution: "bg-blue-500",
  architecture: "bg-blue-500",
  impact: "bg-green-500",
  results: "bg-green-500",
  learned: "bg-green-500",
  decision: "bg-purple-500",
}

function getSectionAccent(text: string): string {
  const lower = text.toLowerCase()
  for (const [keyword, accent] of Object.entries(SECTION_ACCENTS)) {
    if (lower.includes(keyword)) return accent
  }
  return "bg-foreground/70"
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>("")

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  const project = projectsData.projects.find(p => p.id === slug)

  useEffect(() => {
    if (project && slug) {
      fetch(`/projects/markdown/${project.id}.md`)
        .then(response => {
          if (response.ok) {
            return response.text()
          }
          return `## Overview\n\n${project.description}\n\n*Detailed write-up coming soon.*`
        })
        .then(content => {
          setMarkdownContent(content)
          setLoading(false)
        })
        .catch(() => {
          setMarkdownContent(`## Overview\n\n${project.description}`)
          setLoading(false)
        })
    }
  }, [project, slug])

  if (slug && !project) {
    notFound()
  }

  if (!slug) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/projects"
              className="flex items-center gap-2 text-sm font-mono tracking-wider hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              PROJECTS
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/blogs" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link
                href="/"
                className="text-sm text-muted-foreground font-mono hover:text-foreground transition-colors"
              >
                YEN WEE LIM
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-muted-foreground/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-12">
          {/* Project Meta */}
          <AnimatedSection>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {project.category}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {project.year}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {project.client}
              </div>
              <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                project.status === 'In Production' || project.status === 'Production' || project.status === 'Deployed'
                  ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                  : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
              }`}>
                {project.status}
              </div>
            </div>
          </AnimatedSection>

          {/* Project Title */}
          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl sm:text-5xl font-light mb-4">{project.title}</h1>
          </AnimatedSection>

          {/* Project Description */}
          <AnimatedSection delay={0.15}>
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </AnimatedSection>

          {/* Technologies */}
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm border border-border rounded-full bg-background/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </AnimatedSection>

          {/* Architecture Diagram */}
          <AnimatedSection delay={0.25}>
            <div className="relative w-full rounded-lg overflow-hidden bg-[#1a1a2e] border border-border">
              <Image
                src={project.image}
                alt={`${project.title} Architecture`}
                width={800}
                height={450}
                className="w-full h-auto object-contain p-6"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Stats Bar */}
      {project.stats && (
        <div className="max-w-6xl mx-auto px-6 sm:px-8 -mt-6 relative z-10">
          <AnimatedSection delay={0.3}>
            <StatsBar stats={project.stats} />
          </AnimatedSection>
        </div>
      )}

      {/* Content Area with TOC Sidebar */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-4 pb-8">
        {/* Role & Links */}
        <AnimatedSection>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="text-muted-foreground">
              <span className="font-medium text-foreground">Role:</span> {project.role}
            </div>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted/20 transition-colors"
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
            )}
          </div>
        </AnimatedSection>

        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading project details...</div>
              </div>
            ) : (
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h2: ({ children }) => {
                      const text = typeof children === 'string' ? children :
                        Array.isArray(children) ? children.join('') : String(children || '')
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                      const accent = getSectionAccent(text)
                      return (
                        <AnimatedSection>
                          <div className="section-divider mt-10 pt-6 border-t border-border/50">
                            <h2 id={id} className="flex items-center gap-3 text-2xl font-semibold mb-4 scroll-mt-24">
                              <span className={`w-1 h-8 ${accent} rounded-full shrink-0`} />
                              {children}
                            </h2>
                          </div>
                        </AnimatedSection>
                      )
                    },
                    h3: ({ children }) => {
                      const text = typeof children === 'string' ? children :
                        Array.isArray(children) ? children.join('') : String(children || '')
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                      return (
                        <h3 id={id} className="text-lg font-medium mb-3 mt-8 scroll-mt-24">
                          {children}
                        </h3>
                      )
                    },
                    p: ({ children }) => {
                      const childArray = Array.isArray(children) ? children : [children]
                      const firstChild = childArray[0]
                      if (typeof firstChild === 'string') {
                        const calloutMatch = firstChild.match(
                          /^\[CALLOUT:(insight|challenge|decision|metric|note):(.+?)\]\s*(.*)/
                        )
                        if (calloutMatch) {
                          const [, type, title, bodyStart] = calloutMatch
                          const restText = childArray.slice(1).map(c =>
                            typeof c === 'string' ? c : ''
                          ).join('')
                          const body = (bodyStart + restText).trim()
                          return (
                            <Callout type={type as CalloutType} title={title.replace(/\\\|/g, "|").trim()}>
                              {body}
                            </Callout>
                          )
                        }
                      }
                      return (
                        <p className="mb-4 text-muted-foreground leading-relaxed">
                          {children}
                        </p>
                      )
                    },
                    ul: ({ children }) => (
                      <ul className="mb-5 ml-5 space-y-2.5 text-muted-foreground list-disc marker:text-foreground/30">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-5 ml-5 space-y-2.5 text-muted-foreground list-decimal marker:text-foreground/30">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed pl-1">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    blockquote: ({ children }) => (
                      <PullQuote>{children}</PullQuote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className
                      return isInline ? (
                        <code className="bg-muted/30 px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                          {children}
                        </code>
                      ) : (
                        <code className={className}>{children}</code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="bg-[#1a1a2e] border border-border rounded-lg p-4 overflow-x-auto mb-6 text-sm">
                        {children}
                      </pre>
                    ),
                    img: ({ src, alt }) => (
                      <div className="relative w-full my-8">
                        <Image
                          src={src || ''}
                          alt={alt || ''}
                          width={800}
                          height={450}
                          className="rounded-lg border border-border object-cover w-full"
                          sizes="(max-width: 768px) 100vw, 800px"
                        />
                      </div>
                    ),
                    hr: () => (
                      <hr className="my-8 border-border" />
                    ),
                  }}
                >
                  {preprocessCallouts(markdownContent)}
                </ReactMarkdown>
              </div>
            )}

            {/* Footer Actions */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link
                  href="/projects"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </Link>

                <div className="flex items-center gap-4">
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View Portfolio
                  </Link>
                  <Link
                    href="/#connect"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors text-sm font-medium"
                  >
                    Get In Touch
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar TOC */}
          {!loading && markdownContent && (
            <aside className="hidden xl:block w-48 shrink-0">
              <TableOfContents markdown={markdownContent} />
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
