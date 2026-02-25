"use client"

import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Github, FileText, Clock, ExternalLink, Share2, Twitter, Linkedin, Link as LinkIcon, ZoomIn, X, ChevronLeft, ChevronRight, FolderOpen } from "lucide-react"
import React, { useState, useEffect, useRef, memo } from "react"
import { StatsBar } from "@/components/project/stats-bar"
import { Callout } from "@/components/project/callout"
import { TableOfContents } from "@/components/project/table-of-contents"
import { AnimatedSection } from "@/components/project/animated-section"
import { PullQuote } from "@/components/project/pull-quote"
import { ThemeToggle } from "@/components/theme-toggle"
import BlurText from "@/components/reactbits/BlurText"
import AnimatedContent from "@/components/reactbits/AnimatedContent"
import contentData from "@/lib/content.json"
import projectsData from "@/lib/projects.json"
import { trackEvent } from "@/lib/analytics"
import "highlight.js/styles/github-dark.css"

interface ProjectStat {
  value: string
  label: string
}

interface ProjectType {
  id: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  status: string
  year: string
  client: string
  featured: boolean
  stats?: ProjectStat[]
  highlights: string[]
  role: string
  github?: string
  demo?: string
}

interface RelatedPost {
  id: string
  title: string
  readTime: number
}

interface ProjectDetailClientProps {
  project: ProjectType
  markdownContent: string
  slug: string
  relatedPosts?: RelatedPost[]
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

const READING_MILESTONES = [25, 50, 75, 100] as const

const ReadingProgressBar = memo(function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)
  const firedMilestonesRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const pct = Math.min((scrollTop / docHeight) * 100, 100)
        setProgress(pct)
        for (const milestone of READING_MILESTONES) {
          if (pct >= milestone && !firedMilestonesRef.current.has(milestone)) {
            firedMilestonesRef.current.add(milestone)
            trackEvent("reading_progress", { milestone })
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-foreground/70 z-50 transition-[width] duration-100 ease-linear"
      style={{ width: `${progress}%` }}
    />
  )
})

