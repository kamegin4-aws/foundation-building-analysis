"use server";

import { cookies } from "next/headers";
/* Server Actionでexportできるのはfunctionのみ
 */

export async function setCookie({ key: key, value: value }) {
  try {
    cookies().set({
      name: key,
      value: value,
      httpOnly: true,
      path: "/",
      domain: process.env.NEXT_PUBLIC_HOST_DOMAIN,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`cookie server error: ${e.message}`);
    } else {
      throw new Error("server error: Cookie");
    }
  }
}

export async function getCookies() {
  try {
    const cookiesAll = cookies().getAll();
    console.log("cookieStore.getAll", cookiesAll);

    return cookiesAll;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`cookie server error: ${e.message}`);
    } else {
      throw new Error("server error: Cookie");
    }
  }
}

export async function getCookie({ key: key }) {
  try {
    return cookies().get(key);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`cookie server error: ${e.message}`);
    } else {
      throw new Error("server error: Cookie");
    }
  }
}

export async function deleteCookie({ key: key }) {
  try {
    return cookies().delete(key);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`cookie server error: ${e.message}`);
    } else {
      throw new Error("server error: Cookie");
    }
  }
}
