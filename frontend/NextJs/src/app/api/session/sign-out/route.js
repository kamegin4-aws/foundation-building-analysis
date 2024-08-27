import { NextResponse } from 'next/server';

export async function POST(request) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = searchParams.get('api-key');
  const accessToken = searchParams.get('access-token');

  const url =
    'https://b7bjj7fb3i.execute-api.ap-northeast-1.amazonaws.com/paid/cognito/sign-out';
  const options = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify({
      access_token: accessToken,
    }),
  };

  //@ts-ignore
  const response = await fetch(url, options);

  return NextResponse.json(response);
}
