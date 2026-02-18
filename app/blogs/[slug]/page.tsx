import fs from "node:fs"
import path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import blogsData from "@/lib/blogs.json"
import projectsData from "@/lib/projects.json"
import BlogDetailClient from "./blog-detail-client"

interface BlogPost {
  id: string
  title: string
  description: string
  date: string
  tags: string[]
  featured: boolean
  readTime?: number
}

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogsData.posts.map((post) => ({
    slug: post.id,
  }))
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogsData.posts.find((p) => p.id === slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Yen Wee Lim`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

function readMarkdownFile(slug: string): string | null {
  const filePath = path.join(process.cwd(), "public", "blogs", `${slug}.md`)
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return null
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const post = blogsData.posts.find((p) => p.id === slug) as BlogPost | undefined

  if (!post) {
    notFound()
  }

  const markdownContent = readMarkdownFile(slug) ?? `# ${post.title}\n\n${post.description}`

  const relatedProjectId = (post as { relatedProject?: string }).relatedProject
  const relatedProject = relatedProjectId
    ? projectsData.projects.find((p) => p.id === relatedProjectId)
    : undefined

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://weeai.dev/blogs/${slug}`,
    author: {
      "@type": "Person",
      name: "Yen Wee Lim",
      url: "https://weeai.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Yen Wee Lim",
      url: "https://weeai.dev",
    },
    keywords: post.tags,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient
        post={post}
        markdownContent={markdownContent}
        slug={slug}
        relatedProject={relatedProject ? { id: relatedProject.id, title: relatedProject.title, category: relatedProject.category } : undefined}
      />
    </>
  )
}
