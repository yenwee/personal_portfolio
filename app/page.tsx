"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import contentData from "@/lib/content.json"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics"
import SplitText from "@/components/reactbits/SplitText"
import ScrollFloat from "@/components/reactbits/ScrollFloat"
import Dock from "@/components/reactbits/Dock"
import "@/components/reactbits/Dock.css"
import TiltedCard from "@/components/reactbits/TiltedCard"
import LogoLoop from "@/components/reactbits/LogoLoop"
import "@/components/reactbits/LogoLoop.css"
import AnimatedContent from "@/components/reactbits/AnimatedContent"

const NAV_ITEMS: { name: string; id: string; href?: string }[] = [
  { name: "Services", id: "services" },
  { name: "Experience", id: "work" },
  { name: "Projects", id: "projects", href: "/projects" },
  { name: "Blog", id: "blog", href: "/blogs" },
  { name: "Connect", id: "connect" },
]

const SECTION_IDS = ['intro', 'services', 'work', 'education', 'connect']

export default function Home() {
  const [activeSection, setActiveSection] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const viewedSectionsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            if (entry.target.id) {
              setActiveSection(entry.target.id)
              if (!viewedSectionsRef.current.has(entry.target.id)) {
                viewedSectionsRef.current.add(entry.target.id)
                trackEvent(ANALYTICS_EVENTS.SECTION_VIEW, { section: entry.target.id })
              }
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    )

    document.querySelectorAll(".section-reveal").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return

      // Cmd/Ctrl+K → command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdkOpen(prev => !prev)
        return
      }

      // Esc → close menu/palette
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setCmdkOpen(false)
        return
      }

      // t → toggle theme
      if (e.key === 't') {
        document.documentElement.classList.toggle('dark')
        const isDark = document.documentElement.classList.contains('dark')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        return
      }

      // 1-5 → jump to sections
      const num = parseInt(e.key)
      if (num >= 1 && num <= SECTION_IDS.length) {
        e.preventDefault()
        const sectionId = SECTION_IDS[num - 1]
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
        setCmdkOpen(false)
      }

      // Home/End
      if (e.key === 'Home') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      if (e.key === 'End') {
        e.preventDefault()
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
    setCmdkOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-[2px]">
        <div
          className="h-full bg-foreground/20 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-sm font-mono tracking-wider">{contentData.personal.name.toUpperCase()}</div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                {NAV_ITEMS.map((item) => (
                  item.href ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="text-sm transition-colors duration-300 hover:text-foreground text-muted-foreground"
                      data-umami-event={`nav-${item.id}`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`relative text-sm transition-colors duration-300 hover:text-foreground ${
                        activeSection === item.id ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                      {activeSection === item.id && (
                        <span className="absolute -bottom-1 left-0 right-0 h-px bg-foreground/50" />
                      )}
                    </button>
                  )
                ))}
                <Link
                  href={contentData.connect.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium text-sm px-4 py-1.5 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-all duration-300 font-medium whitespace-nowrap"
                  data-umami-event="cta-book-call"
                  data-umami-event-location="nav"
                >
                  Book a Call
                </Link>
              </div>
              <button
                onClick={() => setCmdkOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/60 hover:border-foreground/30 text-muted-foreground/40 hover:text-muted-foreground transition-all duration-300"
                aria-label="Open command palette"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <span className="text-[10px] font-mono">&#8984;K</span>
              </button>
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm animate-menu-open">
            <div className="max-w-6xl mx-auto px-6 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                item.href ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="block w-full text-left px-3 py-3 rounded-lg text-sm transition-colors duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3 py-3 rounded-lg text-sm transition-colors duration-200 ${
                      activeSection === item.id
                        ? "text-foreground bg-muted/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                    }`}
                  >
                    {item.name}
                  </button>
                )
              ))}
              <div className="pt-3 mt-2 border-t border-border">
                <Link
                  href={contentData.connect.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-3 py-3 bg-foreground text-background rounded-lg text-sm font-medium transition-colors duration-200"
                  data-umami-event="cta-book-call"
                  data-umami-event-location="nav-mobile"
                >
                  Book a Call
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Cmd+K Command Palette */}
      {cmdkOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={() => setCmdkOpen(false)}>
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md mx-4 bg-background border border-border rounded-lg shadow-2xl overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-border/50 text-xs text-muted-foreground/50 font-mono flex items-center justify-between">
              <span>NAVIGATE</span>
              <span>ESC to close</span>
            </div>
            <div className="py-2">
              {SECTION_IDS.map((id, index) => {
                const labels: Record<string, string> = { intro: 'Home', services: 'Services', work: 'Experience', education: 'Education', connect: 'Connect' }
                return (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-sm transition-colors duration-150 hover:bg-muted/50 ${activeSection === id ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    <span>{labels[id] || id}</span>
                    <span className="text-xs text-muted-foreground/40 font-mono">{index + 1}</span>
                  </button>
                )
              })}
              <div className="border-t border-border/30 mt-1 pt-1">
                <Link href="/projects" className="w-full px-4 py-2.5 flex items-center text-sm text-muted-foreground hover:bg-muted/50 transition-colors duration-150" onClick={() => setCmdkOpen(false)}>Projects</Link>
                <Link href="/blogs" className="w-full px-4 py-2.5 flex items-center text-sm text-muted-foreground hover:bg-muted/50 transition-colors duration-150" onClick={() => setCmdkOpen(false)}>Blog</Link>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-border/30 flex items-center gap-4 text-[10px] text-muted-foreground/40 font-mono">
              <span>1-5 jump</span>
              <span>t theme</span>
              <span>Home/End scroll</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 relative">
        <header
          id="intro"
          className="py-16 sm:py-24 flex items-center"
        >
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full items-center">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider hero-stagger" style={{ animationDelay: '0ms' }}>
                  {contentData.header.tagline}
                </div>
                <SplitText
                  text={contentData.personal.name}
                  tag="h1"
                  className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight"
                  charClassName="text-foreground"
                  delay={50}
                  duration={0.6}
                  textAlign="left"
                />
              </div>

              <div className="space-y-3 hero-stagger" style={{ animationDelay: '150ms' }}>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {contentData.personal.title}
                  {contentData.personal.titleHighlights.map((highlight, index) => (
                    <span key={index} className="text-foreground font-medium underline decoration-foreground/20 underline-offset-4">{highlight}</span>
                  ))}
                  {contentData.personal.titleClosing}
                </p>
                <div className="text-sm text-muted-foreground/60">
                  AI agents, full-stack apps, data platforms. Ship to production.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 hero-stagger" style={{ animationDelay: '300ms' }}>
                <Link
                  href="/projects"
                  className="group btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg text-sm font-medium"
                  data-umami-event="cta-view-work"
                >
                  View My Work
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={contentData.connect.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 border border-foreground/30 rounded-lg hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-300 hover:shadow-sm text-sm font-medium"
                  data-umami-event="cta-book-call"
                  data-umami-event-location="hero"
                >
                  Book a Call
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground/60 hero-stagger" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-status-pulse"></div>
                  {contentData.personal.availability}
                </div>
                <span>&middot;</span>
                <div>{contentData.personal.location}</div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 hero-stagger" style={{ animationDelay: '500ms' }}>
                {contentData.metrics.map((metric: { value: string; label: string }, index: number) => (
                  <div key={index} className="flex items-baseline gap-1.5">
                    <span className="text-sm font-medium text-foreground">{metric.value}</span>
                    <span className="text-xs text-muted-foreground/50">{metric.label}</span>
                  </div>
                ))}
                {contentData.publishedIn.map((pub: { name: string; logo: string; url: string }, index: number) => (
                  <Link
                    key={`pub-${index}`}
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors duration-300"
                  >
                    <Image src={pub.logo} alt={pub.name} width={14} height={14} className="rounded-[2px] opacity-50" />
                    <span className="text-xs">{pub.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 flex justify-center lg:justify-end order-first lg:order-last hero-stagger" style={{ animationDelay: '100ms' }}>
              <Image
                src="/profile-photo.png"
                alt="Yen Wee Lim - Professional headshot"
                width={400}
                height={400}
                className="w-48 h-48 sm:w-64 sm:h-64 lg:w-full lg:h-auto rounded-2xl object-cover profile-image shadow-lg border border-border/50"
                priority
              />
            </div>
          </div>
          
        </header>

        {/* Back to top */}
        {activeSection && activeSection !== 'intro' && (
          <div className="fixed bottom-8 right-8 z-10">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2 px-3 h-9 rounded-full border border-border/60 hover:border-foreground/50 transition-all duration-300 bg-background/80 backdrop-blur-sm"
              aria-label="Back to top"
              data-umami-event="nav-back-to-top"
            >
              <svg
                className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-[10px] text-muted-foreground/50 font-mono tracking-wider group-hover:text-muted-foreground transition-colors duration-300">
                TOP
              </span>
            </button>
          </div>
        )}

        <section
          id="services"
          className="py-16 sm:py-24 section-reveal"
        >
          <div className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <ScrollFloat containerClassName="text-2xl sm:text-3xl font-light" animationDuration={0.5} stagger={0.02}>What I Do</ScrollFloat>
              <div className="text-xs text-muted-foreground font-mono tracking-wider">SERVICES</div>
            </div>

            <div className="space-y-6">
              {contentData.services.map((service, index) => (
                <div
                  key={index}
                  className="group grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-8 py-4 border-b border-border/30 last:border-b-0"
                >
                  <h3 className="text-sm font-medium text-foreground sm:text-right">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-10 sm:py-14 section-reveal">
          <div className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-light">Tech Stack</h2>
              <div className="text-xs text-muted-foreground font-mono tracking-wider">TOOLS I SHIP WITH</div>
            </div>

            <div className="space-y-6">
              {contentData.technicalSkills.map((group: { category: string; skills: string[] }, index: number) => (
                <div key={index} className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-8">
                  <div className="text-xs text-muted-foreground font-mono tracking-wider sm:text-right pt-1">{group.category.toUpperCase()}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 text-xs text-foreground/80 bg-muted/50 rounded-md border border-border/50 hover:border-muted-foreground/40 transition-colors duration-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="work"
          className="py-16 sm:py-24 -mx-6 sm:-mx-8 px-6 sm:px-8 bg-muted/30 rounded-2xl section-reveal"
        >
          <div className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-light">Experience</h2>
              <div className="text-xs text-muted-foreground font-mono tracking-wider">2022 — PRESENT</div>
            </div>

            <div className="space-y-0">
              {contentData.workExperience.map((job: { year: string; role: string; company: string; highlights: string[]; tech: string[]; logo: string }, index: number) => (
                <div
                  key={index}
                  className="group card-lift relative pl-8 pb-10 last:pb-0 border-l border-border/60"
                >
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-muted-foreground/30 -translate-x-[calc(50%+0.5px)] group-hover:bg-foreground transition-colors duration-300" />

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 relative shrink-0">
                        <Image
                          src={job.logo || "/placeholder.svg"}
                          alt={`${job.company} logo`}
                          fill
                          className="rounded-sm object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{job.role}</h3>
                        <div className="text-sm text-muted-foreground">{job.company}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1 sm:mt-1 shrink-0">{job.year}</div>
                  </div>

                  <ul className="space-y-1.5 mb-3">
                    {job.highlights.slice(0, 2).map((highlight, i) => (
                      <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-1 flex items-baseline gap-2">
                        <span className="text-muted-foreground/40 shrink-0">{"\u2013"}</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[11px] text-muted-foreground/70 bg-muted/50 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 sm:py-16 section-reveal">
          <div className="space-y-8 sm:space-y-10">
            <div className="text-xs text-muted-foreground font-mono tracking-wider">WHAT PEOPLE SAY</div>

            <div className="space-y-8">
              {contentData.testimonials.map((testimonial: { quote: string; name: string; title: string; company: string }, index: number) => (
                <blockquote key={index} className="border-l-2 border-foreground/20 pl-6 py-1">
                  <p className="text-muted-foreground leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer className="mt-3 text-sm">
                    <span className="text-foreground font-medium">{testimonial.name}</span>
                    <span className="text-muted-foreground/50"> / </span>
                    <span className="text-muted-foreground/70">
                      {testimonial.title ? `${testimonial.title}, ${testimonial.company}` : testimonial.company}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Speaking & Talks */}
        <section className="py-16 sm:py-24 section-reveal">
          <div className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-light">Speaking & Talks</h2>
              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground font-mono tracking-wider hidden sm:block">SHARING KNOWLEDGE</div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const container = document.getElementById('speaking-scroll');
                      if (container) container.scrollBy({ left: -340, behavior: 'smooth' });
                    }}
                    className="w-8 h-8 rounded-full border border-border/60 hover:border-foreground/50 flex items-center justify-center transition-all duration-300 hover:bg-muted/30"
                    aria-label="Scroll left"
                  >
                    <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const container = document.getElementById('speaking-scroll');
                      if (container) container.scrollBy({ left: 340, behavior: 'smooth' });
                    }}
                    className="w-8 h-8 rounded-full border border-border/60 hover:border-foreground/50 flex items-center justify-center transition-all duration-300 hover:bg-muted/30"
                    aria-label="Scroll right"
                  >
                    <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div id="speaking-scroll" className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 sm:-mx-8 sm:px-8">
              {contentData.speaking.map((talk: { title: string; event: string; date: string; description: string; image: string }, index: number) => (
                <AnimatedContent
                  key={index}
                  distance={40}
                  direction="horizontal"
                  delay={index * 0.15}
                  className="snap-start shrink-0 w-[280px] sm:w-[320px]"
                >
                  <TiltedCard rotateAmplitude={8} scaleOnHover={1.02} className="rounded-lg overflow-hidden border border-border/50 hover:border-border transition-all duration-300 h-full bg-background">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={talk.image}
                        alt={talk.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-medium text-foreground text-sm">{talk.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>{talk.event}</span>
                        <span className="text-muted-foreground/40">&middot;</span>
                        <span className="font-mono">{talk.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed">{talk.description}</p>
                    </div>
                  </TiltedCard>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        <section
          id="education"
          className="py-16 sm:py-24 section-reveal"
        >
          <div className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-light">Education & Credentials</h2>
              <div className="text-xs text-muted-foreground font-mono tracking-wider">QUALIFICATIONS</div>
            </div>

            <div className="space-y-6">
              {contentData.education.map((edu, index) => (
                <div key={index} className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-8">
                  <div className="flex items-center gap-2.5 sm:justify-end">
                    <div className="w-7 h-7 relative shrink-0">
                      <Image src={edu.logo} alt={edu.institution} fill className="rounded-sm object-contain" />
                    </div>
                    <span className="text-xs text-muted-foreground/60 font-mono">{edu.period.replace(/[A-Za-z]+\s/g, "")}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{edu.degree}</h3>
                    <div className="text-sm text-muted-foreground">{edu.institution} {"\u00b7"} {edu.honors} {"\u00b7"} {edu.gpa.replace(/^Cumulative GPA:\s*/, "")}</div>
                  </div>
                </div>
              ))}
            </div>

            <LogoLoop
              logos={contentData.certifications.map((cert) => ({
                node: (
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-muted/30 border border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-300">
                    <Image src={cert.logo} alt={cert.name} width={18} height={18} className="rounded-[2px]" />
                    <span className="text-sm text-foreground whitespace-nowrap">{cert.name}</span>
                    <span className="text-xs text-muted-foreground/60 whitespace-nowrap">{cert.level}</span>
                  </div>
                ),
              }))}
              speed={40}
              pauseOnHover
              logoHeight={36}
              gap={12}
              className="pt-2"
            />
          </div>
        </section>

        <section id="connect" className="py-20 sm:py-32 section-reveal">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-4">
              <ScrollFloat containerClassName="text-2xl sm:text-3xl font-light" animationDuration={0.5} stagger={0.02}>Have a project in mind?</ScrollFloat>
              <p className="text-muted-foreground leading-relaxed">
                I ship production AI systems, data platforms, and full-stack apps. If you have a problem that needs solving, let&apos;s talk.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={contentData.connect.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-premium inline-flex items-center gap-2.5 px-5 py-2.5 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all duration-300 text-sm font-medium"
                data-umami-event="cta-book-call"
                data-umami-event-location="connect"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book a Call
              </Link>
              <Link
                href="mailto:hello@weeai.dev"
                className="group btn-premium inline-flex items-center gap-2.5 px-5 py-2.5 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 text-sm font-medium"
                data-umami-event="contact-email"
              >
                hello@weeai.dev
                <svg className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={contentData.personal.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-premium inline-flex items-center gap-2.5 px-5 py-2.5 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 text-sm font-medium text-muted-foreground"
                data-umami-event="download-resume"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">{contentData.connect.callDescription}</p>

            <div className="pt-2 pb-4">
            <Dock
              items={[
                {
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                  label: "LinkedIn",
                  onClick: () => window.open("https://www.linkedin.com/in/yenwee-lim/", "_blank"),
                },
                {
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
                  label: "GitHub",
                  onClick: () => window.open("https://github.com/yenwee", "_blank"),
                },
                {
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>,
                  label: "Medium",
                  onClick: () => window.open(contentData.personal.medium, "_blank"),
                },
                {
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
                  label: "WhatsApp",
                  onClick: () => window.open(`https://wa.me/${contentData.personal.whatsappNumber}`, "_blank"),
                },
              ]}
              magnification={60}
              baseItemSize={40}
              panelHeight={56}
              distance={150}
              className=""
            />
            </div>

            <p className="text-xs text-muted-foreground/60 font-mono tracking-wider">{contentData.connect.pricingSignal}</p>
          </div>
        </section>

        <footer className="py-10 border-t border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs text-muted-foreground/60">{contentData.footer.copyright}</div>
            <div className="text-xs text-muted-foreground/40">{contentData.personal.location}</div>
          </div>
        </footer>
      </main>

    </div>
  )
}
