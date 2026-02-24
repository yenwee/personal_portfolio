import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Yen Wee Lim | AI Engineering & Data Science",
  description: "Thoughts on building AI products, data engineering patterns, and lessons from shipping software at startups and enterprises.",
  alternates: {
    canonical: "https://weeai.dev/blogs",
    languages: {
      "en": "https://weeai.dev/blogs",
      "x-default": "https://weeai.dev/blogs",
    },
  },
  openGraph: {
    title: "Blog - Yen Wee Lim",
    description: "Thoughts on building AI products, data engineering patterns, and lessons from shipping software at startups and enterprises.",
    url: "https://weeai.dev/blogs",
    siteName: "Yen Wee Lim",
    type: "website",
    images: [
      {
        url: "/profile-photo.png",
        width: 1200,
        height: 630,
        alt: "Yen Wee Lim - Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Yen Wee Lim | AI Engineering & Data Science",
    description: "Thoughts on building AI products, data engineering patterns, and lessons from shipping software at startups and enterprises.",
    images: ["/profile-photo.png"],
  },
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
