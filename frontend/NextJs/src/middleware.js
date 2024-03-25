import { NextResponse } from "next/server";

export function middleware(request, event) {
  const url = request.nextUrl.pathname;
  /*
  if (url == "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  */
  //console.log("middleware", request.nextUrl);

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sam|login|signup|.*svg|drf).*)",
  ],
};
