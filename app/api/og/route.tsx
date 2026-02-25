import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)

        // ?title=<title>&category=<category>&image=<imageLink>
        const title = searchParams.get('title')
        const category = searchParams.get('category') || 'Blog Post'
        const bgImage = searchParams.get('image')

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a',
                        backgroundImage: bgImage
                            ? `url(${bgImage})`
                            : 'linear-gradient(to right, #4f46e5, #9333ea)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Dark Overlay for readability */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            display: 'flex',
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '80px',
                            width: '100%',
                            height: '100%',
                            justifyContent: 'flex-end',
                            zIndex: 10,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 32,
                                fontWeight: 600,
                                color: '#a855f7',
                                marginBottom: 20,
                                textTransform: 'uppercase',
                                letterSpacing: 2,
                            }}
                        >
                            YEN WEE LIM | {category}
                        </div>
                        <div
                            style={{
                                fontSize: 64,
                                fontWeight: 800,
                                color: 'white',
                                lineHeight: 1.1,
                                maxWidth: '900px',
                            }}
                        >
                            {title || "Welcome to my Portfolio"}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (e: any) {
        console.log(`${e.message}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}
