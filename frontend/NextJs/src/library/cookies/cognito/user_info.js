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

  set(data) {
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
        throw new Error(e.message);
      } else {
        throw new Error("Set Cookie Error");
      }
    }
  }

  async get() {
    try {
      if (!(await getCookie("Username"))) {
        return false;
      }

      return {
        userName: (await getCookie("Username")).value,
        email: (await getCookie("email")).value,
        userId: (await getCookie("sub")).value,
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("Get Cookie Error");
      }
    }
  }

  delete() {
    try {
      deleteCookie("Username");
      deleteCookie("email");
      deleteCookie("sub");
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("Delete Cookie Error");
      }
    }
  }
}
