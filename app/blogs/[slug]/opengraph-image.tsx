import { ImageResponse } from "next/og"
import blogsData from "@/lib/blogs.json"

export const runtime = "edge"

export const alt = "Blog Post"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

const ACCENT_COLOR = "#3b82f6"
const BG_COLOR = "#0a0a0a"
const BORDER_COLOR = "#1e1e1e"
const TEXT_PRIMARY = "#f5f5f5"
const TEXT_SECONDARY = "#a1a1a1"
const TEXT_MUTED = "#6b6b6b"
const TAG_BG = "#1a1a2e"
const TAG_BORDER = "#2a2a4a"

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogsData.posts.find((p) => p.id === slug)

  if (!post) {
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
          Post Not Found
        </div>
      ),
      { ...size }
    )
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
        {/* Subtle gradient overlay */}
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

        {/* Accent line at top */}
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

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "56px 56px 40px 56px",
            flex: 1,
            position: "relative",
            justifyContent: "center",
          }}
        >
          {/* "BLOG" label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: ACCENT_COLOR,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Blog
            </span>
            <span style={{ fontSize: 14, color: TEXT_MUTED }}>|</span>
            <span style={{ fontSize: 15, color: TEXT_SECONDARY }}>
              {formattedDate}
            </span>
          </div>

          {/* Post title */}
          <div
            style={{
              fontSize: post.title.length > 60 ? 36 : 44,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              lineHeight: 1.2,
              marginBottom: 24,
              maxWidth: 1000,
              display: "flex",
            }}
          >
            {post.title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 18,
              color: TEXT_SECONDARY,
              lineHeight: 1.6,
              marginBottom: 36,
              maxWidth: 900,
              display: "flex",
              overflow: "hidden",
            }}
          >
            {post.description.length > 180
              ? post.description.substring(0, 177) + "..."
              : post.description}
          </div>

          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 14,
                  color: "#8b8bbd",
                  backgroundColor: TAG_BG,
                  border: `1px solid ${TAG_BORDER}`,
                  borderRadius: 20,
                  padding: "7px 16px",
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
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
