import { ImageResponse } from "next/og"
import projectsData from "@/lib/projects.json"

export const runtime = "edge"

export const alt = "Project Detail"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

const ACCENT_COLOR = "#3b82f6"
const BG_COLOR = "#0a0a0a"
const SURFACE_COLOR = "#141414"
const BORDER_COLOR = "#1e1e1e"
const TEXT_PRIMARY = "#f5f5f5"
const TEXT_SECONDARY = "#a1a1a1"
const TEXT_MUTED = "#6b6b6b"
const TAG_BG = "#1a1a2e"
const TAG_BORDER = "#2a2a4a"

const MAX_VISIBLE_STATS = 4
const MAX_VISIBLE_TAGS = 4

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projectsData.projects.find((p) => p.id === slug)

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: BG_COLOR,
            color: TEXT_PRIMARY,
            fontSize: 48,
            fontFamily: "sans-serif",
          }}
        >
          Project Not Found
        </div>
      ),
      { ...size }
    )
  }

  const stats = project.stats.slice(0, MAX_VISIBLE_STATS)
  const tags = project.technologies.slice(0, MAX_VISIBLE_TAGS)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BG_COLOR,
          fontFamily: "sans-serif",
          padding: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient overlay at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            background: `linear-gradient(180deg, ${ACCENT_COLOR}08 0%, transparent 100%)`,
            display: "flex",
          }}
        />

        {/* Accent line at very top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: ACCENT_COLOR,
            display: "flex",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "48px 56px 40px 56px",
            flex: 1,
            position: "relative",
          }}
        >
          {/* Top row: category + year */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: ACCENT_COLOR,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {project.category}
            </span>
            <span
              style={{
                fontSize: 14,
                color: TEXT_MUTED,
              }}
            >
              |
            </span>
            <span
              style={{
                fontSize: 16,
                color: TEXT_SECONDARY,
              }}
            >
              {project.year}
            </span>
            {project.status && (
              <>
                <span
                  style={{
                    fontSize: 14,
                    color: TEXT_MUTED,
                  }}
                >
                  |
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color:
                      project.status === "In Production" ||
                      project.status === "Deployed"
                        ? "#4ade80"
                        : "#60a5fa",
                    fontWeight: 500,
                  }}
                >
                  {project.status}
                </span>
              </>
            )}
          </div>

          {/* Project title */}
          <div
            style={{
              fontSize: project.title.length > 40 ? 38 : 44,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              lineHeight: 1.15,
              marginBottom: 24,
              maxWidth: 1000,
              display: "flex",
            }}
          >
            {project.title}
          </div>

          {/* Description - truncated */}
          <div
            style={{
              fontSize: 17,
              color: TEXT_SECONDARY,
              lineHeight: 1.5,
              marginBottom: 32,
              maxWidth: 900,
              display: "flex",
              overflow: "hidden",
            }}
          >
            {project.description.length > 160
              ? project.description.substring(0, 157) + "..."
              : project.description}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 28,
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: SURFACE_COLOR,
                  border: `1px solid ${BORDER_COLOR}`,
                  borderRadius: 10,
                  padding: "14px 22px",
                  minWidth: 140,
                }}
              >
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                    lineHeight: 1.2,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: TEXT_MUTED,
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tech tags */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {tags.map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: 13,
                  color: "#8b8bbd",
                  backgroundColor: TAG_BG,
                  border: `1px solid ${TAG_BORDER}`,
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > MAX_VISIBLE_TAGS && (
              <span
                style={{
                  fontSize: 13,
                  color: TEXT_MUTED,
                  backgroundColor: TAG_BG,
                  border: `1px solid ${TAG_BORDER}`,
                  borderRadius: 20,
                  padding: "6px 14px",
                }}
              >
                +{project.technologies.length - MAX_VISIBLE_TAGS} more
              </span>
            )}
          </div>
        </div>

        {/* Bottom bar with branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 56px",
            borderTop: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: ACCENT_COLOR,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              YW
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: TEXT_SECONDARY,
                letterSpacing: "0.04em",
              }}
            >
              Yen Wee Lim
            </span>
          </div>
          <span
            style={{
              fontSize: 13,
              color: TEXT_MUTED,
            }}
          >
            yenwee.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
