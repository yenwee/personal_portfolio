import { ImageResponse } from 'next/og'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(request: Request) {
    try {
        const { searchParams, origin } = new URL(request.url)

        // ?title=<title>&category=<category>&image=<imageLink>
        const title = searchParams.get('title')
        const category = searchParams.get('category') || 'Blog Post'
        const bgImage = searchParams.get('image')

        let bgImageData: string | null = null;

        if (bgImage) {
            try {
                if (bgImage.startsWith('http')) {
                    const res = await fetch(bgImage, { headers: { 'User-Agent': 'bot' } });
                    const arrayBuffer = await res.arrayBuffer();
                    const b64 = Buffer.from(arrayBuffer).toString('base64');
                    bgImageData = `data:image/png;base64,${b64}`;
                } else {
                    const filePath = path.join(process.cwd(), 'public', bgImage);
                    const fileBuffer = await fs.readFile(filePath);
                    const ext = path.extname(filePath).toLowerCase();
                    const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.webp' ? 'image/webp' : 'image/png';
                    bgImageData = `data:${mime};base64,${fileBuffer.toString('base64')}`;
                }
            } catch (err) {
                console.error("Failed to load bg image:", err);
            }
        }

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
                    }}
                >
                    {bgImageData ? (
                        <img
                            src={bgImageData}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundImage: 'linear-gradient(to right, #4f46e5, #9333ea)'
                        }} />
                    )}

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
