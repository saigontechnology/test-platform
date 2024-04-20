import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { nextUrl: url } = request;
  if (url.pathname.startsWith('/exam_invitation')) {
    // Todo:
    const _examId = request.url.split('/').pop();
    /** Notes:
     *    - response.cookies.set() is feature of NextJS middleware
     *      to set custom cookie values
     */
    if (_examId) {
      const targetUrl = `${url.origin}/examination`,
        response = NextResponse.redirect(targetUrl);
      response.cookies.set('examId', _examId);
      return response;
    }
  }
}

export const config = {
  matcher: [
    '/exam_invitation/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
