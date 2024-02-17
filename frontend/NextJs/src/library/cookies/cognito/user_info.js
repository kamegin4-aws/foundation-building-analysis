import {
  setCookie,
  getCookie,
  getCookies,
} from "@/library/cookies/infrastructure/cookies";
import { CookieInterface } from "@/library/cookies/interface/cookies";

export class UserInfoCookie extends CookieInterface {
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
      const cookies = await getCookies();
      if (!cookies || !(await getCookie("Username"))) {
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
