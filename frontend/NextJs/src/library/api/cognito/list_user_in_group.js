import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { IApi } from "@/library/api/interface/api";

export class ListUserInGroup extends IApi {
  #url = "/sam/cognito/group/user/list";
  #options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: "cors",
  };
  constructor() {
    super();
  }

  async execute(formData, query) {
    try {
      const cognitoTokensCookie = new CognitoTokensCookie();
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