export default function ProjectDetailClient({ project, markdownContent, slug, relatedPosts }: ProjectDetailClientProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const currentIndex = projectsData.projects.findIndex(p => p.id === project.id)
  const prevProject = currentIndex > 0 ? projectsData.projects[currentIndex - 1] : null
  const nextProject = currentIndex < projectsData.projects.length - 1 && currentIndex !== -1 ? projectsData.projects[currentIndex + 1] : null

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://weeai.dev/projects/${slug}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackEvent("share_project", { platform: "copy_link", project: project.id })
  }

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${project.title} by Yen Wee Lim!`)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    trackEvent("share_project", { platform: "twitter", project: project.id })
  }

  const shareOnLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
    trackEvent("share_project", { platform: "linkedin", project: project.id })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgressBar />

      {/* Navigation */}
      <nav className="fixed top-[2px] left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
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
                className="hidden sm:block text-sm text-muted-foreground font-mono hover:text-foreground transition-colors"
              >
                YEN WEE LIM
              </Link>
              <Link
                href={contentData.connect.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block text-sm px-4 py-1.5 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-all duration-300 font-medium whitespace-nowrap"
                data-umami-event="cta-start-project"
                data-umami-event-location="project-nav"
              >
                Start a Project
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-muted-foreground/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-28 pb-12">
          {/* Project Meta */}
          <AnimatedSection>
            <AnimatedContent distance={30} duration={0.5}>
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
                <div className={`px-3 py-1 text-xs font-medium rounded-full ${project.status === 'In Production' || project.status === 'Production' || project.status === 'Deployed'
                    ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                    : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                  }`}>
                  {project.status}
                </div>
              </div>
            </AnimatedContent>
          </AnimatedSection>

          {/* Project Title */}
          <AnimatedSection delay={0.1}>
            <BlurText text={project.title} tag="h1" className="text-4xl sm:text-5xl font-light mb-4 text-foreground" animateBy="words" direction="bottom" delay={80} stepDuration={0.4} />
          </AnimatedSection>

          {/* Project Description and CTAs */}
          <AnimatedSection delay={0.15}>
            <AnimatedContent distance={30} duration={0.5} delay={0.1}>
              <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    View Source
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </AnimatedContent>
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
            <AnimatedContent distance={40} duration={0.6}>
              <div
                className="relative w-full rounded-lg overflow-hidden bg-[#1a1a2e] border border-border group cursor-zoom-in"
                onClick={() => setLightboxImage(project.image)}
              >
                <Image
                  src={project.image}
                  alt={`${project.title} Architecture`}
                  width={800}
                  height={450}
                  className="w-full h-auto object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
                <div className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </AnimatedContent>
          </AnimatedSection>
        </div>
      </div>

      {/* Stats Bar */}
      {project.stats && (
        <div className="max-w-6xl mx-auto px-6 sm:px-8 -mt-6 relative z-10">
          <AnimatedSection delay={0.3}>
            <AnimatedContent distance={30} duration={0.5}>
              <StatsBar stats={project.stats} />
            </AnimatedContent>
          </AnimatedSection>
        </div>
      )}

      {/* Content Area with TOC Sidebar */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-8 pb-12">
        {/* Role & Links */}
        <AnimatedSection>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">Role:</span>
              <span className="px-2.5 py-1 rounded-md bg-muted/30 text-sm border border-border/50">{project.role}</span>
            </div>

            {/* Share Actions - Desktop */}
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <span className="text-sm font-medium mr-2">Share:</span>
              <button onClick={shareOnTwitter} className="p-2 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors" title="Share on Twitter"><Twitter className="w-4 h-4" /></button>
              <button onClick={shareOnLinkedin} className="p-2 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors" title="Share on LinkedIn"><Linkedin className="w-4 h-4" /></button>
              <button onClick={copyToClipboard} className="p-2 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors" title="Copy Link">
                {copied ? <span className="text-green-500 text-xs font-medium w-4 text-center">✓</span> : <LinkIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </AnimatedSection>

        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0 max-w-[760px]">
            <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
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
                        <div className="section-divider mt-12 pt-8 border-t border-border/50">
                          <h2 id={id} className="flex items-center gap-3 text-2xl font-semibold mb-4 scroll-mt-24 text-foreground">
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
                      <h3 id={id} className="text-lg font-medium mb-3 mt-8 scroll-mt-24 text-foreground">
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
                      <p className="mb-5 leading-[1.75] text-[1.0625rem]">{children}</p>
                    )
                  },
                  ul: ({ children }) => (
                    <ul className="mb-5 ml-5 space-y-2.5 list-disc marker:text-foreground/30">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-5 ml-5 space-y-2.5 list-decimal marker:text-foreground/30">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed pl-1">{children}</li>
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
                    <pre className="bg-[#1a1a2e] border border-border rounded-lg p-4 overflow-x-auto mb-8 text-sm">
                      {children}
                    </pre>
                  ),
                  img: ({ src, alt }) => (
                    <div
                      className="relative w-full my-10 group cursor-zoom-in overflow-hidden rounded-lg border border-border bg-background"
                      onClick={() => setLightboxImage(String(src || ''))}
                    >
                      <Image
                        src={String(src || '')}
                        alt={String(alt || '')}
                        width={800}
                        height={450}
                        className="object-cover w-full group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                      <div className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <ZoomIn className="w-4 h-4 text-foreground" />
                      </div>
                    </div>
                  ),
                  hr: () => (
                    <hr className="my-10 border-border" />
                  ),
                }}
              >
                {preprocessCallouts(markdownContent.replace(/^#\s+.+\n+/, ''))}
              </ReactMarkdown>
            </div>

            {/* Share Actions - Mobile */}
            <div className="sm:hidden mt-8 pt-8 border-t border-border/50">
              <h3 className="text-sm font-medium text-foreground mb-4">Share this project</h3>
              <div className="flex items-center gap-3">
                <button onClick={shareOnTwitter} className="flex-1 flex items-center justify-center gap-2 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors text-sm"><Twitter className="w-4 h-4" /> Twitter</button>
                <button onClick={shareOnLinkedin} className="flex-1 flex items-center justify-center gap-2 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors text-sm"><Linkedin className="w-4 h-4" /> LinkedIn</button>
                <button onClick={copyToClipboard} className="flex-1 flex items-center justify-center gap-2 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors text-sm">
                  {copied ? <span className="text-green-500">Copied!</span> : <><LinkIcon className="w-4 h-4" /> Copy Links</>}
                </button>
              </div>
            </div>

            {/* Next/Previous Project Navigation */}
            <AnimatedContent distance={40} duration={0.6}>
              <div className="mt-16 pt-8 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">More Projects</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {prevProject ? (
                    <Link
                      href={`/projects/${prevProject.id}`}
                      className="group flex flex-col p-5 border border-border rounded-lg hover:border-foreground/30 hover:bg-muted/10 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous Project
                      </div>
                      <div className="font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-4">{prevProject.title}</div>
                      <div className="text-sm text-muted-foreground mt-1 truncate">{prevProject.category}</div>
                    </Link>
                  ) : <div></div>}

                  {nextProject && (
                    <Link
                      href={`/projects/${nextProject.id}`}
                      className="group flex flex-col p-5 border border-border rounded-lg hover:border-foreground/30 hover:bg-muted/10 transition-all text-right sm:items-end"
                    >
                      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mb-2">
                        Next Project <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-4">{nextProject.title}</div>
                      <div className="text-sm text-muted-foreground mt-1 truncate">{nextProject.category}</div>
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedContent>

            {/* Related Blog Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <AnimatedContent distance={40} duration={0.6}>
                <div className="mt-12">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Related Blog Posts</h3>
                  <div className="space-y-3">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blogs/${post.id}`}
                        className="group flex items-center gap-4 p-4 border border-border rounded-lg hover:border-foreground/20 hover:bg-muted/20 transition-all"
                        data-umami-event="content-related-blog"
                        data-umami-event-post={post.id}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted/30 shrink-0">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{post.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {post.readTime} min read
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedContent>
            )}

            {/* Footer Actions */}
            <AnimatedContent distance={30} duration={0.5}>
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <Link
                    href="/projects"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    data-umami-event="nav-back-projects"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                  </Link>

                  <div className="flex items-center gap-4">
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      data-umami-event="nav-portfolio"
                      data-umami-event-from="project"
                    >
                      View Portfolio
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          </main>

          {/* Sidebar TOC */}
          {markdownContent && (
            <aside className="hidden xl:block w-48 shrink-0">
              <div className="sticky top-24">
                <TableOfContents markdown={markdownContent} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Lightbox / Image Zoom */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-background/80 border border-border rounded-full hover:bg-muted/50 transition-colors z-[101]"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={lightboxImage}
              alt="Expanded view"
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
            />
          </div>
        </div>
      )}
    </div>
  )
}
