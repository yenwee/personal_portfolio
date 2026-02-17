"use client"

import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import blogsData from "@/lib/blogs.json"
import "highlight.js/styles/github-dark.css"

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/blogs"
              className="flex items-center gap-2 text-sm font-mono tracking-wider hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BLOG
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground font-mono hover:text-foreground transition-colors"
            >
              YEN WEE LIM
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-muted-foreground/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-24 pb-12">
          {/* Post Meta */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </div>

          {/* Post Title */}
          <h1 className="text-4xl sm:text-5xl font-light mb-4">{post.title}</h1>

          {/* Post Description */}
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm border border-border rounded-full bg-background/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading post...</div>
          </div>
        ) : (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-light mb-6 mt-8 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-light mb-4 mt-8 border-b border-border pb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium mb-3 mt-6">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 space-y-2 text-muted-foreground">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 space-y-2 text-muted-foreground">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="relative">
                    <span className="relative">{children}</span>
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground/30 pl-6 my-6 text-muted-foreground italic">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="bg-muted/20 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-muted/10 border border-border rounded-lg p-4 overflow-x-auto mb-6">
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
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-border">
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
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                View Portfolio
              </Link>
              <Link
                href="/#connect"
                className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors text-sm font-medium"
              >
                Get In Touch
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
