import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Yen Wee Lim | AI Engineering & Data Science",
  description: "Thoughts on building AI products, data engineering patterns, and lessons from shipping software at startups and enterprises.",
  openGraph: {
    title: "Blog - Yen Wee Lim",
    description: "Thoughts on building AI products, data engineering patterns, and lessons from shipping software at startups and enterprises.",
    url: "https://yenwee.vercel.app/blogs",
  },
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
