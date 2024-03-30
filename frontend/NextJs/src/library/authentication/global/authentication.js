import { IGlobalAuthentication } from "@/library/authentication/interface/authentication";
import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { TokenRefresh } from "@/library/api/cognito/token_refresh";
import { GetUserInfo } from "@/library/api/cognito/get_user_info";

export class GlobalAuthentication extends IGlobalAuthentication {
  constructor() {
    super();
  }
  async checkSession() {
    try {
      const cognitoTokens = new CognitoTokensCookie();
      const tokens = await cognitoTokens.get();

      if (!tokens) return false;

      const date = new Date();
      const dateString = date.toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      });

      if (new Date(dateString) < new Date(tokens.ExpiresIn)) return true;
      else {
        const refreshToken = new TokenRefresh();
        const responseRefreshToken = await refreshToken.execute();
        if (responseRefreshToken.ok) {
          const responseRefreshTokenObject = await responseRefreshToken.json();

          const getUserInfo = new GetUserInfo();
          const formDataGetUserInfo = new FormData();
          formDataGetUserInfo.append(
            "access_token",
            responseRefreshTokenObject.AccessToken
          );

          const responseGetUserInfo =
            await getUserInfo.execute(formDataGetUserInfo);
          if (!responseGetUserInfo.ok) {
            throw new Error("Get User Info Error");
          }
          return true;
        }

        return false;
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("checkSession Error");
      }
    }
  }
}
