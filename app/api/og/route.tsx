import { ImageResponse } from 'next/og'

export const runtime = 'edge'

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
                // Try fetching using VERCEL_URL first, fallback to origin
                const fetchUrl = bgImage.startsWith('http')
                    ? bgImage
                    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}${bgImage}` : `${origin}${bgImage}`);

                const res = await fetch(fetchUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!res.ok) {
                    errorMessage = `Fetch Failed: ${res.status} URL: ${fetchUrl}`;
                } else {
                    const buffer = await res.arrayBuffer();

                    // Convert ArrayBuffer to Base64 in Edge runtime using btoa and Uint8Array
                    let binary = '';
                    const bytes = new Uint8Array(buffer);
                    for (let i = 0; i < bytes.byteLength; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }

                    const mime = bgImage.endsWith('.jpg') || bgImage.endsWith('.jpeg') ? 'image/jpeg'
                        : bgImage.endsWith('.webp') ? 'image/webp'
                            : 'image/png';

                    bgImageData = `data:${mime};base64,${btoa(binary)}`;
                }
            } catch (err: any) {
                errorMessage = `Error: ${err.message}`;
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
                            <div style={{ color: 'red', fontSize: 24, paddingBottom: 20 }}>
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
