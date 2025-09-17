import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import contentData from "@/lib/content.json"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

export const metadata: Metadata = {
  metadataBase: new URL(contentData.metadata.ogUrl),
  title: contentData.metadata.title,
  description: contentData.metadata.description,
  keywords: contentData.metadata.keywords,
  authors: [{ name: contentData.metadata.author }],
  creator: contentData.metadata.author,
  openGraph: {
    title: contentData.metadata.ogTitle,
    description: contentData.metadata.ogDescription,
    url: contentData.metadata.ogUrl,
    siteName: contentData.metadata.title,
    images: [
      {
        url: contentData.metadata.ogImage,
        width: 1200,
        height: 630,
        alt: contentData.metadata.author,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: contentData.metadata.ogTitle,
    description: contentData.metadata.ogDescription,
    images: [contentData.metadata.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icon.png',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
