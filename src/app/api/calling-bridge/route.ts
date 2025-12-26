import { NextRequest, NextResponse } from 'next/server';

/**
 * CALLING BRIDGE API (SSE VERSION)
 * Supports POST to trigger calls and GET (SSE) to subscribe to real-time updates.
 */

// Global state for subscriptions
type SSEClient = {
    id: string;
    monitorId: string;
    controller: ReadableStreamDefaultController;
};

// We use a global variable to persist clients between requests in development.
// Note: In production, you'd want a more robust solution like Redis Pub/Sub.
let clients: SSEClient[] = [];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const monitorId = searchParams.get('monitorId') || 'GENERAL';
    const isStream = request.headers.get('accept') === 'text/event-stream';

    if (!isStream) {
        // Fallback: return a dummy response for non-SSE requests to avoid 404s
        return NextResponse.json({ message: 'SSE endpoint active. Use Accept: text/event-stream' });
    }

    const clientId = Math.random().toString(36).substring(2);

    const stream = new ReadableStream({
        start(controller) {
            const client = { id: clientId, monitorId, controller };
            clients.push(client);

            const encoder = new TextEncoder();
            // Send initial connection message to keep it alive
            controller.enqueue(encoder.encode(': connected\n\n'));

            console.log(`[SSE] Monitor ${monitorId} connected (${clientId}). Total monitors: ${clients.length}`);
        },
        cancel() {
            clients = clients.filter(c => c.id !== clientId);
            console.log(`[SSE] Monitor ${clientId} disconnected. Remaining: ${clients.length}`);
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Disable buffering for Nginx/Proxies
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { monitorId = 'GENERAL' } = body;

        const callData = {
            ...body,
            timestamp: Date.now()
        };

        console.log(`[CallingBridge] Broadasting call for ${body.pacienteNombre} (Monitor: ${monitorId})`);

        // Broadcast to relevant clients
        const encoder = new TextEncoder();
        const message = `event: call\ndata: ${JSON.stringify(callData)}\n\n`;

        let broadcastCount = 0;
        clients.forEach(client => {
            // Send to specific monitor OR any general monitor if the call is general
            if (client.monitorId === monitorId || client.monitorId === 'GENERAL' || monitorId === 'GENERAL') {
                try {
                    client.controller.enqueue(encoder.encode(message));
                    broadcastCount++;
                } catch (e) {
                    console.error(`[SSE] Failed to send to client ${client.id}`);
                }
            }
        });

        console.log(`[CallingBridge] Call sent to ${broadcastCount} monitors`);

        return NextResponse.json({ success: true, data: callData });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
