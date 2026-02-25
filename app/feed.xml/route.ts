import { Feed } from "feed"
import blogsData from "@/lib/blogs.json"
import contentData from "@/lib/content.json"
import { NextResponse } from "next/server"

export async function GET() {
    const siteUrl = "https://weeai.dev"

    const feed = new Feed({
        title: "Yen Wee Lim | Blog",
        description: "Thoughts on AI, Data Engineering, and software architecture.",
        id: siteUrl,
        link: siteUrl,
        language: "en",
        image: `${siteUrl}/images/og-image.jpg`,
        favicon: `${siteUrl}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, Yen Wee Lim`,
        author: {
            name: "Yen Wee Lim",
            email: "limyenwee0804@gmail.com",
            link: siteUrl,
        },
    })

    blogsData.posts.forEach((post) => {
        feed.addItem({
            title: post.title,
            id: `${siteUrl}/blogs/${post.id}`,
            link: `${siteUrl}/blogs/${post.id}`,
            description: post.description,
            content: post.description, // Can parse MD if needed, but summary suffices for feeds.
            author: [
                {
                    name: "Yen Wee Lim",
                    email: "limyenwee0804@gmail.com",
                    link: siteUrl,
                },
            ],
            date: new Date(post.date),
            image: post.featuredImage ? `${siteUrl}${post.featuredImage}` : undefined,
            category: post.tags.map(tag => ({ name: tag })),
        })
    })

    // Sort feed items by date desc
    feed.items.sort((a: any, b: any) => b.date.getTime() - a.date.getTime())

    return new NextResponse(feed.rss2(), {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "s-maxage=86400, stale-while-revalidate",
        },
    })
}
