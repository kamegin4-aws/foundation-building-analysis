"use server";

import { cookies } from "next/headers";
/*
class CookieWrapper {
  #cookies;

  constructor(cookies) {
    this.#cookies = cookies;
  }

  async setCookie({ key: key, value: value }) {
    console.log("this.#cookies:", this.#cookies);
    this.#cookies.set({
      name: key,
      value: value,
      httpOnly: true,
      //path: "/",
    });
  }

  async getCookies() {
    const cookies = this.#cookies.getAll();
    console.log("cookieStore.getAll", cookies);

    return cookies;
  }
}

const cookieNext = new CookieWrapper(cookies);
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
