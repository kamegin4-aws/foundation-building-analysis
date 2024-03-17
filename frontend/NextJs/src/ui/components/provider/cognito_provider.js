"use client";

import { createContext, useEffect, useState } from "react";
import { GlobalAuthentication } from "@/library/authentication/global/authentication";
import { AmazonCognitoIdentityWrapper } from "@/library/authentication/infrastructure/cognito_identity_client";

export const CognitoContext = createContext();

export default function CognitoProvider(props) {
  //Cognito
  const [tokens, setTokens] = useState();
  const [userAttributes, setUserAttributes] = useState();

  useEffect(() => {
    const authentication = new GlobalAuthentication(
      new AmazonCognitoIdentityWrapper()
    );

    const session = authentication.getSession();
    console.log("session", session);

    if (session) {
      setTokens(session);
      const user = authentication.getUser();
      console.log("user", user);

      if (user) setUserAttributes(user);
    }
  }, []);

  return (
    <CognitoContext.Provider
      value={{
        tokens,
        userAttributes,
      }}
    >
      <>{props.children}</>
    </CognitoContext.Provider>
  );
}
