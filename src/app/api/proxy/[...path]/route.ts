import { NextRequest, NextResponse } from 'next/server';

const GAM_BASE_URL = process.env.NEXT_PUBLIC_GAM_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';

type RouteParams = {
    path: string[];
};

export async function GET(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
    return handleProxy(request, params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
    return handleProxy(request, params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
    return handleProxy(request, params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<RouteParams> }) {
    return handleProxy(request, params);
}

async function handleProxy(request: NextRequest, paramsPromise: Promise<RouteParams>) {
    const { path } = await paramsPromise;
    const targetPath = path.join('/');
    const { search } = request.nextUrl;

    // Construct the final URL
    const targetUrl = new URL(`${GAM_BASE_URL}/${targetPath}${search}`);

    console.log(`[Proxy] Routing ${request.method} to: ${targetUrl.toString()}`);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete('host');
    requestHeaders.delete('connection');

    try {
        const body = request.method !== 'GET' && request.method !== 'HEAD'
            ? await request.arrayBuffer()
            : undefined;

        if (body) {
            console.log(`[Proxy] Body size: ${body.byteLength} bytes`);
            console.log(`[Proxy] Content-Type: ${requestHeaders.get('content-type')}`);
            console.log(`[Proxy] Decoded Body: ${new TextDecoder().decode(body)}`);
        }

        const response = await fetch(targetUrl.toString(), {
            method: request.method,
            headers: requestHeaders,
            body: body,
            cache: 'no-store',
            redirect: 'follow'
        });

        console.log(`[Proxy] Backend responded with status: ${response.status}`);

        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('content-length');
        responseHeaders.delete('transfer-encoding');
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        const responseData = await response.arrayBuffer();

        if (!response.ok) {
            const errorText = new TextDecoder().decode(responseData);
            console.log(`[Proxy] Backend error body: ${errorText}`);
        }

        return new NextResponse(responseData, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error('[Proxy] Critical error:', error);
        return NextResponse.json(
            { error: 'Proxy request failed', details: error.message },
            { status: 502 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
