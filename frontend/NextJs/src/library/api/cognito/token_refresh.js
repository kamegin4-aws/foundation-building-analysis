import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { UserInfoCookie } from "@/library/cookies/cognito/user_info";
import { IApi } from "@/library/api/interface/api";

export class TokenRefresh extends IApi {
  #url = "/sam/cognito/token/refresh";
  #options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: "cors",
  };
  constructor() {
    super();
  }

  async execute(formData = undefined, query = undefined) {
    try {
      const cognitoTokensCookie = new CognitoTokensCookie();
      const userInfoCookie = new UserInfoCookie();

      const tokens = await cognitoTokensCookie.get();
      const user = await userInfoCookie.get();
      if (!tokens || !user) {
        throw new Error("Not Cognito Cookies");
      }

      const formData = new FormData();
      formData.append("refresh_token", tokens.RefreshToken);
      formData.append("user_name", user.userName);

      this.#options.body = formData;

      // @ts-ignore
      const response = fetch(this.#url, this.#options);

      //リフレッシュトークン
      const refresh = (await response).clone();

      if (refresh.ok) {
        const refreshObject = await refresh.json();
        cognitoTokensCookie.set(refreshObject);
      } else {
        throw new Error("refresh Error");
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
