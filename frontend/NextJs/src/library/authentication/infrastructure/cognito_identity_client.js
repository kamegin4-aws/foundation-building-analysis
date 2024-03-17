import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";
import { IAuthenticationInstance } from "@/library/authentication/infrastructure/interface/authentication";

export class AmazonCognitoIdentityWrapper extends IAuthenticationInstance {
  #poolData = {
    UserPoolId: process.env.UserPoolId, // Your user pool id here
    ClientId: process.env.ClientId, // Your client id here
  };
  #userPool = new CognitoUserPool(this.#poolData);
  #cognitoUser = this.#userPool.getCurrentUser();
  getSession() {
    try {
      if (this.#cognitoUser != null) {
        this.#cognitoUser.getSession(function (err, session) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return false;
          }
          console.log("session validity: " + session.isValid());

          if (session.isValid())
            return {
              idToken: session.getIdToken().getJwtToken(),
              accessToken: session.getAccessToken().getJwtToken(),
              refreshToken: session.getRefreshToken().getToken(),
            };
          else return false;

          // Instantiate aws sdk service objects now that the credentials have been updated.
          // example: var s3 = new AWS.S3();
        });
      }

      return false;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("amazon-cognito-identity Error");
      }
    }
  }

  refreshSession() {
    try {
      if (this.#cognitoUser != null) {
        const currentSession = this.#cognitoUser.getSession();
        const refresh_token = currentSession.getRefreshToken();
        this.#cognitoUser.refreshSession(refresh_token, (err, session) => {
          if (err) {
            console.log(err);
            return false;
          } else {
            return {
              idToken: session.getIdToken().getJwtToken(),
              accessToken: session.getAccessToken().getJwtToken(),
              refreshToken: session.getRefreshToken().getToken(),
            };
          }
        });
      }

      return false;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("amazon-cognito-identity Error");
      }
    }
  }

  getUserAttributes() {
    try {
      if (this.#cognitoUser != null) {
        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        this.#cognitoUser.getUserAttributes(function (err, attributes) {
          if (err) {
            // Handle error
            return false;
          } else {
            // Do something with attributes
            console.log("attributes", attributes);
            // 取得した属性情報を連想配列に格納
            let currentUserData = {};
            for (let attribute of attributes) {
              currentUserData[attribute.getName()] = attribute.getValue();
            }

            return currentUserData;
          }
        });
      }

      return false;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("amazon-cognito-identity Error");
      }
    }
  }
}
