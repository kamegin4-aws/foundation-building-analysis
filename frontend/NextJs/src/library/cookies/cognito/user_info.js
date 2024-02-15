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
        Username: (await getCookie("Username")).value,
        Email: (await getCookie("email")).value,
        UserId: (await getCookie("sub")).value,
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("Get Cookie Error");
      }
    }
  }
}
