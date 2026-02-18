import type { Metadata } from "next"
import blogsData from "@/lib/blogs.json"

interface BlogLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogsData.posts.find((p) => p.id === slug)

  if (!post) {
    return { title: "Post Not Found | Yen Wee Lim" }
  }

  const url = `https://weeai.dev/blogs/${slug}`

  return {
    title: `${post.title} | Yen Wee Lim`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "Yen Wee Lim",
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return children
}
