"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import contentData from "@/lib/content.json"
import { Bot, Globe, Settings, TrendingUp, Menu, X, Sun, Moon } from "lucide-react"

const NAV_ITEMS: { name: string; id: string; href?: string }[] = [
  { name: "About", id: "intro" },
  { name: "Services", id: "services" },
  { name: "Projects", id: "projects", href: "/projects" },
  { name: "Work", id: "work" },
  { name: "Education", id: "education" },
  { name: "Blog", id: "blog", href: "/blogs" },
  { name: "Connect", id: "connect" },
]

export default function Home() {
  const [isDark, setIsDark] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
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
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16">
            <div className="text-sm font-mono tracking-wider">{contentData.personal.name.toUpperCase()}</div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-8">
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
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                ) : (
                  <Moon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
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
            <div className="max-w-4xl mx-auto px-6 py-4 space-y-1">
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
            </div>
          </div>
        )}
      </nav>

      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "services", "work", "education", "connect"].map((section) => (
            <div key={section} className="group relative">
              <button
                onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
                className={`nav-dot w-2 h-8 rounded-full ${
                  activeSection === section ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Navigate to ${section}`}
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 pt-16">
        <header
          id="intro"
          ref={(el) => (sectionsRef.current[0] = el)}
          className="min-h-screen flex items-center opacity-0"
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

        <section
          id="services"
          ref={(el) => (sectionsRef.current[1] = el)}
          className="min-h-screen py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Services</h2>
              <div className="text-sm text-muted-foreground font-mono">WHAT I OFFER</div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {contentData.services.map((service, index) => {
                const iconMap = [Bot, Globe, Settings, TrendingUp];
                const IconComponent = iconMap[index % iconMap.length];
                return (
                <div
                  key={index}
                  className="group card-lift p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 hover:shadow-lg hover:bg-muted/20"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
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
          className="min-h-screen py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Work Experience</h2>
              <div className="text-sm text-muted-foreground font-mono">2022 — PRESENT</div>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {contentData.workExperience.map((job, index) => (
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {job.year}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={job.logo || "/placeholder.svg"}
                        alt={`${job.company} logo`}
                        width={32}
                        height={32}
                        className="rounded-[2px]"
                      />
                      <div>
                        <h3 className="text-lg sm:text-xl font-medium">{job.role}</h3>
                        <div className="text-muted-foreground">{job.company}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{job.description}</p>
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end mt-2 lg:mt-0">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
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

        <section
          id="education"
          ref={(el) => (sectionsRef.current[3] = el)}
          className="min-h-screen py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light">Education & Certifications</h2>

            <div className="space-y-8 sm:space-y-12">
              {/* Education */}
              <div className="space-y-6">
                <h3 className="text-xl font-medium">Education</h3>
                <div className="space-y-6">
                  <div className="group p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>Feb 2023 — Feb 2025</span>
                        <span>First Class Honours</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Image
                          src="/universiti-malaya-um-logo-malaysia.png"
                          alt="Universiti Malaya logo"
                          width={32}
                          height={32}
                          className="rounded-[2px]"
                        />
                        <div>
                          <h4 className="text-lg sm:text-xl font-medium">Master of Science in Statistics</h4>
                          <p className="text-muted-foreground">Universiti Malaya • Cumulative GPA: 3.88/4.0</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>May 2018 — May 2022</span>
                        <span>First Class Honours</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Image
                          src="/universiti-tunku-abdul-rahman-utar-logo-malaysia.png"
                          alt="Universiti Tunku Abdul Rahman logo"
                          width={32}
                          height={32}
                          className="rounded-[2px]"
                        />
                        <div>
                          <h4 className="text-lg sm:text-xl font-medium">
                            Bachelor of Science (Honours) Actuarial Science
                          </h4>
                          <p className="text-muted-foreground">
                            Universiti Tunku Abdul Rahman • Cumulative GPA: 3.76/4.0
                          </p>
                          <p className="text-sm text-muted-foreground">
                            President's List — 2 Semesters, Dean's List — 4 Semesters
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-6">
                <h3 className="text-xl font-medium">Certifications</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {contentData.certifications.map((cert, index) => (
                    <div key={index} className={`p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 ${contentData.certifications.length === 3 && index === 2 ? 'sm:col-span-2' : ''}`}>
                      <div className="flex items-center gap-3">
                        <Image
                          src={cert.logo}
                          alt={`${cert.name} logo`}
                          width={24}
                          height={24}
                          className="rounded-[2px]"
                        />
                        <div className="space-y-1">
                          <div className="text-foreground">{cert.name}</div>
                          <div className="text-sm text-muted-foreground">{cert.level}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-6">
                <h3 className="text-xl font-medium">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {contentData.technicalSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="connect" ref={(el) => (sectionsRef.current[4] = el)} className="py-20 sm:py-32 opacity-0">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl font-light">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {contentData.intro.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={contentData.personal.resumePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">Download Resume</span>
                  </Link>
                  
                  <Link
                    href={`https://wa.me/${contentData.personal.whatsappNumber}?text=${encodeURIComponent(contentData.personal.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-6 py-3 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                  >
                    <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.512z"/>
                    </svg>
                    <span className="font-medium">WhatsApp Chat</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  <Link
                    href="mailto:limyenwee@gmail.com"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-sm sm:text-base lg:text-lg break-all">limyenwee@gmail.com</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  <Link
                    href="tel:+60194739372"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-sm sm:text-base lg:text-lg">+6019 4739372</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="text-sm text-muted-foreground font-mono">ELSEWHERE</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="https://www.linkedin.com/in/yenwee-lim/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <div className="space-y-1">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        LinkedIn
                      </div>
                      <div className="text-sm text-muted-foreground">yenwee-lim</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="https://github.com/yenwee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <div className="space-y-1">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        GitHub
                      </div>
                      <div className="text-sm text-muted-foreground">@yenwee</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="mailto:limyenwee@gmail.com"
                  className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="space-y-1">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        Email
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground break-all">limyenwee@gmail.com</div>
                    </div>
                  </div>
                </Link>

                <div className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="space-y-1">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        Location
                      </div>
                      <div className="text-sm text-muted-foreground">Kuala Lumpur, Malaysia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 sm:py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{contentData.footer.copyright}</div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`https://wa.me/${contentData.personal.whatsappNumber}?text=${encodeURIComponent(contentData.personal.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                aria-label="Chat on WhatsApp"
              >
                <svg
                  className="w-4 h-4 text-[#25D366] group-hover:text-[#25D366]/80 transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.512z"/>
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
