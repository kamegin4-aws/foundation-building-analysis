// app/object-test/page.js

'use client';

import React, { useState } from 'react';

export default function ObjectDataPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');
  const [comment, setComment] = useState('');
  const [versionId, setVersionId] = useState('');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [orderBy, setOrderBy] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(undefined);

  const handleUserCreate = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/user/detail`;
      let options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
        body: JSON.stringify({
          access_token: session.user.accessToken,
        }),
      };

      //@ts-ignore
      let response = await fetch(url, options);

      const cognitoUser = await response.json();

      url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/foundation-app/users/`;
      options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        // @ts-ignore
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
        body: JSON.stringify({
          user_id: cognitoUser.user_id,
        }),
      };

      //@ts-ignore
      response = await fetch(url, options);

      const data = await response.json();

      setResult(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUserList = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/foundation-app/users/`;
      const options = {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
      };

      //@ts-ignore
      const response = await fetch(url, options);

      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUserDetail = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/user/detail`;
      const options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
        body: JSON.stringify({
          access_token: session.user.accessToken,
        }),
      };

      //@ts-ignore
      const response = await fetch(url, options);

      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUserUpdate = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/user/detail`;
      const options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
        body: JSON.stringify({
          access_token: session.user.accessToken,
        }),
      };

      //@ts-ignore
      const response = await fetch(url, options);

      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
  };

  if (!session) {
    return (
      <div>
        <p>Session 情報取得中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>ObjectData Test Page</h1>
      <div>
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <label>Meta Key:</label>
        <input
          type="text"
          value={metaKey}
          onChange={(e) => setMetaKey(e.target.value)}
        />
      </div>
      <div>
        <label>Meta Value:</label>
        <input
          type="text"
          value={metaValue}
          onChange={(e) => setMetaValue(e.target.value)}
        />
      </div>
      <div>
        <label>MIME Type:</label>
        <input
          type="text"
          value={mimeType}
          onChange={(e) => setMimeType(e.target.value)}
        />
      </div>
      <div>
        <label>File Name:</label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
      <div>
        <label>Body (File):</label>
        <input type="file" onChange={(e) => setBody(e.target.files[0])} />
      </div>
      <div>
        <label>Comment:</label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div>
        <label>Version ID:</label>
        <input
          type="text"
          value={versionId}
          onChange={(e) => setVersionId(e.target.value)}
        />
      </div>
      <div>
        <label>Limit:</label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Offset:</label>
        <input
          type="number"
          value={offset}
          onChange={(e) => setOffset(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Order By:</label>
        <input
          type="text"
          value={orderBy}
          onChange={(e) => setVersionId(e.target.value)}
        />
      </div>
      <div>
        <label>Search Value:</label>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleMultipartUpload}>Multipart Upload</button>
      <button onClick={handleList}>List</button>
      <button onClick={handleDownload}>Download</button>
      <button onClick={handleDetail}>Detail</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleListVersions}>List Versions</button>
      <button onClick={handleCommentUpdate}>Update Comment</button>
      <button onClick={handlePermanentlyDelete}>Permanently Delete</button>

      {result && (
        <div>
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
