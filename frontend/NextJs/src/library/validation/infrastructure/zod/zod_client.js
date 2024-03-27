import { z } from "zod";
import { IValidationInstance } from "@/library/validation/infrastructure/interface/validation";

export class ZodWrapper extends IValidationInstance {
  userNameValidation(userName) {
    try {
      const result = z.string().min(1).max(256).safeParse(userName);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
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
      const result = z.string().regex(regex).safeParse(password);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
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

  emailValidation(email) {
    try {
      const result = z.string().email().safeParse(email);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
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

  codeValidation(code) {
    try {
      const regex = /^[0-9]{6}$/;
      const result = z.string().regex(regex).safeParse(code);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
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

  keyValidation(key) {
    try {
      const result = z.string().min(1).max(5120).safeParse(key);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
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

  valueValidation(value) {
    try {
      const result = z.string().max(51200).optional().safeParse(value);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
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
