import { NextResponse, NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    const token = request.cookies.get('gam_access_token')?.value;
    const { pathname } = request.nextUrl;

    // We only protect frontend routes. Internal routes like /monitor are treated as public displays.
    const protectedPaths = ['/dashboard', '/patients', '/appointments', '/settings', '/agenda'];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/patients/:path*',
        '/appointments/:path*',
        '/settings/:path*',
        '/agenda/:path*',
        '/login',
    ],
};
