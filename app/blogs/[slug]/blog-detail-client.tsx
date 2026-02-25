"use client"

import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { ArrowLeft, ArrowRight, Calendar, Clock, ChevronRight, ChevronLeft, FolderOpen, ArrowUp, Twitter, Linkedin, Link as LinkIcon, ZoomIn, X } from "lucide-react"
import { useEffect, useState, useRef, memo } from "react"
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics"
import { TableOfContents } from "@/components/project/table-of-contents"
import { AnimatedSection } from "@/components/project/animated-section"
import { Callout } from "@/components/project/callout"
import { PullQuote } from "@/components/project/pull-quote"
import { ThemeToggle } from "@/components/theme-toggle"
import BlurText from "@/components/reactbits/BlurText"
import AnimatedContent from "@/components/reactbits/AnimatedContent"
import contentData from "@/lib/content.json"
import blogsData from "@/lib/blogs.json"
import "highlight.js/styles/github-dark-dimmed.min.css"

interface CrossPost {
  name: string
  url: string
  logo: string
}

interface BlogPost {
  id: string
  title: string
  description: string
  date: string
  tags: string[]
  featured: boolean
  readTime?: number
  crossPostedOn?: CrossPost[]
}

interface RelatedProject {
  id: string
  title: string
  category: string
}

interface BlogDetailClientProps {
  post: BlogPost
  markdownContent: string
  slug: string
  relatedProject?: RelatedProject
}

const SECTION_ACCENTS: Record<string, string> = {
  why: "bg-amber-500",
  problem: "bg-amber-500",
  fail: "bg-amber-500",
  challenge: "bg-amber-500",
  how: "bg-blue-500",
  architecture: "bg-blue-500",
  approach: "bg-blue-500",
  build: "bg-blue-500",
  decision: "bg-purple-500",
  routing: "bg-blue-500",
  layer: "bg-indigo-500",
  permission: "bg-purple-500",
  autonomy: "bg-purple-500",
  human: "bg-teal-500",
  monitor: "bg-cyan-500",
  observ: "bg-cyan-500",
  lesson: "bg-green-500",
  result: "bg-green-500",
  impact: "bg-green-500",
  learn: "bg-green-500",
  come: "bg-green-500",
  next: "bg-green-500",
  what: "bg-amber-500",
}

function getSectionAccent(text: string): string {
  const lower = text.toLowerCase()
  for (const [keyword, accent] of Object.entries(SECTION_ACCENTS)) {
    if (lower.includes(keyword)) return accent
  }
  return "bg-foreground/70"
}

type CalloutType = "insight" | "challenge" | "decision" | "metric" | "note" | "warning" | "danger" | "caution"

const CALLOUT_TYPES = "insight|challenge|decision|metric|note|warning|danger|caution"
const CALLOUT_REGEX = new RegExp(
  `^> \\[!(${CALLOUT_TYPES})\\]\\s*(.+)\\n((?:> .+(?:\\n|$))+)`,
  "gm"
)

