import { NextResponse } from 'next/server';

const allowedOrigins = [
  `https://${process.env.HOST_DOMAIN}`,
  `http://${process.env.APP_DOMAIN}:8080`,
];

const corsOptions = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

export function middleware(request) {
  // Check the origin from the request

  const { method, url } = request;

  // Get the current timestamp in JST (Japan Standard Time)
  const timestamp = new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  });

  console.log(`[${timestamp}] ${method} ${url}`);

  const { pathname } = new URL(request.url);

  const basePath = request.nextUrl.basePath || '';

  // ヘルスチェック用のエンドポイント
  if (pathname === `${basePath}/health`) {
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }

  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === 'OPTIONS';

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
    },
  ],
};
