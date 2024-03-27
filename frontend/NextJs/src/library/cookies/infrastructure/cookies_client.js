"use server";

import { cookies } from "next/headers";
/* Server Actionでexportできるのはfunctionのみ
 */

export async function setCookie({ key: key, value: value }) {
  cookies().set({
    name: key,
    value: value,
    httpOnly: true,
    path: "/",
    domain:
      process.env.NEXT_PUBLIC_PROTOCOL == "http"
        ? "localhost"
        : process.env.NEXT_PUBLIC_HOST_DOMAIN,
  });
}

export async function getCookies() {
  const cookiesAll = cookies().getAll();
  console.log("cookieStore.getAll", cookiesAll);

  return cookiesAll;
}

export async function getCookie(key) {
  return cookies().get(key);
}

export async function deleteCookie(key) {
  return cookies().delete(key);
}
