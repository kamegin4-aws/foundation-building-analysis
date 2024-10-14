'use client';

import { S3Wrapper } from '@/library/repository/infrastructure/s3/s3_client';
import { ObjectData } from '@/library/repository/objectData/repository';
import React, { useEffect, useState } from 'react';

export default function ObjectDataPage() {
  const [userId, setUserId] = useState('');
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [fileName, setFileName] = useState('');
  const [body, setBody] = useState(null);
  const [comment, setComment] = useState('');
  const [versionId, setVersionId] = useState(null);
  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [orderBy, setOrderBy] = useState('-updatedAt');
  const [searchValue, setSearchValue] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [objectData, setObjectData] = useState(null);
  const [session, setSession] = useState(null);

  const handleUpload = async () => {
    try {
      const response = await objectData.upload({
        userId: userId,
        metaKey: metaKey,
        metaValue: metaValue,
        mimeType: mimeType,
        fileName: fileName,
        body: body,
        comment: comment,
      });
      setResult(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleMultipartUpload = async () => {
    try {
      const response = await objectData.multipartUpload({
        userId: userId,
        metaKey: metaKey,
        metaValue: metaValue,
        mimeType: mimeType,
        fileName: fileName,
        body: body,
        comment: comment,
      });
      setResult(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleList = async () => {
    try {
      const response = await objectData.list({
        userId: userId,
        metaKey: metaKey,
        limit: limit, // 必要に応じて変更
        offset: offset,
        orderBy: orderBy,
        searchValue: searchValue,
      });
      setResult(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleDownload = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/object-data/signed-url`;
      const options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.idToken}`,
        },
        body: JSON.stringify({
          userId: userId,
          metaKey: metaKey,
          metaValue: metaValue,
          mimeType: mimeType,
          fileName: fileName,
        }),
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

  const handleDetail = async () => {
    try {
      const response = await objectData.detail({
        userId: userId,
        metaKey: metaKey,
        metaValue: metaValue,
        mimeType: mimeType,
        fileName: fileName,
        versionId: versionId,
      });
      setResult(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await objectData.delete({
        userId: userId,
        metaKey: metaKey,
        metaValue: metaValue,
        mimeType: mimeType,
        fileName: fileName,
        versionId: versionId,
      });
      setResult(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleListVersions = async () => {
    try {
      const response = await objectData.listVersions({
        userId: userId,
        metaKey: metaKey,
        metaValue: metaValue,
        mimeType: mimeType,
        fileName: fileName,
      });
      setResult(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handleCommentUpdate = async () => {
    try {
      const response = await objectData.commentUpdate({
        userId: userId,
        metaKey: metaKey,
        metaValue: metaValue,
        mimeType: mimeType,
        fileName: fileName,
        versionId: versionId,
        comment: comment,
      });
      setResult(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  const handlePermanentlyDelete = async () => {
    try {
      const response = await objectData.permanentlyDelete({
        userId: userId,
        metaKey: metaKey,
        metaValue: metaValue,
        mimeType: mimeType,
        fileName: fileName,
      });
      setResult(response);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/session`;
    const options = {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // @ts-ignore
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              setSession(data);
              setObjectData(
                new ObjectData({
                  repositoryInstance: new S3Wrapper({
                    idToken: data.user.idToken,
                  }),
                })
              );
            })
            .catch((error) => {
              setError(`error for session: ${error.message}`);
            });
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((error) => {
        setError(`error for session: ${error.message}`);
      });
  }, []);

  if (!(session && objectData)) {
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
