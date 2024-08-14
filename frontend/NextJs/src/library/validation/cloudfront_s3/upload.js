import { IValidation } from '@/library/validation/interface/validation';

export class ContentsDataUploadValidation extends IValidation {
  #validationInstance;
  #validationList = [];
  #errorMessageList = [];

  constructor({ validationInstance: validationInstance }) {
    super();
    this.#validationInstance = validationInstance;
  }

  execute({ formData: formData }) {
    try {
      console.log('formData:', formData);

      const filesMeta = formData.filesMeta;
      let sumSize = 0;

      const filesNumber = this.#validationInstance.filesNumberValidation({
        filesNumber: filesMeta.length,
      });

      if (filesNumber != true) {
        this.#errorMessageList.push({
          index: '-1',
          message: filesNumber,
        });
        return this.#errorMessageList;
      }

      for (let fileMeta of filesMeta) {
        const fileName = this.#validationInstance.fileNameValidation({
          fileName: fileMeta.name,
        });
        this.#validationList.push(fileName);
        const mimeType = this.#validationInstance.fileMIMETypeValidation({
          mimeType: fileMeta.mimeType,
        });
        this.#validationList.push(mimeType);
        const fileSize = this.#validationInstance.fileSizeValidation({
          fileSize: fileMeta.size,
        });
        this.#validationList.push(fileSize);

        sumSize += fileMeta.size;
      }

      const filesSize = this.#validationInstance.filesSizeValidation({
        filesSize: sumSize,
      });

      if (filesSize != true) {
        this.#errorMessageList.push({
          index: '-1',
          message: filesSize,
        });
        return this.#errorMessageList;
      }

      for (let i = 0; i < this.#validationList.length; i++) {
        if (this.#validationList[i] !== true) {
          this.#errorMessageList.push({
            index: String(i),
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
