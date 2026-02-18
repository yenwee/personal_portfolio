import fs from "node:fs"
import path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import projectsData from "@/lib/projects.json"
import ProjectDetailClient from "./project-detail-client"

interface ProjectStat {
  value: string
  label: string
}

interface ProjectType {
  id: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  status: string
  year: string
  client: string
  featured: boolean
  stats?: ProjectStat[]
  highlights: string[]
  role: string
  github?: string
}

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projectsData.projects.map((project) => ({
    slug: project.id,
  }))
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projectsData.projects.find((p) => p.id === slug)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} | Yen Wee Lim`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
  }
}

function readMarkdownFile(slug: string): string | null {
  const filePath = path.join(process.cwd(), "public", "projects", "markdown", `${slug}.md`)
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return null
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = projectsData.projects.find((p) => p.id === slug) as ProjectType | undefined

  if (!project) {
    notFound()
  }

  const markdownContent = readMarkdownFile(slug) ?? `## Overview\n\n${project.description}\n\n*Detailed write-up coming soon.*`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.description,
    url: `https://weeai.dev/projects/${slug}`,
    author: {
      "@type": "Person",
      name: "Yen Wee Lim",
      url: "https://weeai.dev",
    },
    proficiencyLevel: "Expert",
    dependencies: project.technologies.join(", "),
    keywords: project.technologies,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailClient
        project={project}
        markdownContent={markdownContent}
        slug={slug}
      />
    </>
  )
}
