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
      className="p-2 rounded-lg hover:bg-muted/50 transition-colors duration-300"
      aria-label="Toggle theme"
    >
      {mounted ? (
        isDark ? (
          <Sun className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
        ) : (
          <Moon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
        )
      ) : (
        <div className="w-4 h-4" />
      )}
    </button>
  )
}
