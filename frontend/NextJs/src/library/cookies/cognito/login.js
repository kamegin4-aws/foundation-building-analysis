import {
  setCookie,
  getCookie,
  getCookies,
  deleteCookie,
} from "@/library/cookies/infrastructure/cookies_client";
import { ICookie } from "@/library/cookies/interface/cookies";

export class CognitoTokensCookie extends ICookie {
  constructor() {
    super();
  }

  set(data) {
    try {
      setCookie({
        key: "AccessToken",
        value: data.AccessToken,
      });
      let date = new Date();
      date.setSeconds(date.getSeconds() + data.ExpiresIn);
      const dateString = date.toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      });
      setCookie({
        key: "ExpiresIn",
        value: dateString,
      });
      setCookie({
        key: "IdToken",
        value: data.IdToken,
      });
      setCookie({
        key: "RefreshToken",
        value: data.RefreshToken,
      });
      setCookie({
        key: "TokenType",
        value: data.TokenType,
      });
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
      if (!(await getCookie("AccessToken"))) {
        return false;
      }

      return {
        AccessToken: (await getCookie("AccessToken")).value,
        ExpiresIn: (await getCookie("ExpiresIn")).value,
        IdToken: (await getCookie("IdToken")).value,
        RefreshToken: (await getCookie("RefreshToken")).value,
        TokenType: (await getCookie("TokenType")).value,
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
      deleteCookie("AccessToken");
      deleteCookie("ExpiresIn");
      deleteCookie("IdToken");
      deleteCookie("RefreshToken");
      deleteCookie("TokenType");
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("Delete Cookie Error");
      }
    }
  }
}
