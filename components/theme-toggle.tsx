"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored) {
      setIsDark(stored === "dark")
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", isDark)
      localStorage.setItem("theme", isDark ? "dark" : "light")
    }
  }, [isDark, mounted])

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="relative overflow-hidden p-2 rounded-lg hover:bg-muted/50 transition-colors duration-300"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-umami-event="ui-theme-toggle"
    >
      {mounted ? (
        <span key={isDark ? "sun" : "moon"} className="block animate-theme-icon">
          {isDark ? (
            <Sun className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Moon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </span>
      ) : (
        <div className="w-4 h-4" />
      )}
    </button>
  )
}
