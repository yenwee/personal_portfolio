# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses `pnpm` (lockfile present)

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev              # Starts Next.js dev server on http://localhost:3000

# Build and deployment
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint checking
```

## Project Architecture

This is a **personal portfolio website** built with Next.js 15 App Router architecture:

### Core Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Fonts**: Geist font family
- **Theme**: Custom dark/light mode implementation (not using next-themes provider)

### Project Structure
```
app/                    # Next.js App Router
├── layout.tsx         # Root layout with metadata and Geist font setup
├── page.tsx           # Main portfolio page (single-page application)
└── globals.css        # Global styles with CSS custom properties

components/
├── ui/                # shadcn/ui components (auto-generated)
└── theme-provider.tsx # Theme provider wrapper (currently unused)

lib/
└── utils.ts           # Utility functions (cn for className merging)

public/
├── images/           # Profile and company logos
└── *.jpg             # Company and certification logos
```

### Key Architecture Patterns

**Single-Page Portfolio**: All content is contained in `app/page.tsx` with scroll-based navigation sections (intro, services, work, education, connect)

**Custom Theme Implementation**: Manual dark mode toggle using `document.documentElement.classList.toggle("dark")` rather than next-themes provider

**Design System**: 
- Uses CSS custom properties for theming in `app/globals.css`
- OKLCH color space for consistent color handling
- Custom animation utilities (`animate-fade-in-up`)
- Responsive design with mobile-first approach

**Component Architecture**: 
- Minimal custom components (primarily uses shadcn/ui)
- Intersection Observer for scroll animations and active section tracking
- Next.js Image component for optimized image loading

### Configuration Notes

**Next.js Config** (`next.config.mjs`):
- ESLint and TypeScript errors ignored during builds
- Image optimization disabled (`unoptimized: true`)
- Likely configured for static export deployment

**Tailwind CSS**: Uses Tailwind v4 with PostCSS configuration in `postcss.config.mjs`

**TypeScript**: Path aliases configured with `@/*` pointing to root directory

**shadcn/ui**: Configured for "new-york" style with Lucide icons, components in `@/components/ui`

## Development Notes

- The portfolio uses intersection observer for smooth scroll animations
- Images are stored in `/public` with specific company/certification logos
- Contact information and personal details are hardcoded in `app/page.tsx`
- No API routes or external data fetching - purely static content
- Theme switching is handled manually without persistence across sessions