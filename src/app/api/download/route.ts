import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const fileUrl = searchParams.get('url');
        const filename = searchParams.get('filename');

        console.log('Download request:', { fileUrl, filename });

        if (!fileUrl) {
            console.error('No file URL provided');
            return NextResponse.json(
                { error: 'File URL is required' },
                { status: 400 }
            );
        }

        console.log('Fetching file from:', fileUrl);

        // Fetch the file from Strapi
        const response = await fetch(fileUrl);

        console.log('Fetch response status:', response.status);

        if (!response.ok) {
            console.error('Failed to fetch file:', response.status, response.statusText);
            return NextResponse.json(
                { error: `Failed to fetch file: ${response.statusText}` },
                { status: response.status }
            );
        }

        const blob = await response.blob();
        console.log('Blob size:', blob.size);

        // Encode filename for Content-Disposition header (RFC 5987)
        const encodedFilename = encodeURIComponent(filename || 'download.pdf');

        // Create response with proper headers to force download
        return new NextResponse(blob, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="document.pdf"; filename*=UTF-8''${encodedFilename}`,
                'Cache-Control': 'no-cache',
            },
        });
    } catch (error) {
        console.error('Error proxying download:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
