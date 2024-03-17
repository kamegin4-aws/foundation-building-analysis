import { IGlobalAuthentication } from "@/library/authentication/interface/authentication";

export class GlobalAuthentication extends IGlobalAuthentication {
  #authenticationInstance;

  constructor(authenticationInstance) {
    super();
    this.#authenticationInstance = authenticationInstance;
  }

  checkSession() {
    try {
      const session = this.#authenticationInstance.getSession();
      if (!session) {
        const refreshSession = this.#authenticationInstance.refreshSession();
        if (!refreshSession) return false;
        else return refreshSession;
      }
      return session;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("checkSession Error");
      }
    }
  }

  getUser() {
    try {
      return this.#authenticationInstance.getUserAttributes();
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("getUser Error");
      }
    }
  }
}
