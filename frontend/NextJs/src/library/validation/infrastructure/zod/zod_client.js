import { z } from "zod";
import { IValidationInstance } from "@/library/validation/infrastructure/interface/validation";

export class ZodWrapper extends IValidationInstance {
  userNameValidation({ userName: userName }) {
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
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  passwordValidation({ password: password }) {
    try {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^\$\*\.\[\]\{\}\(\)\?\-"!@#%&\/\\,><':;\|_~`\+=])[a-zA-Z\d\^\$\*\.\[\]\{\}\(\)\?\-"!@#%&\/\\,><':;\|_~`\+=]{8,32}$/;
      const result = z.string().regex(regex).safeParse(password);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
        return JSON.stringify(result.error.format());
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  emailValidation({ email: email }) {
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
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  codeValidation({ code: code }) {
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
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  keyValidation({ key: key }) {
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
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  valueValidation({ value: value }) {
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
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  fileMIMETypeValidation({ mimeType: mimeType }) {
    try {
      const regex =
        /audio\/|image\/|text\/|video\/|application\/msword|application\/json|application\/pdf|application\/vnd\.ms-powerpoint|application\/zip|application\/vnd\.ms-excel/;
      const result = z.string().regex(regex).safeParse(mimeType);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
        return JSON.stringify(result.error.format());
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  fileSizeValidation({ fileSize: fileSize }) {
    try {
      const result = z
        .number()
        .gte(1)
        .lte(500 * 10 ** 6)
        .safeParse(fileSize);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
        return JSON.stringify(result.error.format());
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  fileNameValidation({ fileName: fileName }) {
    try {
      const result = z.string().min(1).max(1024).safeParse(fileName);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
        return JSON.stringify(result.error.format());
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  filesNumberValidation({ filesNumber: filesNumber }) {
    try {
      const result = z.number().gte(1).lte(100).safeParse(filesNumber);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
        return JSON.stringify(result.error.format());
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }

  filesSizeValidation({ filesSize: filesSize }) {
    try {
      const result = z
        .number()
        .gte(1)
        .lte(5 * 10 ** 9)
        .safeParse(filesSize);

      if (result.success) {
        return true;
      } else {
        // @ts-ignore
        return JSON.stringify(result.error.format());
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`zod server error: ${e.message}`);
      } else {
        throw new Error("server error: Zod");
      }
    }
  }
}
