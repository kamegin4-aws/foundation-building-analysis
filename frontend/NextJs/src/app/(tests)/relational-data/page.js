// app/object-test/page.js

'use client';

import React, { useState } from 'react';

const SearchParams = Object.freeze({
  0: '__icontains',
});

export default function ObjectDataPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [relationalId, setRelationalId] = useState('');
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');
  const [comment, setComment] = useState('');
  const [versionId, setVersionId] = useState('');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [orderBy, setOrderBy] = useState('-updated_at');
  const [searchValue, setSearchValue] = useState(null);
  const [fields, setFields] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  const handleCreateUser = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/cognito-users/`;
      let options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
        body: JSON.stringify({
          user_id: userId,
          user_name: userName,
          email: email,
          plan: plan,
        }),
      };

      //@ts-ignore
      let response = await fetch(url, options);

      const data = await response.json();

      setResult(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleListUser = async () => {
    try {
      let params = {};

      if (limit) {
        params['limit'] = limit;
      }
      if (offset) {
        params['offset'] = offset;
      }
      if (searchValue) {
        params[`plan${SearchParams[0]}`] = searchValue;
      }
      if (orderBy) {
        params['orderBy'] = orderBy;
      }
      if (fields) {
        params['fields'] = fields;
      }

      // @ts-ignore
      const urlSearchParam = new URLSearchParams(params).toString();

      const url = urlSearchParam
        ? `${process.env.NEXT_PUBLIC_BACKEND_PATH}/cognito-users/?${urlSearchParam}`
        : `${process.env.NEXT_PUBLIC_BACKEND_PATH}/cognito-users/`;
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
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleDetailUser = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/cognito-users/${relationalId}/`;
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

  const handleUpdateUser = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/cognito-users/${userId}/`;
      const options = {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
        body: JSON.stringify({
          user_id: userId,
          user_name: userName,
          email: email,
          plan: plan,
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

  const handleDeleteUser = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/cognito-users/${userId}/`;
      const options = {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
      };

      //@ts-ignore
      const response = await fetch(url, options);

      setResult({ message: 'Userを削除しました' });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCreateRelationalData = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/relational-data/`;
      let options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
        body: JSON.stringify({
          meta_key: metaKey,
          meta_value: metaValue,
          comment: comment,
          version_id: versionId,
          key: key,
          value: value,
          user: userId,
        }),
      };

      //@ts-ignore
      let response = await fetch(url, options);

      const data = await response.json();

      setResult(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleListRelationalData = async () => {
    try {
      let params = {};

      if (limit) {
        params['limit'] = limit;
      }
      if (offset) {
        params['offset'] = offset;
      }
      if (searchValue) {
        params[`meta_key${SearchParams[0]}`] = searchValue;
      }
      if (orderBy) {
        params['orderBy'] = orderBy;
      }
      if (fields) {
        params['fields'] = fields;
      }

      // @ts-ignore
      const urlSearchParam = new URLSearchParams(params).toString();

      const url = urlSearchParam
        ? `${process.env.NEXT_PUBLIC_BACKEND_PATH}/relational-data/?${urlSearchParam}`
        : `${process.env.NEXT_PUBLIC_BACKEND_PATH}/relational-data/`;
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
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleDetailRelationalData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/relational-data/${relationalId}/`;
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

  const handleUpdateRelationalData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/relational-data/${relationalId}/`;
      const options = {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
        body: JSON.stringify({
          meta_key: metaKey,
          meta_value: metaValue,
          comment: comment,
          version_id: versionId,
          key: key,
          value: value,
          user: userId,
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

  const handleDeleteRelationalData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_PATH}/relational-data/${relationalId}/`;
      const options = {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
      };

      //@ts-ignore
      const response = await fetch(url, options);

      setResult({ message: 'RelationalDataを削除しました' });
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
      <h1>RelationalData Test Page</h1>
      <div>
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <label>User Name:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Plan:</label>
        <input
          type="text"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        />
      </div>
      <div>
        <label>Relational Id:</label>
        <input
          type="text"
          value={relationalId}
          onChange={(e) => setRelationalId(e.target.value)}
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
        <label>Comment:</label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div>
        <label>Version Id:</label>
        <input
          type="text"
          value={versionId}
          onChange={(e) => setVersionId(e.target.value)}
        />
      </div>
      <div>
        <label>Key:</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
      <div>
        <label>Value:</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
          onChange={(e) => setOrderBy(e.target.value)}
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
      <div>
        <label>Fields:</label>
        <input
          type="text"
          value={fields}
          onChange={(e) => setFields(e.target.value)}
        />
      </div>

      <button onClick={handleCreateUser}>CreateUser</button>
      <button onClick={handleListUser}>ListUser</button>
      <button onClick={handleDetailUser}>DetailUser</button>
      <button onClick={handleUpdateUser}>UpdateUser</button>
      <button onClick={handleDeleteUser}>DeleteUser</button>
      <button onClick={handleCreateRelationalData}>CreateRelationalData</button>
      <button onClick={handleListRelationalData}>ListRelationalData</button>
      <button onClick={handleDetailRelationalData}>DetailRelationalData</button>
      <button onClick={handleUpdateRelationalData}>UpdateRelationalData</button>
      <button onClick={handleDeleteRelationalData}>DeleteRelationalData</button>

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
