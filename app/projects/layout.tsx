import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects - Yen Wee Lim | AI/ML & Full-Stack Portfolio",
  description: "A showcase of AI/ML projects, data engineering solutions, and web applications built for enterprise clients and personal development.",
  openGraph: {
    title: "Projects - Yen Wee Lim",
    description: "A showcase of AI/ML projects, data engineering solutions, and web applications built for enterprise clients and personal development.",
    url: "https://yenwee.vercel.app/projects",
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
