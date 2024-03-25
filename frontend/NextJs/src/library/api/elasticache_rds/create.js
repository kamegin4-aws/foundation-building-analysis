import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { IApi } from "@/library/api/interface/api";

export class RelationalDataCreate extends IApi {
  #url = "/drf/elasticache";
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
      const cognitoTokens = await cognitoTokensCookie.get();
      if (!cognitoTokens) {
        throw new Error("Not Cognito Tokens");
      }

      this.#options.headers = {
        Authorization: `${cognitoTokens.TokenType} ${cognitoTokens.IdToken}`,
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
