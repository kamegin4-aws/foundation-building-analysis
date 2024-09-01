import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  const url =
    'https://b7bjj7fb3i.execute-api.ap-northeast-1.amazonaws.com/paid/cognito/sign-out';
  const options = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.API_KEY,
    },
    body: JSON.stringify({
      access_token: body.accessToken,
    }),
  };

  //@ts-ignore
  const response = await fetch(url, options);

  return NextResponse.json(response);
}
