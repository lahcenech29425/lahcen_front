import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to redirect non-www to www for canonical URL consistency
 * This prevents duplicate content issues in Google Search Console
 */
export function proxy(request: NextRequest) {
    const host = request.headers.get('host');

    // Redirect lahcenway.com → www.lahcenway.com
    if (host && !host.startsWith('www.') && host.includes('lahcenway.com')) {
        const newHost = `www.${host}`;
        const newUrl = `${request.nextUrl.protocol}//${newHost}${request.nextUrl.pathname}${request.nextUrl.search}`;

        // 301 Permanent Redirect (tells search engines this is permanent)
        return NextResponse.redirect(newUrl, { status: 301 });
    }

    return NextResponse.next();
}

export const config = {
    // Apply to all routes except Next.js internals and static files
    matcher: [
        /*
         * Match all request paths except:
         * - api routes
         * - _next (Next.js internals)
         * - static files (images, fonts, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)',
    ],
};
