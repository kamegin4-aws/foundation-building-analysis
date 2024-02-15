import { ApiInterface } from "@/library/api/interface/api";

export class Signup extends ApiInterface {
  #url = "/sam/cognito/signup";
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
    } catch {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("API Error");
      }
    }
  }
}
