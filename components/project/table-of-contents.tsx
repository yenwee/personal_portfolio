"use client"

import { useEffect, useMemo, useState } from "react"

interface TOCItem {
  id: string
  text: string
  level: number
}

function extractHeadings(markdown: string): TOCItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: TOCItem[] = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
    headings.push({ id, text, level })
  }

  return headings
}

export function TableOfContents({ markdown }: { markdown: string }) {
  const [activeId, setActiveId] = useState("")
  const headings = useMemo(() => extractHeadings(markdown), [markdown])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        On this page
      </p>
      <ul className="space-y-1.5 text-sm">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
              }}
              className={`block transition-colors duration-200 leading-snug ${
                level === 3 ? "pl-4" : ""
              } ${
                activeId === id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