function preprocessCallouts(markdown: string): string {
  return markdown.replace(CALLOUT_REGEX, (_, type, title, bodyLines) => {
    const encodedTitle = title.trim().replace(/\|/g, "\\|")
    const body = bodyLines
      .split("\n")
      .map((line: string) => line.replace(/^>\s?/, ""))
      .join(" ")
      .trim()
    return `[CALLOUT:${type}:${encodedTitle}] ${body}\n`
  })
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
            trackEvent(ANALYTICS_EVENTS.READING_PROGRESS, { milestone })
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

export default function BlogDetailClient({ post, markdownContent, slug, relatedProject }: BlogDetailClientProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const currentIndex = blogsData.posts.findIndex(p => p.id === post.id)
  const prevPost = currentIndex > 0 ? blogsData.posts[currentIndex - 1] : null
  const nextPost = currentIndex < blogsData.posts.length - 1 && currentIndex !== -1 ? blogsData.posts[currentIndex + 1] : null

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://weeai.dev/blogs/${slug}`

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackEvent("share_blog", { platform: "copy_link", post: post.id })
  }

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this article: ${post.title}`)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    trackEvent("share_blog", { platform: "twitter", post: post.id })
  }

  const shareOnLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
    trackEvent("share_blog", { platform: "linkedin", post: post.id })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getReadTime = () => post.readTime ?? 5

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Navigation */}
      <nav className="fixed top-[2px] left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/blogs"
              className="flex items-center gap-2 text-sm font-mono tracking-wider hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BLOG
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/projects" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Projects
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
                data-umami-event-location="blog-nav"
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
          <AnimatedSection>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/blogs" className="hover:text-foreground transition-colors">Blog</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="truncate">{post.title}</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <AnimatedContent distance={30} duration={0.5}>
              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {getReadTime()} min read
                </div>
                <div className="flex items-center gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs border border-border rounded-md bg-background/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {post.crossPostedOn && post.crossPostedOn.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/40">|</span>
                    {post.crossPostedOn.map((cp) => (
                      <Link
                        key={cp.name}
                        href={cp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border rounded-md bg-background/50 hover:border-foreground/30 hover:text-foreground transition-colors"
                      >
                        <Image src={cp.logo} alt={cp.name} width={14} height={14} className="rounded-[2px]" />
                        <span>Published on {cp.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedContent>
          </AnimatedSection>

          {/* Post Title */}
          <AnimatedSection delay={0.15}>
            <BlurText text={post.title} tag="h1" className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight text-foreground" animateBy="words" direction="bottom" delay={80} stepDuration={0.4} />
          </AnimatedSection>

          {/* Post Description */}
          <AnimatedSection delay={0.2}>
            <AnimatedContent distance={30} duration={0.5} delay={0.1}>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {post.description}
              </p>
            </AnimatedContent>
          </AnimatedSection>
        </div>
      </div>

      {/* Content Area with TOC Sidebar */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0 py-4 sm:py-8 max-w-[760px]">

            {/* Share Actions - Desktop Top */}
            <AnimatedSection>
              <div className="hidden sm:flex items-center gap-2 text-muted-foreground mb-8 pb-8 border-b border-border/50">
                <span className="text-sm font-medium mr-2">Share this article:</span>
                <button onClick={shareOnTwitter} className="p-2 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors" title="Share on Twitter"><Twitter className="w-4 h-4" /></button>
                <button onClick={shareOnLinkedin} className="p-2 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors" title="Share on LinkedIn"><Linkedin className="w-4 h-4" /></button>
                <button onClick={copyToClipboard} className="p-2 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors" title="Copy Link">
                  {copied ? <span className="text-green-500 text-xs font-medium w-4 text-center">✓</span> : <LinkIcon className="w-4 h-4" />}
                </button>
              </div>
            </AnimatedSection>

            <article className="blog-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({ children }) => (
                    <AnimatedSection>
                      <h1 className="text-3xl font-light mb-6 mt-16 first:mt-0 text-foreground">{children}</h1>
                    </AnimatedSection>
                  ),
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
                        <div className="section-divider mt-14 pt-8 border-t border-border/50">
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
                        /^\[CALLOUT:(insight|challenge|decision|metric|note|warning|danger|caution):(.+?)\]\s*(.*)/
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
                      <p className="mb-5 text-muted-foreground leading-[1.75] text-[1.0625rem]">{children}</p>
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
                  blockquote: ({ children }) => (
                    <PullQuote>{children}</PullQuote>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em>{children}</em>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground transition-colors"
                      data-umami-event="content-external-link"
                      data-umami-event-url={href}
                    >
                      {children}
                    </a>
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
                    <pre className="bg-[#22272e] text-[#adbac7] border border-[#444c56] rounded-lg p-4 overflow-x-auto mb-6 text-sm">
                      {children}
                    </pre>
                  ),
                  hr: () => (
                    <hr className="my-10 border-border" />
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-6 border border-border rounded-lg">
                      <table className="w-full text-sm">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-muted/30 border-b border-border">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-3 text-left font-medium text-foreground">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3 text-muted-foreground border-t border-border/50">{children}</td>
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
                }}
              >
                {preprocessCallouts(markdownContent.replace(/^#\s+.+\n+/, ''))}
              </ReactMarkdown>
            </article>

            {/* Share Actions - Mobile Bottom */}
            <div className="sm:hidden mt-8 pt-8 border-t border-border/50">
              <h3 className="text-sm font-medium text-foreground mb-4">Share this article</h3>
              <div className="flex items-center gap-3">
                <button onClick={shareOnTwitter} className="flex-1 flex items-center justify-center gap-2 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors text-sm"><Twitter className="w-4 h-4" /> Twitter</button>
                <button onClick={shareOnLinkedin} className="flex-1 flex items-center justify-center gap-2 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors text-sm"><Linkedin className="w-4 h-4" /> LinkedIn</button>
                <button onClick={copyToClipboard} className="flex-1 flex items-center justify-center gap-2 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors text-sm">
                  {copied ? <span className="text-green-500">Copied!</span> : <><LinkIcon className="w-4 h-4" /> Copy Links</>}
                </button>
              </div>
            </div>

            {/* Next/Previous Navigation */}
            <AnimatedContent distance={40} duration={0.6}>
              <div className="mt-16 pt-8 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">More from the blog</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {prevPost ? (
                    <Link
                      href={`/blogs/${prevPost.id}`}
                      className="group flex flex-col p-5 border border-border rounded-lg hover:border-foreground/30 hover:bg-muted/10 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous Post
                      </div>
                      <div className="font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-4 leading-snug">{prevPost.title}</div>
                      <div className="text-xs text-muted-foreground/60 flex items-center gap-2 mt-2">
                        <Calendar className="w-3 h-3" /> {formatDate(prevPost.date)}
                      </div>
                    </Link>
                  ) : <div></div>}

                  {nextPost && (
                    <Link
                      href={`/blogs/${nextPost.id}`}
                      className="group flex flex-col p-5 border border-border rounded-lg hover:border-foreground/30 hover:bg-muted/10 transition-all text-right sm:items-end"
                    >
                      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mb-2">
                        Next Post <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-4 leading-snug">{nextPost.title}</div>
                      <div className="text-xs text-muted-foreground/60 flex items-center gap-2 mt-2">
                        <Calendar className="w-3 h-3" /> {formatDate(nextPost.date)}
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedContent>

            {/* Related Project */}
            {relatedProject && (
              <AnimatedContent distance={40} duration={0.6}>
                <div className="mt-12">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Related Project</h3>
                  <Link
                    href={`/projects/${relatedProject.id}`}
                    className="group flex items-center gap-4 p-4 border border-border rounded-lg hover:border-foreground/20 hover:bg-muted/20 transition-all"
                    data-umami-event="content-related-project"
                    data-umami-event-project={relatedProject.id}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted/30 shrink-0">
                      <FolderOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{relatedProject.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        {relatedProject.category}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </Link>
                </div>
              </AnimatedContent>
            )}

            {/* Footer Actions */}
            <AnimatedContent distance={30} duration={0.5}>
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <Link
                    href="/blogs"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    data-umami-event="nav-back-blog"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                  </Link>

                  <div className="flex items-center gap-4">
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      data-umami-event="nav-portfolio"
                      data-umami-event-from="blog"
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
              <TableOfContents markdown={markdownContent} />
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

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 bg-foreground text-background rounded-full shadow-lg transition-all duration-300 transform z-50 hover:scale-110 focus:outline-none ${showScrollTop ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
          }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </div>
  )
}
