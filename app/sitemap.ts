import type { MetadataRoute } from "next"
import projectsData from "@/lib/projects.json"
import blogsData from "@/lib/blogs.json"
import contentData from "@/lib/content.json"

const BASE_URL = contentData.metadata.ogUrl

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projectsData.projects.map(
    (project) => ({
      url: `${BASE_URL}/projects/${project.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  )

  const blogRoutes: MetadataRoute.Sitemap = blogsData.posts.map((post) => ({
    url: `${BASE_URL}/blogs/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
}
