"use client";

import { createContext, useEffect, useState } from "react";
import { GlobalAuthentication } from "@/library/authentication/global/authentication";
import { UserInfoCookie } from "@/library/cookies/cognito/user_info";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/app/loading";
import React from "react";

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

      authentication
        .checkSession()
        .then((session) => {
          if (session) {
            const userInfoCookie = new UserInfoCookie();
            userInfoCookie
              .get()
              .then((userInfo) => {
                console.log("userInfo", userInfo);
                setUserAttributes(userInfo);
              })
              .catch((e) => {
                router.push(
                  "/login?type=error&message=ユーザーの取得に失敗しました。"
                );
              });
          } else router.push("/login?type=info&message=セッションが切れました");
        })
        .catch((e) => {
          router.push("/login?type=info&message=ログインしてください。");
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
      <>{props.children}</>
    </CognitoContext.Provider>
  );
}
