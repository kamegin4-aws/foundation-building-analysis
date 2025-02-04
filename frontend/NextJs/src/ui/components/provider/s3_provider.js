'use client';

import { CognitoTokensCookie } from '@/library/cookies/cognito/login';
import { ContentsOperation } from '@/library/storage/cloudfront_s3/storage';
import { S3Wrapper } from '@/library/storage/infrastructure/s3/s3_client';
import { useRouter } from 'next/navigation';
import React, { createContext, useEffect, useState } from 'react';

export const S3Context = createContext(null);

export default function S3Provider(props) {
  const router = useRouter();

  //S3Context
  const [contentsClient, setContentsClient] = useState(null);

  useEffect(() => {
    const cognitoTokensCookie = new CognitoTokensCookie();
    cognitoTokensCookie
      .get()
      .then((tokens) => {
        if (!tokens)
          router.push(
            '/login?type=error&message=セッションを取得できませんでした。'
          );
        else {
          const contentsOperation = new ContentsOperation({
            contentsInstance: new S3Wrapper({ idToken: tokens.IdToken }),
          });

          setContentsClient(contentsOperation);
        }
      })
      .catch((error) => {
        router.push('/login?type=info&message=ログインしてください。');
      });
  }, []);

  return (
    <S3Context.Provider
      value={{
        contentsClient,
      }}
    >
      {props.children}
    </S3Context.Provider>
  );
}
