"use client"

import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { ArrowLeft, ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"
import { useEffect, useState, memo } from "react"
import blogsData from "@/lib/blogs.json"
import { TableOfContents } from "@/components/project/table-of-contents"
import { AnimatedSection } from "@/components/project/animated-section"
import { Callout } from "@/components/project/callout"
import { PullQuote } from "@/components/project/pull-quote"
import { ThemeToggle } from "@/components/theme-toggle"
import "highlight.js/styles/github-dark.css"

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
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

const ReadingProgressBar = memo(function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100))
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

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>("")

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  const post = blogsData.posts.find(p => p.id === slug)

  useEffect(() => {
    if (post && slug) {
      fetch(`/blogs/${post.id}.md`)
        .then(response => {
          if (response.ok) {
            return response.text()
          }
          return `# ${post.title}\n\n${post.description}`
        })
        .then(content => {
          setMarkdownContent(content)
          setLoading(false)
        })
        .catch(() => {
          setMarkdownContent(`# Post Not Found\n\nThe content for this post is not available.`)
          setLoading(false)
        })
    }
  }, [post, slug])

  if (slug && !post) {
    notFound()
  }

  if (!slug) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
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
            </div>
          </AnimatedSection>

          {/* Post Title */}
          <AnimatedSection delay={0.15}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight text-foreground">{post.title}</h1>
          </AnimatedSection>

          {/* Post Description */}
          <AnimatedSection delay={0.2}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {post.description}
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Content Area with TOC Sidebar */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0 py-4 sm:py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading post...</div>
              </div>
            ) : (
              <article className="blog-content max-w-[680px]">
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
                      <pre className="bg-[#1a1a2e] border border-border rounded-lg p-4 overflow-x-auto mb-6 text-sm">
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
                  }}
                >
                  {preprocessCallouts(markdownContent.replace(/^#\s+.+\n+/, ''))}
                </ReactMarkdown>
              </article>
            )}

            {/* Footer Actions */}
            <div className="mt-12 pt-8 border-t border-border max-w-[680px]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link
                  href="/blogs"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>

                <div className="flex items-center gap-4">
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
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
