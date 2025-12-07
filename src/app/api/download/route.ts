import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const bookId = searchParams.get('id');
        const filename = searchParams.get('filename');

        console.log('Download request for book:', bookId, 'filename:', filename);

        if (!bookId) {
            console.error('No book ID provided');
            return NextResponse.json(
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        // Fetch book details from Strapi to get PDF URL
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
        const bookResponse = await fetch(`${baseUrl}/api/books/${bookId}?populate=*`);

        if (!bookResponse.ok) {
            console.error('Failed to fetch book details:', bookResponse.status);
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        const bookData = await bookResponse.json();
        const pdfUrl = bookData.data?.pdfFile?.url;

        if (!pdfUrl) {
            console.error('No PDF file found for book');
            return NextResponse.json(
                { error: 'PDF not found' },
                { status: 404 }
            );
        }

        console.log('Fetching PDF from:', pdfUrl);

        // Fetch the actual PDF file - handle relative URLs from Strapi
        const fullPdfUrl = pdfUrl.startsWith('http') ? pdfUrl : `${baseUrl}${pdfUrl}`;
        const pdfResponse = await fetch(fullPdfUrl);

        console.log('PDF fetch response status:', pdfResponse.status);

        if (!pdfResponse.ok) {
            console.error('Failed to fetch PDF:', pdfResponse.status, pdfResponse.statusText);
            return NextResponse.json(
                { error: `Failed to fetch PDF: ${pdfResponse.statusText}` },
                { status: pdfResponse.status }
            );
        }

        const blob = await pdfResponse.blob();
        console.log('PDF blob size:', blob.size);

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
