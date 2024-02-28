import { IValidation } from "@/library/validation/interface/validation";

export class SignupValidation extends IValidation {
  #validationInstance;
  #validationList = [];
  #errorMessageList = [];
  #index = ["userName", "email", "password"];

  constructor(validationInstance) {
    super();
    this.#validationInstance = validationInstance;
  }

  execute(formData) {
    try {
      console.log("formData");
      for (let value of formData.entries()) {
        console.log(value);
      }

      const userName = this.#validationInstance.userNameValidation(
        formData.get("user_name")
      );
      this.#validationList.push(userName);
      const email = this.#validationInstance.emailValidation(
        formData.get("user_email")
      );
      this.#validationList.push(email);
      const password = this.#validationInstance.passwordValidation(
        formData.get("password")
      );
      this.#validationList.push(password);

      for (let i = 0; i < this.#validationList.length; i++) {
        if (this.#validationList[i] !== true) {
          this.#errorMessageList.push({
            index: this.#index[i],
            message: this.#validationList[i],
          });
        }
      }

      if (this.#errorMessageList.length == 0) return true;
      else return this.#errorMessageList;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("Input Validation Error");
      }
    }
  }
}
