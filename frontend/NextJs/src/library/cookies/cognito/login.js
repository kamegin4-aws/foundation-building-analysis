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

  set({ data: data }) {
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
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Cookie");
      }
    }
  }

  async get() {
    try {
      if (!(await getCookie({ key: "AccessToken" }))) {
        return false;
      }

      return {
        AccessToken: (await getCookie({ key: "AccessToken" })).value,
        ExpiresIn: (await getCookie({ key: "ExpiresIn" })).value,
        IdToken: (await getCookie({ key: "IdToken" })).value,
        RefreshToken: (await getCookie({ key: "RefreshToken" })).value,
        TokenType: (await getCookie({ key: "TokenType" })).value,
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
      deleteCookie({ key: "AccessToken" });
      deleteCookie({ key: "ExpiresIn" });
      deleteCookie({ key: "IdToken" });
      deleteCookie({ key: "RefreshToken" });
      deleteCookie({ key: "TokenType" });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Cookie");
      }
    }
  }
}
