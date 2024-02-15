import { NextResponse } from "next/server";
import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { UserInfoCookie } from "@/library/cookies/cognito/user_info";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|sam|signup|_next/static|_next/image|favicon.ico).*)",
  ],
};

export function middleware(request, event) {
  const url = request.nextUrl.clone();
  const matcher = /\.svg$/;
  const regex = new RegExp(matcher);

  const cognitoTokensCookie = new CognitoTokensCookie();
  const serInfoCookie = new UserInfoCookie();

  console.log("pathname:", url.pathname);
  if (url.pathname != "/" && !regex.test(url)) {
    if (
      !event.waitUntil(cognitoTokensCookie.get()) ||
      !event.waitUntil(serInfoCookie.get())
    ) {
      return NextResponse.rewrite(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
