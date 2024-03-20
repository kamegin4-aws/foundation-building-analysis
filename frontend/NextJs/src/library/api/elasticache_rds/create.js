import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { IApi } from "@/library/api/interface/api";

export class Create extends IApi {
  #url = "/drf/elasticache-rds/create";
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
      const cognitoTokens = await cognitoTokensCookie.get();
      if (!tokens) {
        throw new Error("Not Cognito Tokens");
      }

      this.#options.headers = {
        Authorization: `${tokens.TokenType} ${tokens.IdToken}`,
      };

      const formDataGetUserInfo = new FormData();
      formDataGetUserInfo.append("access_token", cognitoTokens.AccessToken);
      this.#options.body = formDataGetUserInfo;

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
