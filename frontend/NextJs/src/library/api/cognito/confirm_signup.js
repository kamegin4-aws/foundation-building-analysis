import { IApi } from "@/library/api/interface/api";

export class ConfirmSignup extends IApi {
  #url = "/sam/cognito/signup/confirm";
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
      this.#options.body = formData;
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
