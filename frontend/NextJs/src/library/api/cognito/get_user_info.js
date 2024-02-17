import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { UserInfoCookie } from "@/library/cookies/cognito/user_info";
import { ApiInterface } from "@/library/api/interface/api";

export class GetUserInfo extends ApiInterface {
  #url = "/sam/cognito/user/info";
  #options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: "cors",
  };
  constructor() {
    super();
  }

  async execute(formData) {
    try {
      const cognitoTokensCookie = new CognitoTokensCookie();
      const userInfoCookie = new UserInfoCookie();
      const tokens = await cognitoTokensCookie.get();
      if (!tokens) {
        throw new Error("Not Cognito Tokens");
      }

      this.#options.headers = {
        Authorization: `${tokens.TokenType} ${tokens.IdToken}`,
      };
      this.#options.body = formData;

      const response = fetch(this.#url, this.#options);

      //ユーザー情報の取得
      const responseUserInfo = (await response).clone();

      if (responseUserInfo.ok) {
        let responseUserInfoObject = await responseUserInfo.json();
        userInfoCookie.set(responseUserInfoObject);
      } else {
        throw new Error("Get User Info Error");
      }

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("API Error");
      }
    }
  }
}
