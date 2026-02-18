# Portfolio Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish the portfolio with a personality-driven hero, rewritten services, blog section, projects nav link, and content updates.

**Architecture:** Content-driven updates to `lib/content.json`, new pages following existing patterns (`app/blogs/`), nav updates in `app/page.tsx`. Blog system mirrors the existing projects pattern (markdown files + JSON metadata + dynamic routes).

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, react-markdown, remark-gfm, rehype-highlight, Lucide icons.

---

### Task 1: Update content.json -- Hero, Services, Availability, Metadata

**Files:**
- Modify: `lib/content.json`

**Step 1: Update hero text**

Change `personal.title` and `personal.titleHighlights` to the personality-driven version:

```json
"title": "I build software that ships — ",
"titleHighlights": [" agentic AI platforms,", " APIs,", " dashboards,", " and data pipelines"],
```

Also add a closing phrase field:

```json
"titleClosing": " from idea to production."
```

**Step 2: Update availability**

```json
"availability": "Open to freelance & side projects"
```

**Step 3: Update services array**

Replace the 4 services with:

```json
"services": [
  {
    "title": "Agentic AI & LLM Products",
    "description": "End-to-end AI agent development using LangGraph and modern LLM frameworks. From autonomous data-mining workflows to RAG-powered report generation and industry-specific AI agents."
  },
  {
    "title": "Software & API Development",
    "description": "Production-grade web applications, REST APIs, and backend services built with FastAPI, Next.js, and modern cloud-native architectures."
  },
  {
    "title": "Data Platforms & Pipelines",
    "description": "Scalable data warehouses, ETL pipelines, and MLOps platforms using Docker, Airflow, Kubernetes, and cloud infrastructure on AWS."
  },
  {
    "title": "Dashboards & Business Intelligence",
    "description": "Interactive dashboards and analytics platforms that turn complex datasets into actionable insights for stakeholders across finance, e-commerce, and enterprise."
  }
]
```

**Step 4: Update focus tags**

```json
"focus": ["LangGraph", "FastAPI", "Docker", "Next.js", "Kubernetes"]
```

**Step 5: Update WhatsApp message**

```json
"whatsappMessage": "Hi Yen Wee, I came across your portfolio and would like to discuss a project."
```

**Step 6: Update metadata ogUrl**

```json
"ogUrl": "https://yenwee.vercel.app"
```

**Step 7: Update metadata description to match new identity**

```json
"title": "Yen Wee Lim - Lead AI Solutions | Full-Stack Product Builder",
"description": "I build software that ships -- agentic AI platforms, APIs, dashboards, and data pipelines. From idea to production. Based in Kuala Lumpur, Malaysia.",
"ogTitle": "Yen Wee Lim - Lead AI Solutions | Full-Stack Product Builder",
"ogDescription": "Full-stack product builder specializing in agentic AI platforms, APIs, dashboards, and data pipelines in Malaysia."
```

**Step 8: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('lib/content.json','utf8')); console.log('Valid JSON')"`

Expected: `Valid JSON`

**Step 9: Commit**

```bash
git add lib/content.json
git commit -m "content: rewrite hero, services, and metadata for builder identity"
```

---

### Task 2: Update page.tsx -- Hero rendering and Projects nav link

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add `titleClosing` to the hero paragraph**

In the hero `<p>` tag (around line 175), after the `titleHighlights` map, add rendering of `titleClosing`:

Replace:
```tsx
<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
  {contentData.personal.title}
  {contentData.personal.titleHighlights.map((highlight, index) => (
    <span key={index} className="text-foreground">{highlight}</span>
  ))}
  .
</p>
```

With:
```tsx
<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
  {contentData.personal.title}
  {contentData.personal.titleHighlights.map((highlight, index) => (
    <span key={index} className="text-foreground">{highlight}</span>
  ))}
  {contentData.personal.titleClosing}
</p>
```

**Step 2: Add Projects and Blog to NAV_ITEMS**

Replace the `NAV_ITEMS` const at the top of the file:

```tsx
const NAV_ITEMS: { name: string; id: string; href?: string }[] = [
  { name: "About", id: "intro" },
  { name: "Services", id: "services" },
  { name: "Projects", id: "projects", href: "/projects" },
  { name: "Work", id: "work" },
  { name: "Education", id: "education" },
  { name: "Blog", id: "blog", href: "/blogs" },
  { name: "Connect", id: "connect" },
]
```

**Step 3: Update nav rendering to handle page links**

In the desktop nav (the `hidden md:flex` div), replace the button rendering:

```tsx
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
```

**Step 4: Update mobile nav rendering the same way**

