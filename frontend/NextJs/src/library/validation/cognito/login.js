import { validationZod } from "@/library/validation/zod/zod";

export function loginValidation(formData) {
  try {
    const validationList = [];
    const errorMessageList = [];
    const index = ["userName", "password"];

    console.log("formData");
    for (let value of formData.entries()) {
      console.log(value);
    }

    const userName = validationZod.userNameValidation(
      formData.get("user_name")
    );
    validationList.push(userName);
    const password = validationZod.passwordValidation(formData.get("password"));
    validationList.push(password);

    for (let i = 0; i < validationList.length; i++) {
      if (validationList[i] !== true) {
        errorMessageList.push({
          index: index[i],
          message: validationList[i],
        });
      }
    }

    if (errorMessageList.length == 0) return true;
    else return JSON.stringify(errorMessageList);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Input Validation Error");
    }
  }
}
