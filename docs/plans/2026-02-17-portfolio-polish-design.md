# Portfolio Polish Design

## Context
Personal portfolio for Yen Wee Lim, Lead AI Solutions at Infomina AI.
Goal: General professional presence -- jobs, freelance clients, and thought leadership.
Identity: Full-stack product builder who ships.
Visual direction: Clean editorial minimalism (keep current aesthetic, polish execution).

## Changes

### 1. Hero Rewrite
- Tagline: "I build software that ships --"
- Highlighted keywords: "agentic AI platforms, APIs, dashboards, and data pipelines"
- Closing: "from idea to production."
- Availability: "Open to freelance & side projects"

### 2. Services Rewrite
1. Agentic AI & LLM Products -- LangGraph, RAG, autonomous workflows
2. Software & API Development -- FastAPI, Next.js, cloud-native
3. Data Platforms & Pipelines -- Docker, Airflow, Kubernetes, AWS
4. Dashboards & Business Intelligence -- Analytics platforms, stakeholder insights

### 3. Blog Section (New)
- Markdown files in `/public/blogs/`
- Metadata in `/lib/blogs.json`
- `/app/blogs/page.tsx` -- listing page
- `/app/blogs/[slug]/page.tsx` -- post page (reuse markdown renderer pattern from projects)
- Add "Blog" to nav

### 4. Projects Nav Link
- Uncomment Projects in nav
- Page already built, user will add real screenshots later

### 5. Content Updates
- Focus tags: LangGraph, FastAPI, Docker, Next.js, Kubernetes
- WhatsApp message: "Hi Yen Wee, I came across your portfolio and would like to discuss a project."
- Metadata ogUrl: https://yenwee.vercel.app

### 6. Not Doing (YAGNI)
- Testimonials (no quotes yet)
- Structured data/sitemap (low priority for LinkedIn-driven traffic)
- Design overhaul (minimal stays)
- Custom domain (add later when pursuing consulting)
