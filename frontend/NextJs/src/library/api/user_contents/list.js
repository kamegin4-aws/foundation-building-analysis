import { IApi } from '@/library/api/interface/api';
import { CognitoTokensCookie } from '@/library/cookies/cognito/login';

export class UserContentsList extends IApi {
  #url = '/drf/user-contents';
  #options = {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
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
      const cognitoTokens = await cognitoTokensCookie.get();
      if (!cognitoTokens) {
        throw new Error('Not Cognito Tokens');
      }

      this.#options.headers = {
        'Content-Type': 'application/json',
        Authorization: `${cognitoTokens.TokenType} ${cognitoTokens.IdToken}`,
      };

      if (query) {
        const queryParams = new URLSearchParams(query);
        this.#url = `${this.#url}?${queryParams}`;
      }

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
