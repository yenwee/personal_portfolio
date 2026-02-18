import type { Metadata } from "next"
import type React from "react"
import projectsData from "@/lib/projects.json"

const SITE_URL = "https://weeai.dev"

interface ProjectLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projectsData.projects.find((p) => p.id === slug)

  if (!project) {
    return {
      title: "Project Not Found | Yen Wee Lim",
    }
  }

  const title = `${project.title} | Yen Wee Lim`
  const description = project.description

  return {
    title,
    description,
    openGraph: {
      title: project.title,
      description,
      url: `${SITE_URL}/projects/${project.id}`,
      siteName: "Yen Wee Lim",
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
  }
}

export default function ProjectDetailLayout({ children }: ProjectLayoutProps) {
  return <>{children}</>
}
