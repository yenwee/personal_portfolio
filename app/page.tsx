"use client"

import Link from "next/link"
import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import contentData from "@/lib/content.json"
import { Bot, Globe, Settings, TrendingUp, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState("0")
  const [hasAnimated, setHasAnimated] = useState(false)

  const numericMatch = value.match(/^(\d+)(.*)$/)
  const targetNum = numericMatch ? parseInt(numericMatch[1], 10) : 0
  const suffix = numericMatch ? numericMatch[2] : value

  const animate = useCallback(() => {
    if (hasAnimated || !targetNum) return
    setHasAnimated(true)
    const duration = 1200
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * targetNum).toString())
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [hasAnimated, targetNum])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) animate() },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [animate])

  return (
    <div ref={ref} className="text-center space-y-1">
      <div className="text-2xl sm:text-3xl font-medium text-foreground">
        {targetNum ? `${display}${suffix}` : value}
      </div>
      <div className="text-xs text-muted-foreground font-mono tracking-wider">{label}</div>
    </div>
  )
}

const NAV_ITEMS: { name: string; id: string; href?: string }[] = [
  { name: "Projects", id: "projects", href: "/projects" },
  { name: "Blog", id: "blog", href: "/blogs" },
  { name: "Connect", id: "connect" },
]

export default function Home() {
  const [activeSection, setActiveSection] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            entry.target.querySelectorAll(".stagger-reveal").forEach((el) => {
              el.classList.add("is-visible")
            })
            if (entry.target.id) {
              setActiveSection(entry.target.id)
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
                  className="btn-premium text-sm px-4 py-1.5 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-all duration-300 font-medium whitespace-nowrap"
                >
                  Book a Call
                </Link>
              </div>
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
                >
                  Book a Call
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-16">
        <header
          id="intro"
          className="py-16 sm:py-24 flex items-center"
        >
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full items-center">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-2 hero-stagger" style={{ animationDelay: '0ms' }}>
                <div className="text-sm text-muted-foreground font-mono tracking-wider">{contentData.header.tagline}</div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-gradient">
                  {contentData.personal.name}
                </h1>
              </div>

              <div className="space-y-3 hero-stagger" style={{ animationDelay: '150ms' }}>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {contentData.personal.title}
                  {contentData.personal.titleHighlights.map((highlight, index) => (
                    <span key={index} className="text-foreground font-medium underline decoration-foreground/20 underline-offset-4">{highlight}</span>
                  ))}
                  {contentData.personal.titleClosing}
                </p>
                <p className="text-sm text-muted-foreground/60">
                  AI agents &middot; Workflow automation &middot; Full-stack apps
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 hero-stagger" style={{ animationDelay: '300ms' }}>
                <Link
                  href="/projects"
                  className="group btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg text-sm font-medium"
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
                >
                  Book a Call
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground/60 hero-stagger" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  {contentData.personal.availability}
                </div>
                <span>&middot;</span>
                <div>{contentData.personal.location}</div>
              </div>
            </div>

            <div className="lg:col-span-2 flex justify-center lg:justify-end order-first lg:order-last hero-stagger" style={{ animationDelay: '100ms' }}>
              <Image
                src="/profile-photo.png"
                alt="Yen Wee Lim - Professional headshot"
                width={400}
                height={400}
                className="rounded-2xl object-cover profile-image shadow-lg border border-border/50"
                priority
              />
            </div>
          </div>
          
        </header>

        {/* Scroll Navigation Indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={() => {
              if (activeSection === 'connect') {
                document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' })
              } else {
                const sections = ['intro', 'services', 'work', 'education', 'connect']
                const currentIndex = sections.indexOf(activeSection || 'intro')
                const nextSection = sections[currentIndex + 1]
                if (nextSection) {
                  document.getElementById(nextSection)?.scrollIntoView({ behavior: 'smooth' })
                }
              }
            }}
            className="group animate-gentle-float flex items-center justify-center w-10 h-10 rounded-full border border-muted-foreground/20 hover:border-foreground/50 transition-all duration-300 bg-background/80 backdrop-blur-sm"
            aria-label={activeSection === 'connect' ? 'Scroll to top' : 'Scroll to next section'}
          >
            <svg
              className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-300 ${activeSection === 'connect' ? 'rotate-180' : ''}`}
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

        {/* Metrics Banner */}
        <section className="py-10 sm:py-12 border-y border-border/60 section-reveal">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {contentData.metrics.map((metric: { value: string; label: string }, index: number) => (
              <AnimatedStat key={index} value={metric.value} label={metric.label} />
            ))}
          </div>
        </section>

        {/* Currently & Focus */}
        <section className="py-8 sm:py-10 section-reveal">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground font-mono tracking-wider">CURRENTLY</div>
              <div className="space-y-1.5">
                <div className="text-foreground">{contentData.currentRole.position}</div>
                <div className="text-muted-foreground">{contentData.currentRole.company}</div>
                <div className="text-xs text-muted-foreground">{contentData.currentRole.period}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground font-mono tracking-wider">FOCUS</div>
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
        </section>

        {/* My Path */}
        <section className="py-8 sm:py-10 border-t border-border/40 section-reveal">
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
          className="py-16 sm:py-24 section-reveal"
        >
          <div className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-light">What I Do</h2>
              <div className="text-xs text-muted-foreground font-mono tracking-wider">SERVICES</div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 stagger-reveal">
              {contentData.services.map((service, index) => {
                const iconMap = [Bot, Globe, Settings, TrendingUp];
                const tintMap = ["icon-tint-blue", "icon-tint-green", "icon-tint-purple", "icon-tint-orange"];
                const IconComponent = iconMap[index % iconMap.length];
                const tintClass = tintMap[index % tintMap.length];
                return (
                <div
                  key={index}
                  className="group card-lift flex items-start gap-4 p-5 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-md ${tintClass} flex items-center justify-center shrink-0 transition-colors duration-300`}>
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
        <section className="py-16 sm:py-24 section-reveal">
          <div className="space-y-8 sm:space-y-10">
            <div className="text-xs text-muted-foreground font-mono tracking-wider">WHAT PEOPLE SAY</div>

            <div className="grid md:grid-cols-3 gap-4 stagger-reveal">
              {contentData.testimonials.map((testimonial: { quote: string; name: string; title: string; company: string }, index: number) => (
                <div key={index} className="card-lift p-5 rounded-lg border border-border/50 hover:border-border bg-muted/10 hover:bg-muted/20 transition-all duration-300 flex flex-col justify-between gap-4">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-border/30">
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
          className="py-16 sm:py-24 section-reveal"
        >
          <div className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-light">Education & Credentials</h2>
              <div className="text-xs text-muted-foreground font-mono tracking-wider">QUALIFICATIONS</div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {contentData.education.map((edu, index) => (
                <div key={index} className="card-lift p-5 rounded-lg border border-border/50 hover:border-border transition-all duration-300 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative shrink-0">
                      <Image src={edu.logo} alt={edu.institution} fill className="rounded-sm object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground text-sm">{edu.degree}</h3>
                      <div className="text-xs text-muted-foreground">{edu.institution}</div>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-sm text-muted-foreground">{edu.honors} {"\u00b7"} {edu.gpa.replace("Cumulative GPA: ", "")}</div>
                    <div className="text-xs text-muted-foreground/60 font-mono shrink-0">{edu.period.replace("Feb ", "").replace("May ", "")}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2 stagger-reveal">
              {contentData.certifications.map((cert, index) => (
                <div key={index} className="card-lift flex items-center gap-2.5 px-3 py-2 rounded-md bg-muted/30 border border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-300">
                  <Image src={cert.logo} alt={cert.name} width={18} height={18} className="rounded-[2px]" />
                  <span className="text-sm text-foreground">{cert.name}</span>
                  <span className="text-xs text-muted-foreground/60">{cert.level}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="connect" className="py-16 sm:py-24 section-reveal">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-2xl sm:text-3xl font-light">Have a project in mind?</h2>
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
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book a Call
              </Link>
              <Link
                href="mailto:hello@weeai.dev"
                className="group btn-premium inline-flex items-center gap-2.5 px-5 py-2.5 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 text-sm font-medium"
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
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">{contentData.connect.callDescription}</p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link href="https://www.linkedin.com/in/yenwee-lim/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md hover:bg-muted/50 hover:text-foreground transition-all duration-300">
                LinkedIn
              </Link>
              <Link href="https://github.com/yenwee" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md hover:bg-muted/50 hover:text-foreground transition-all duration-300">
                GitHub
              </Link>
              <Link href={`https://wa.me/${contentData.personal.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md hover:bg-muted/50 hover:text-foreground transition-all duration-300">
                WhatsApp
              </Link>
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

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/60 to-transparent pointer-events-none"></div>
    </div>
  )
}
