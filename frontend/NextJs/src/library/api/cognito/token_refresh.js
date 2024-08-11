import { GetUserInfo } from '@/library/api/cognito/get_user';
import { IApi } from '@/library/api/interface/api';
import { CognitoTokensCookie } from '@/library/cookies/cognito/login';

export class TokenRefresh extends IApi {
  #url = '/cognito/token/refresh';
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
      const getUserInfo = new GetUserInfo();

      const tokens = await cognitoTokensCookie.get();

      if (!tokens) {
        throw new Error('Not Cognito Cookies');
      }

      const inputGetUserInfo = {
        access_token: tokens.AccessToken,
      };

      const responseGetUserInfo = await getUserInfo.execute({
        formData: inputGetUserInfo,
      });

      if (!responseGetUserInfo.ok) {
        throw new Error('Get User Info Error');
      }

      const user = await responseGetUserInfo.json();

      const formObject = {
        refresh_token: tokens.RefreshToken,
        user_name: user.Username,
      };

      this.#options.headers = {
        'Content-Type': 'application/json',
      };
      this.#options.body = JSON.stringify(formObject);

      // @ts-ignore
      const response = fetch(this.#url, this.#options);

      //リフレッシュトークン
      const refresh = (await response).clone();

      if (refresh.ok) {
        const refreshObject = await refresh.json();
        cognitoTokensCookie.set({ data: refreshObject });
      } else {
        throw new Error('refresh Error');
      }

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
