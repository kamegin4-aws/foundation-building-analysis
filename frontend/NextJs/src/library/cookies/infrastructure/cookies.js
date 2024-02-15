"use server";

import { cookies } from "next/headers";
/* Server Actionでexportできるのはfunctionのみ
 */

export async function setCookie({ key: key, value: value }) {
  cookies().set({
    name: key,
    value: value,
    httpOnly: true,
    //path: "/",
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
