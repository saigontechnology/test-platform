import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/exam_invitation')) {
    // Todo:
    const _examId = request.url.split('/').pop();
    if (_examId) {
      const targetUrl = `${request.nextUrl.origin}/examination/`;
      NextResponse.next().cookies.set('examId', _examId);
      return NextResponse.redirect(targetUrl);
    }
  }
}

export const config = {
  matcher: ['/exam_invitation/:path*', '/about/:path*'],
};
