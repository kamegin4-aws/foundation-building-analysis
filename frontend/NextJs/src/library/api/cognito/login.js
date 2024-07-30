import { IApi } from '@/library/api/interface/api';
import { CognitoTokensCookie } from '@/library/cookies/cognito/login';
import log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'debug';

export class UserNameLogin extends IApi {
  #url = '/cognito/login';
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
      this.#options.headers = {
        'Content-Type': 'application/json',
      };
      this.#options.body = JSON.stringify(formData);

      // @ts-ignore
      const response = fetch(this.#url, this.#options);

      const cognitoTokensCookie = new CognitoTokensCookie();

      //ログイン
      const login = (await response).clone();

      if (login.ok) {
        let responseObjectLogin = await login.json();
        logger.debug('responseObjectLogin', responseObjectLogin);
        cognitoTokensCookie.set({ data: responseObjectLogin });
      } else {
        throw new Error('Login Error');
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
