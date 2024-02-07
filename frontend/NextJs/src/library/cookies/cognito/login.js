import {
  setCookie,
  getCookie,
  getCookies,
} from "@/library/cookies/cookies/cookies";

export function setCognitoTokens(data) {
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
    /*
  const dateString = date.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  const timeString = date.toLocaleTimeString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  */
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
      throw new Error("Cookie Error");
    }
  }
}

export async function getCognitoTokens() {
  try {
    const cookies = await getCookies();
    console.log("cookies:", cookies);

    return {
      AccessToken: getCookie("AccessToken"),
      ExpiresIn: getCookie("ExpiresIn"),
      IdToken: getCookie("IdToken"),
      RefreshToken: getCookie("RefreshToken"),
      TokenType: getCookie("TokenType"),
    };
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Cookie Error");
    }
  }
}
