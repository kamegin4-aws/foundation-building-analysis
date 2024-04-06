import {
  setCookie,
  getCookie,
  getCookies,
  deleteCookie,
} from "@/library/cookies/infrastructure/cookies_client";
import { ICookie } from "@/library/cookies/interface/cookies";

export class UserInfoCookie extends ICookie {
  constructor() {
    super();
  }

  set({ data: data }) {
    try {
      setCookie({
        key: "Username",
        value: data.Username,
      });
      for (let userAttribute of data.UserAttributes) {
        setCookie({
          key: `${userAttribute.Name}`,
          value: userAttribute.Value,
        });
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Cookie");
      }
    }
  }

  async get() {
    try {
      if (!(await getCookie({ key: "Username" }))) {
        return false;
      }

      return {
        userName: (await getCookie({ key: "Username" })).value,
        email: (await getCookie({ key: "email" })).value,
        userId: (await getCookie({ key: "sub" })).value,
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Cookie");
      }
    }
  }

  delete() {
    try {
      deleteCookie({ key: "Username" });
      deleteCookie({ key: "email" });
      deleteCookie({ key: "sub" });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Cookie");
      }
    }
  }
}
