# Personal Portfolio

A modern personal portfolio website built with Next.js 15, showcasing professional experience, services, and technical expertise.

## Live Demo

Visit the live portfolio at: [https://yenwee.vercel.app/](https://yenwee.vercel.app/)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with shadcn/ui
- **Typography**: Geist font family
- **Package Manager**: pnpm

## Features

- Responsive single-page application
- Dark/light theme toggle
- Smooth scroll animations with Intersection Observer
- Optimized image loading with Next.js Image component
- OKLCH color space for consistent theming
- Mobile-first responsive design

## Project Structure

```
app/
├── layout.tsx         # Root layout with metadata and fonts
├── page.tsx          # Main portfolio page
└── globals.css       # Global styles and CSS custom properties

components/
├── ui/               # shadcn/ui components
└── theme-provider.tsx

lib/
└── utils.ts          # Utility functions

public/
├── images/           # Profile and company logos
└── *.jpg            # Company and certification assets
```

## Development

### Prerequisites

- Node.js 18+ 
- pnpm package manager

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

```bash
pnpm dev     # Start development server
pnpm build   # Create production build
pnpm start   # Start production server
pnpm lint    # Run ESLint
```

## Build Configuration

The project is configured for static export with:
- ESLint and TypeScript errors ignored during builds
- Image optimization disabled for static hosting compatibility
- PostCSS with Tailwind CSS v4

## Architecture Notes

- **Single-page design**: All content sections managed in `app/page.tsx`
- **Manual theme implementation**: Custom dark mode without external providers
- **Static content**: No API routes or external data dependencies
- **Intersection Observer**: Handles scroll-based animations and navigation
- **CSS Custom Properties**: Theme variables defined in `globals.css`

## Deployment

The application is deployed on Vercel and configured for static export. The build output is optimized for CDN distribution and can be deployed to any static hosting platform.