import { ImageResponse } from 'next/og'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(request: Request) {
    try {
        const { searchParams, origin } = new URL(request.url)

        const title = searchParams.get('title') || 'Hello World'
        const category = searchParams.get('category') || 'Blog Post'
        const bgImage = searchParams.get('image')

        let bgImageData: string | null = null;
        let errorMessage: string | null = null;

        if (bgImage) {
            try {
                if (bgImage.startsWith('http')) {
                    // Fallback for external HTTP images
                    const res = await fetch(bgImage, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    if (!res.ok) {
                        errorMessage = `Remote Fetch Failed: ${res.status}`;
                    } else {
                        const buffer = await res.arrayBuffer();
                        const b64 = Buffer.from(buffer).toString('base64');
                        bgImageData = `data:image/png;base64,${b64}`;
                    }
                } else {
                    // Read file directly from serverless function disk using fs
                    const safePath = bgImage.startsWith('/') ? bgImage.slice(1) : bgImage;
                    const filePath = path.join(process.cwd(), 'public', safePath);
                    const fileBuffer = await fs.readFile(filePath);
                    const ext = path.extname(filePath).toLowerCase();
                    const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
                        : ext === '.webp' ? 'image/webp'
                            : 'image/png';

                    bgImageData = `data:${mime};base64,${fileBuffer.toString('base64')}`;
                }
            } catch (err: any) {
                errorMessage = `FS Read Error: ${err.message}`;
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
                        {errorMessage && (
                            <div style={{ color: '#ff4444', fontSize: 24, paddingBottom: 20 }}>
                                {errorMessage}
                            </div>
                        )}
                        <div style={{
                            fontSize: 32,
                            color: '#9ca3af',
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                        }}>
                            {category}
                        </div>
                        <div style={{
                            fontSize: 72,
                            color: 'white',
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                        }}>
                            {title}
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
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}
