"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { trackEvent } from "@/lib/analytics"

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

  const handleScroll = useCallback(() => {
    // Query actual h2/h3 elements with IDs from the DOM
    const elements: { id: string; top: number }[] = []
    for (const { id } of headings) {
      const el = document.getElementById(id)
      if (el) {
        elements.push({ id, top: el.getBoundingClientRect().top })
      }
    }

    // Find the last heading that has scrolled past the top of the viewport
    // (with some offset for the sticky header)
    let current = ""
    for (const el of elements) {
      if (el.top < 120) {
        current = el.id
      } else {
        break
      }
    }

    // If nothing has scrolled past yet, highlight the first one
    if (!current && elements.length > 0) {
      current = elements[0].id
    }

    if (current) {
      setActiveId(current)
    }
  }, [headings])

  useEffect(() => {
    // Initial check after a short delay to let the DOM render
    const timer = setTimeout(handleScroll, 100)

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [handleScroll])

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
                trackEvent("content-toc-click", { heading: id })
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
