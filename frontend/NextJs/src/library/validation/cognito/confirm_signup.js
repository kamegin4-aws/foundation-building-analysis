import { IValidation } from "@/library/validation/interface/validation";

export class ConfirmSignupValidation extends IValidation {
  #validationInstance;
  #validationList = [];
  #errorMessageList = [];
  #index = ["userName", "code"];

  constructor({ validationInstance: validationInstance }) {
    super();
    this.#validationInstance = validationInstance;
  }

  execute({ formData: formData }) {
    try {
      console.log("formData");
      for (let value of formData.entries()) {
        console.log(value);
      }

      const userName = this.#validationInstance.userNameValidation({
        userName: formData.get("user_name"),
      });
      this.#validationList.push(userName);
      const code = this.#validationInstance.codeValidation({
        code: formData.get("code"),
      });
      this.#validationList.push(code);

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
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Validation");
      }
    }
  }
}
