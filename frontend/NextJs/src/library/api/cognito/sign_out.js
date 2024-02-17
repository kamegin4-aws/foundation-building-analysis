import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { UserInfoCookie } from "@/library/cookies/cognito/user_info";
import { ApiInterface } from "@/library/api/interface/api";

export class SignOut extends ApiInterface {
  #url = "/sam/cognito/logout";
  #options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: "cors",
  };
  constructor() {
    super();
  }

  async execute() {
    try {
      const cognitoTokensCookie = new CognitoTokensCookie();
      const userInfoCookie = new UserInfoCookie();

      const tokens = await cognitoTokensCookie.get();
      if (!tokens) {
        throw new Error("Not Cognito Tokens");
      }

      const formData = new FormData();
      formData.append("access_token", tokens.AccessToken);
      console.log("access_token", tokens.AccessToken);
      this.#options.body = formData;

      //cookieの削除
      userInfoCookie.delete();
      cognitoTokensCookie.delete();

      const response = fetch(this.#url, this.#options);

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
