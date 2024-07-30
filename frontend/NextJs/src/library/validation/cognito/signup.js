import { IValidation } from '@/library/validation/interface/validation';
import log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'debug';
export class SignupValidation extends IValidation {
  #validationInstance;
  #validationList = [];
  #errorMessageList = [];
  #index = ['userName', 'email', 'password'];

  constructor({ validationInstance: validationInstance }) {
    super();
    this.#validationInstance = validationInstance;
  }

  execute({ formData: formData }) {
    try {
      logger.debug('formData', formData);

      const userName = this.#validationInstance.userNameValidation({
        userName: formData.user_name,
      });
      this.#validationList.push(userName);
      const email = this.#validationInstance.emailValidation({
        email: formData.user_email,
      });
      this.#validationList.push(email);
      const password = this.#validationInstance.passwordValidation({
        password: formData.password,
      });
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
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error('client error: Validation');
      }
    }
  }
}
