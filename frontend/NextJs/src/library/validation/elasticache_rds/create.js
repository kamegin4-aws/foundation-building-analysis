import { IValidation } from "@/library/validation/interface/validation";

export class RelationalDataCreateValidation extends IValidation {
  #validationInstance;
  #validationList = [];
  #errorMessageList = [];
  #index = ["key", "value", "userName"];

  constructor({ validationInstance: validationInstance }) {
    super();
    this.#validationInstance = validationInstance;
  }

  execute({ formData: formData }) {
    try {
      console.log("formData:", formData);

      const formDataObjectArray = formData.elasticache;

      const key = this.#validationInstance.keyValidation({
        key: formDataObjectArray[0].key,
      });
      this.#validationList.push(key);
      const value = this.#validationInstance.valueValidation({
        value: formDataObjectArray[0].value,
      });
      this.#validationList.push(value);
      const userName = this.#validationInstance.userNameValidation({
        userName: formData.user_name,
      });
      this.#validationList.push(userName);

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
