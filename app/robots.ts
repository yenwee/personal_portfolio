import type { MetadataRoute } from "next"
import contentData from "@/lib/content.json"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${contentData.metadata.ogUrl}/sitemap.xml`,
  }
}
