export async function POST(request) {
  const body = await request.json();
  const requestHeaders = new Headers(request.headers);

  const url =
    'https://b7bjj7fb3i.execute-api.ap-northeast-1.amazonaws.com/paid/cognito/sign-in';
  const options = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': requestHeaders.get('X-Api-Key'),
    },
    body: JSON.stringify({
      user_name: body.user_name,
      password: body.password,
    }),
  };

  //@ts-ignore
  const response = await fetch(url, options);

  const data = await response.json();

  return Response.json(data);
}
