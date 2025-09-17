"use client"

import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { ArrowLeft, Calendar, User, Tag, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import projectsData from "@/lib/projects.json"
import "highlight.js/styles/github-dark.css"

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>("")

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  const project = projectsData.projects.find(p => p.id === slug)

  useEffect(() => {
    if (project && slug) {
      // Try to load markdown file for the project
      fetch(`/projects/markdown/${project.id}.md`)
        .then(response => {
          if (response.ok) {
            return response.text()
          }
          // If no markdown file exists, create default content
          return `# ${project.title}

${project.description}

## Overview

This project showcases ${project.category.toLowerCase()} capabilities with real-world applications.

## Technologies Used

${project.technologies.map(tech => `- **${tech}**`).join('\n')}

## Project Details

*Add more detailed information about this project by creating a markdown file at:*
\`/public/projects/markdown/${project.id}.md\`

## Key Features

- Feature 1: Description of key functionality
- Feature 2: Another important aspect
- Feature 3: Additional capabilities

## Challenges & Solutions

Describe the main challenges faced during development and how they were solved.

## Results & Impact

- Quantifiable results
- Business impact
- Performance improvements

## Future Enhancements

Plans for future development and improvements.
`
        })
        .then(content => {
          setMarkdownContent(content)
          setLoading(false)
        })
        .catch(() => {
          setMarkdownContent(`# Project Not Found\n\nThe content for this project is not available.`)
          setLoading(false)
        })
    }
  }, [project, slug])

  if (slug && !project) {
    notFound()
  }

  if (!slug) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/projects" 
              className="flex items-center gap-2 text-sm font-mono tracking-wider hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              PROJECTS
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
          {/* Project Meta */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {project.category}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {project.year}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {project.client}
            </div>
            <div className={`px-3 py-1 text-xs font-medium rounded-full ${
              project.status === 'In Production' || project.status === 'Production' 
                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
            }`}>
              {project.status}
            </div>
          </div>

          {/* Project Title */}
          <h1 className="text-4xl sm:text-5xl font-light mb-4">{project.title}</h1>
          
          {/* Project Description */}
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm border border-border rounded-full bg-background/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading project details...</div>
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
              href="/projects"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
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