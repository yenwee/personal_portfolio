import fs from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), "public", "blogs", `${slug}.md`)

  let markdown: string
  try {
    markdown = fs.readFileSync(filePath, "utf-8")
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }

  // Convert relative image paths to absolute URLs
  const withAbsoluteImages = markdown.replace(
    /!\[([^\]]*)\]\(\/blogs\/images\//g,
    '![$1](https://weeai.dev/blogs/images/'
  )

  // Convert relative blog links to absolute
  const withAbsoluteLinks = withAbsoluteImages.replace(
    /\]\(\/blogs\//g,
    '](https://weeai.dev/blogs/'
  )

  // Convert markdown to simple HTML that Medium can parse
  let html = withAbsoluteLinks

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />')

  // Paragraphs: wrap non-tag lines
  const lines = html.split('\n')
  const processed: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (
      trimmed === '' ||
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<img') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('- ') ||
      trimmed.startsWith('(')
    ) {
      if (trimmed.startsWith('- ')) {
        processed.push(`<li>${trimmed.slice(2)}</li>`)
      } else if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
        processed.push(`<p>${trimmed}</p>`)
      } else {
        processed.push(trimmed)
      }
    } else if (trimmed) {
      processed.push(`<p>${trimmed}</p>`)
    }
  }

  const body = processed.join('\n')

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${slug}</title>
</head>
<body>
${body}
</body>
</html>`

  return new NextResponse(fullHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
