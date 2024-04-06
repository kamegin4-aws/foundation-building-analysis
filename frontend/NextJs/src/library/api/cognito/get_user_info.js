import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { UserInfoCookie } from "@/library/cookies/cognito/user_info";
import { IApi } from "@/library/api/interface/api";

export class GetUserInfo extends IApi {
  #url = "/sam/cognito/user/info";
  #options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: "cors",
  };
  constructor() {
    super();
  }

  async execute({
    formData: formData = undefined,
    query: query = undefined,
  } = {}) {
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

      // @ts-ignore
      const response = fetch(this.#url, this.#options);

      //ユーザー情報の取得
      const responseUserInfo = (await response).clone();

      if (responseUserInfo.ok) {
        let responseUserInfoObject = await responseUserInfo.json();
        userInfoCookie.set({ data: responseUserInfoObject });
      } else {
        throw new Error("Get User Info Error");
      }

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: API");
      }
    }
  }
}
