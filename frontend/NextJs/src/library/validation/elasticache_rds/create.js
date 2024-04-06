import { IValidation } from "@/library/validation/interface/validation";

export class RelationalDataCreateValidation extends IValidation {
  #validationInstance;
  #validationList = [];
  #errorMessageList = [];
  #index = ["key", "value"];

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

      const key = this.#validationInstance.keyValidation({
        key: formData.get("key"),
      });
      this.#validationList.push(key);
      const value = this.#validationInstance.valueValidation({
        value: formData.get("value"),
      });
      this.#validationList.push(value);

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
