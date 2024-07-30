import { IApi } from '@/library/api/interface/api';
import { CognitoTokensCookie } from '@/library/cookies/cognito/login';

export class SignOut extends IApi {
  #url = '/cognito/logout';
  #options = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    mode: 'cors',
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

      const tokens = await cognitoTokensCookie.get();
      if (!tokens) {
        throw new Error('Not Cognito Tokens');
      }

      const formObject = {
        access_token: tokens.AccessToken,
      };
      this.#options.headers = {
        'Content-Type': 'application/json',
      };
      this.#options.body = JSON.stringify(formObject);

      //cookieの削除
      cognitoTokensCookie.delete();

      // @ts-ignore
      const response = fetch(this.#url, this.#options);

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error('client error: API');
      }
    }
  }
}
