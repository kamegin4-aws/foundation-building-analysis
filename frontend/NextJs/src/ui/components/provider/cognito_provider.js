'use client';

import Loading from '@/app/loading';
import { GetUserInfo } from '@/library/api/cognito/get_user';
import { GlobalAuthentication } from '@/library/authentication/global/authentication';
import { CognitoTokensCookie } from '@/library/cookies/cognito/login';
import log4js from 'log4js';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useEffect, useState } from 'react';

const logger = log4js.getLogger();
logger.level = 'debug';

export const CognitoContext = createContext(null);

export default function CognitoProvider(props) {
  const router = useRouter();
  const pathname = usePathname();

  const matcher = /^(?!.*(login|signup)).+$/;
  const regex = new RegExp(matcher);
  const matchResult = regex.test(pathname);

  //Cognito
  const [userAttributes, setUserAttributes] = useState(null);

  useEffect(() => {
    if (matchResult) {
      const authentication = new GlobalAuthentication();
      const cognitoTokensCookie = new CognitoTokensCookie();
      const getUserInfo = new GetUserInfo();

      authentication
        .checkSession()
        .then((session) => {
          if (session) {
            cognitoTokensCookie
              .get()
              .then((tokens) => {
                const inputGetUserInfo = {
                  access_token: tokens.AccessToken,
                };
                getUserInfo
                  .execute({ formData: inputGetUserInfo })
                  .then((res) => {
                    if (!res.ok) {
                      throw new Error('Get User Info Error');
                    }
                    res.json().then((user) => {
                      logger.debug('user: ', user);
                    });
                    setUserAttributes(res.data);
                  });
              })
              .catch((e) => {
                router.push(
                  '/login?type=error&message=ユーザーの取得に失敗しました。'
                );
              });
          } else router.push('/login?type=info&message=セッションが切れました');
        })
        .catch((e) => {
          router.push('/login?type=info&message=ログインしてください。');
        });
    }
  }, []);

  if (matchResult && !userAttributes) return <Loading />;

  return (
    <CognitoContext.Provider
      value={{
        userAttributes,
      }}
    >
      {props.children}
    </CognitoContext.Provider>
  );
}
