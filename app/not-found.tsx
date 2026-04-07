import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <div className="text-7xl font-light tracking-tight text-foreground">404</div>
          <p className="text-muted-foreground">This page doesn't exist. Here's where you can go instead.</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/" className="px-4 py-3 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors duration-300 font-medium">
            Home
          </Link>
          <Link href="/projects" className="px-4 py-3 text-sm border border-border rounded-lg hover:border-foreground/30 transition-colors duration-300">
            Projects
          </Link>
          <Link href="/blogs" className="px-4 py-3 text-sm border border-border rounded-lg hover:border-foreground/30 transition-colors duration-300">
            Blog
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground/50 font-mono">
          If you followed a link here, it may have moved.
        </p>
      </div>
    </div>
  )
}
