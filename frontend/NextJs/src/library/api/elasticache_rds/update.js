import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { IApi } from "@/library/api/interface/api";
import { UserContentsCreate } from "@/library/api/user_contents/create";
import { UserContentsList } from "@/library/api/user_contents/list";

export class RelationalDataUpdate extends IApi {
  #url = "/drf/user-contents";
  #options = {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: "cors",
  };
  constructor({ userName: userName }) {
    super();
    this.#url = `${this.#url}/${userName}`;
  }

  async execute({
    formData: formData = undefined,
    query: query = undefined,
  } = {}) {
    try {
      const cognitoTokensCookie = new CognitoTokensCookie();
      const userContentsList = new UserContentsList();

      const cognitoTokens = await cognitoTokensCookie.get();
      if (!cognitoTokens) {
        throw new Error("Not Cognito Tokens");
      }

      let elasticacheList = [];
      //ユーザーデータ用のコンテンツが作成されていなければ作成
      const userContentsListResponse = await userContentsList.execute({
        query: { user_name: formData.user_name },
      });
      if (userContentsListResponse.ok) {
        const userContentsListResponseObject =
          await userContentsListResponse.json();
        if (userContentsListResponseObject.length == 0) {
          const userContentsCreate = new UserContentsCreate();
          const userContentsCreateResponse = await userContentsCreate.execute({
            formData: { user_name: formData.user_name },
          });

          if (!userContentsCreateResponse.ok)
            throw new Error("ユーザーコンテンツの作成に失敗しました。");
        } else {
          elasticacheList = userContentsListResponseObject[0].elasticache;
        }
      } else throw new Error("ユーザーコンテンツの取得に失敗しました。");

      this.#options.headers = {
        "Content-Type": "application/json",
        Authorization: `${cognitoTokens.TokenType} ${cognitoTokens.IdToken}`,
      };

      formData.elasticache = elasticacheList.concat(formData.elasticache);
      this.#options.body = JSON.stringify(formData);

      // @ts-ignore
      const response = fetch(this.#url, this.#options);

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
