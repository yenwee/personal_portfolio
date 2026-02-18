"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import contentData from "@/lib/content.json"
import { Bot, Globe, Settings, TrendingUp, Menu, X, Quote } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const NAV_ITEMS: { name: string; id: string; href?: string }[] = [
  { name: "Projects", id: "projects", href: "/projects" },
  { name: "Blog", id: "blog", href: "/blogs" },
  { name: "Connect", id: "connect" },
]

export default function Home() {
  const [activeSection, setActiveSection] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
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
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-sm transition-colors duration-300 hover:text-foreground ${
                        activeSection === item.id ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </button>
                  )
                ))}
                <Link
                  href={contentData.connect.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-4 py-1.5 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-all duration-300 font-medium whitespace-nowrap"
                >
                  Start a Project
                </Link>
              </div>
              <button
                onClick={toggleTheme}
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
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {[
            { id: "intro", label: "Home" },
            { id: "services", label: "Services" },
            { id: "work", label: "Experience" },
            { id: "education", label: "Education" },
            { id: "connect", label: "Connect" },
          ].map((section) => (
            <div key={section.id} className="group relative">
              <button
                onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
                className={`nav-dot w-2 h-8 rounded-full ${
                  activeSection === section.id ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Navigate to ${section.label}`}
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {section.label}
              </span>
            </div>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-16">
        <header
          id="intro"
          ref={(el) => (sectionsRef.current[0] = el)}
          className="py-20 sm:py-28 flex items-center section-reveal"
        >
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-3 sm:space-y-2">
                  <div className="text-sm text-muted-foreground font-mono tracking-wider">{contentData.header.tagline}</div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight">
                    {contentData.personal.firstName}
                    <br />
                    <span className="text-muted-foreground">{contentData.personal.lastName}</span>
                  </h1>
                </div>

                <div className="flex justify-center md:justify-end">
                  <div className="relative">
                    <Image
                      src="/profile-photo.png"
                      alt="Yen Wee Lim - Professional headshot"
                      width={200}
                      height={200}
                      className="rounded-md object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {contentData.personal.title}
                  {contentData.personal.titleHighlights.map((highlight, index) => (
                    <span key={index} className="text-foreground">{highlight}</span>
                  ))}
                  {contentData.personal.titleClosing}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {contentData.personal.availability}
                  </div>
                  <div>{contentData.personal.location}</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/projects"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg text-sm font-medium"
                  >
                    View My Work
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => scrollToSection("connect")}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm text-sm font-medium"
                  >
                    Let's Talk
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">CURRENTLY</div>
                <div className="space-y-2">
                  <div className="text-foreground">{contentData.currentRole.position}</div>
                  <div className="text-muted-foreground">{contentData.currentRole.company}</div>
                  <div className="text-xs text-muted-foreground">{contentData.currentRole.period}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
                <div className="flex flex-wrap gap-2">
                  {contentData.focus.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </header>

        {/* Scroll Navigation Indicator */}
        <div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-opacity duration-500 ${
            activeSection === 'connect' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <button
            onClick={() => {
              const sections = ['intro', 'services', 'work', 'education', 'connect']
              const currentIndex = sections.indexOf(activeSection || 'intro')
              const nextSection = sections[currentIndex + 1]
              if (nextSection) {
                document.getElementById(nextSection)?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="group animate-gentle-float flex items-center justify-center w-10 h-10 rounded-full border border-muted-foreground/20 hover:border-foreground/50 transition-all duration-300 bg-background/80 backdrop-blur-sm"
            aria-label="Scroll to next section"
          >
            <svg
              className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>

        {/* Scroll to Top - Only visible on connect section */}
        <div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-opacity duration-500 ${
            activeSection === 'connect' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={() => document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' })}
            className="group animate-gentle-float flex items-center justify-center w-10 h-10 rounded-full border border-muted-foreground/20 hover:border-foreground/50 transition-all duration-300 bg-background/80 backdrop-blur-sm"
            aria-label="Scroll to top"
          >
            <svg
              className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>

        {/* Metrics Banner */}
        <section className="py-10 sm:py-12 border-y border-border/60">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {contentData.metrics.map((metric: { value: string; label: string }, index: number) => (
              <div key={index} className="text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-light text-foreground">{metric.value}</div>
                <div className="text-xs text-muted-foreground font-mono tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* My Path */}
        <section className="py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs text-muted-foreground font-mono tracking-wider">{contentData.story.heading.toUpperCase()}</div>
              <p className="text-muted-foreground leading-relaxed">
                {contentData.story.text}
              </p>
            </div>
            <Link
              href={contentData.story.linkHref}
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors whitespace-nowrap shrink-0"
            >
              {contentData.story.linkText}
              <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        <section
          id="services"
          ref={(el) => (sectionsRef.current[1] = el)}
          className="py-16 sm:py-24 section-reveal"
        >
          <div className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-light">What I Do</h2>
              <div className="text-xs text-muted-foreground font-mono tracking-wider">SERVICES</div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {contentData.services.map((service, index) => {
                const iconMap = [Bot, Globe, Settings, TrendingUp];
                const IconComponent = iconMap[index % iconMap.length];
                return (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-5 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-md bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-foreground/10 transition-colors duration-300">
                    <IconComponent className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="work"
          ref={(el) => (sectionsRef.current[2] = el)}
          className="py-16 sm:py-24 section-reveal"
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
                  className="group relative pl-8 pb-10 last:pb-0 border-l border-border/60"
                >
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-muted-foreground/30 -translate-x-[calc(50%+0.5px)] group-hover:bg-foreground transition-colors duration-300" />

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={job.logo || "/placeholder.svg"}
                        alt={`${job.company} logo`}
                        width={28}
                        height={28}
                        className="rounded-[2px]"
                      />
                      <div>
                        <h3 className="font-medium text-foreground">{job.role}</h3>
                        <div className="text-sm text-muted-foreground">{job.company}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1 sm:mt-1 shrink-0">{job.year}</div>
                  </div>

                  <ul className="space-y-1.5 mb-3">
                    {job.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-1">
                        {highlight}
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
        <section ref={(el) => (sectionsRef.current[5] = el)} className="py-16 sm:py-24 border-y border-border/40 bg-muted/20 -mx-6 sm:-mx-8 px-6 sm:px-8 section-reveal">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
            <div className="text-xs text-muted-foreground font-mono tracking-wider">WHAT PEOPLE SAY</div>

            <div className="grid md:grid-cols-3 gap-6">
              {contentData.testimonials.map((testimonial: { quote: string; name: string; title: string; company: string }, index: number) => (
                <div key={index} className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-muted-foreground/70 text-xs">
                      {testimonial.title ? `${testimonial.title}, ${testimonial.company}` : testimonial.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="education"
          ref={(el) => (sectionsRef.current[3] = el)}
          className="py-16 sm:py-24 section-reveal"
        >
          <div className="space-y-8 sm:space-y-10">
            <h2 className="text-2xl sm:text-3xl font-light">Education & Credentials</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <Image src="/universiti-malaya-um-logo-malaysia.png" alt="Universiti Malaya" width={24} height={24} className="rounded-[2px]" />
                  <h3 className="font-medium text-foreground">MSc Statistics</h3>
                  <span className="text-xs text-muted-foreground/60 font-mono">2023-2025</span>
                </div>
                <p className="text-sm text-muted-foreground pl-9">Universiti Malaya - First Class Honours, GPA 3.88/4.0</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <Image src="/universiti-tunku-abdul-rahman-utar-logo-malaysia.png" alt="UTAR" width={24} height={24} className="rounded-[2px]" />
                  <h3 className="font-medium text-foreground">BSc Actuarial Science</h3>
                  <span className="text-xs text-muted-foreground/60 font-mono">2018-2022</span>
                </div>
                <p className="text-sm text-muted-foreground pl-9">UTAR - First Class Honours, GPA 3.76/4.0</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {contentData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 border border-border/50">
                  <Image src={cert.logo} alt={cert.name} width={18} height={18} className="rounded-[2px]" />
                  <span className="text-sm text-foreground">{cert.name}</span>
                  <span className="text-xs text-muted-foreground/60">{cert.level}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="connect" ref={(el) => (sectionsRef.current[4] = el)} className="py-16 sm:py-24 section-reveal">
          <div className="space-y-10">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-light mb-4">Have a project in mind?</h2>
              <p className="text-muted-foreground leading-relaxed">
                I ship production AI systems, data platforms, and full-stack apps. If you have a problem that needs solving, let's talk.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={contentData.connect.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all duration-300 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book a Call
              </Link>
              <Link
                href="mailto:limyenwee@gmail.com"
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 text-sm font-medium"
              >
                limyenwee@gmail.com
                <svg className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={contentData.personal.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 text-sm font-medium text-muted-foreground"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">{contentData.connect.callDescription}</p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-sm text-muted-foreground">
              <Link href="https://www.linkedin.com/in/yenwee-lim/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
                LinkedIn
              </Link>
              <Link href="https://github.com/yenwee" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
                GitHub
              </Link>
              <Link href={`https://wa.me/${contentData.personal.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
                WhatsApp
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <span>{contentData.personal.location}</span>
            </div>

            <p className="text-xs text-muted-foreground/60 font-mono tracking-wider">{contentData.connect.pricingSignal}</p>
          </div>
        </section>

        <footer className="py-8 border-t border-border/40">
          <div className="text-xs text-muted-foreground/60">{contentData.footer.copyright}</div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
