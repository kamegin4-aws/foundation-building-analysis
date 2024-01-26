import { z } from "zod";

class ZodWrapper {
  #zod;

  constructor(zod) {
    this.#zod = zod;
  }

  userNameValidation(userName) {
    try {
      const result = this.#zod.string().min(1).max(256).safeParse(userName);

      if (result.success) {
        return true;
      } else {
        return JSON.stringify(result.error.format());
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("Zod Error");
      }
    }
  }

  passwordValidation(password) {
    try {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^\$\*\.\[\]\{\}\(\)\?\-"!@#%&\/\\,><':;\|_~`\+=])[a-zA-Z\d\^\$\*\.\[\]\{\}\(\)\?\-"!@#%&\/\\,><':;\|_~`\+=]{8,}$/;
      const result = this.#zod.string().regex(regex).safeParse(password);

      if (result.success) {
        return true;
      } else {
        return JSON.stringify(result.error.format());
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("Zod Error");
      }
    }
  }
}

export const validationZod = new ZodWrapper(z);