In the mobile menu div, replace the button rendering with the same pattern (Link for href items, button for scroll items).

**Step 5: Update side dot nav to include all scroll sections**

The side dot nav array stays as scroll-only sections (no Projects/Blog since they're separate pages):
```tsx
{["intro", "services", "work", "education", "connect"].map((section) => (
```
No change needed here.

**Step 6: Build and verify**

Run: `pnpm build`

Expected: Build succeeds with no errors.

**Step 7: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add Projects and Blog nav links, update hero rendering"
```

---

### Task 3: Create Blog System -- Metadata, Listing Page, Post Page

**Files:**
- Create: `lib/blogs.json`
- Create: `app/blogs/page.tsx`
- Create: `app/blogs/[slug]/page.tsx`
- Create: `public/blogs/hello-world.md` (sample post)

**Step 1: Create `lib/blogs.json` with one sample entry**

```json
{
  "posts": [
    {
      "id": "hello-world",
      "title": "Hello World -- Welcome to My Blog",
      "description": "First post on my new blog. Sharing thoughts on building AI products, data engineering, and shipping software.",
      "date": "2026-02-17",
      "tags": ["General", "AI"],
      "featured": true
    }
  ]
}
```

**Step 2: Create sample markdown post**

Create `public/blogs/hello-world.md`:

```markdown
# Hello World

Welcome to my blog. I'll be sharing thoughts on building AI products, data engineering, and shipping software from idea to production.

## What to Expect

Posts about:
- Building agentic AI systems with LangGraph
- Data engineering patterns and MLOps
- Lessons from shipping products at startups and enterprises
- Technical deep-dives into projects I'm working on

Stay tuned.
```

**Step 3: Create `app/blogs/page.tsx`**

Follow the same pattern as `app/projects/page.tsx` but adapted for blog posts. Key differences:
- No images (blog posts are text-first)
- Show date prominently
- Show tags as pills
- Link to `/blogs/[slug]`
- Same nav pattern (ArrowLeft + YEN WEE LIM)
- Use `Calendar` and `Tag` icons from lucide-react

The listing page should show posts sorted by date (newest first), with:
- Post title (clickable link to detail page)
- Description (line-clamp-2)
- Date
- Tags as small pills
- "Read More" link

Style: Match the editorial minimal feel of the main portfolio. No cards with heavy borders -- use subtle dividers between posts (like the work experience section pattern).

**Step 4: Create `app/blogs/[slug]/page.tsx`**

Clone the pattern from `app/projects/[slug]/page.tsx` but adapted:
- Fetch markdown from `/blogs/${slug}.md`
- Show post title, date, tags in header
- Reuse the same ReactMarkdown component setup with remarkGfm and rehypeHighlight
- Footer: "Back to Blog" + "View Portfolio" + "Get In Touch"
- Import blog metadata from `lib/blogs.json`

**Step 5: Build and verify**

Run: `pnpm build`

Expected: Build succeeds. Routes should include:
```
/blogs          (static)
/blogs/[slug]   (dynamic)
```

**Step 6: Verify blog pages render**

Run dev server, visit:
- `/blogs` -- should show listing with "Hello World" post
- `/blogs/hello-world` -- should render the markdown content

**Step 7: Commit**

```bash
git add lib/blogs.json public/blogs/hello-world.md app/blogs/
git commit -m "feat: add blog system with markdown-based posts"
```

---

### Task 4: Final Build Verification

**Files:**
- All modified files

**Step 1: Full production build**

Run: `pnpm build`

Expected: Clean build, no errors, all routes present:
```
/               (static)
/projects       (static)
/projects/[slug] (dynamic)
/blogs          (static)
/blogs/[slug]   (dynamic)
```

**Step 2: Visual spot-check**

Run dev server and verify:
1. Hero shows "I build software that ships --" with highlighted keywords
2. Availability shows "Open to freelance & side projects"
3. Services show the 4 rewritten cards
4. Focus tags show LangGraph, FastAPI, Docker, Next.js, Kubernetes
5. Nav shows Projects and Blog links
6. Projects page loads
7. Blog page loads with sample post
8. Mobile hamburger menu shows all nav items including Projects and Blog
9. Theme toggle works in navbar

**Step 3: Commit any fixes if needed**

---

## Execution Notes

- **No tests needed**: This is a static portfolio site with no business logic to unit test. Visual verification is the test.
- **Blog writing workflow**: User creates a `.md` file in `public/blogs/`, adds an entry to `lib/blogs.json`, pushes to git.
- **Projects screenshots**: User will add real screenshots to `public/project-images/` on their own time. The nav link is live now.
