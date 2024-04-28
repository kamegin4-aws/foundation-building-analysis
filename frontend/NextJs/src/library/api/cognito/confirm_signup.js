import { IApi } from "@/library/api/interface/api";

export class ConfirmSignup extends IApi {
  #url = "/cognito/signup/confirm";
  #options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: "cors",
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
        "Content-Type": "application/json",
      };
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
