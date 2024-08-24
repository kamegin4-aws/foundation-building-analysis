export async function POST(request) {
  const body = await request.json();
  const requestHeaders = new Headers(request.headers);

  const url =
    'https://onfa87xwod.execute-api.ap-northeast-1.amazonaws.com/paid/cloudfront/url/signed';
  const options = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: requestHeaders.get('Authorization'),
    },
    body: JSON.stringify({
      s3_path: `userId=${body.userId}/metaKey=${body.metaKey}/metaValue=${body.metaValue}/mimeType=${body.mimeType}/${body.fileName}`,
      version_id: body.hasOwnProperty('versionId') ? body.versionId : '',
    }),
  };

  //@ts-ignore
  const response = await fetch(url, options);

  const data = await response.json();

  return Response.json(data);
}
