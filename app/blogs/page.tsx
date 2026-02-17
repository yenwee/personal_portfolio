"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react"
import blogsData from "@/lib/blogs.json"

export default function BlogsPage() {
  const { posts } = blogsData

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

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
              href="/"
              className="flex items-center gap-2 text-sm font-mono tracking-wider hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              YEN WEE LIM
            </Link>
            <div className="text-sm text-muted-foreground font-mono">ARTICLES</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-light mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Thoughts on building AI products, data engineering patterns, and lessons
            from shipping software at startups and enterprises.
          </p>
        </div>

        {/* Posts List */}
        <div className="divide-y divide-border">
          {sortedPosts.map((post) => (
            <article key={post.id} className="py-8 first:pt-0">
              {/* Date */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-light mb-2">
                <Link
                  href={`/blogs/${post.id}`}
                  className="hover:text-muted-foreground transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                {post.description}
              </p>

              {/* Tags & Read More */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs border border-border rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blogs/${post.id}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  Read More
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">
            More posts coming soon. Stay tuned!
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
