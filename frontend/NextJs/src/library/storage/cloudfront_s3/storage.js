import { IStorage } from "@/library/storage/interface/storage";

export class ContentsOperation extends IStorage {
  #contentsInstance;

  constructor({ contentsInstance: contentsInstance }) {
    super();
    this.#contentsInstance = contentsInstance;
  }

  async upload({
    body: body,
    userName: userName,
    fileName: fileName,
    keyValueArray: keyValueArray = undefined,
  }) {
    try {
      let tagging = "";
      if (keyValueArray) {
        for (let i = 0; i < keyValueArray.length; i++) {
          if (i == keyValueArray.length - 1)
            tagging += `${keyValueArray[i].key}=${keyValueArray[i].value}`;
          else tagging += `${keyValueArray[i].key}=${keyValueArray[i].value}&`;
        }
      }

      const result = await this.#contentsInstance.uploadObject({
        body: body,
        key: `${userName}/${fileName}`,
        tagging: tagging,
      });

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Storage");
      }
    }
  }

  async list({
    userName: userName,
    maxKeys: maxKeys = 1000,
    startAfter: startAfter = undefined,
  }) {
    try {
      const result = await this.#contentsInstance.listObjects({
        prefix: `${userName}/`,
        maxKeys: maxKeys,
        startAfter: startAfter,
      });
      console.log("result: ", result);

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Storage");
      }
    }
  }

  async listVersions({
    userName: userName,
    fileName: fileName,
    maxKeys: maxKeys = 1000,
  }) {
    try {
      const result = await this.#contentsInstance.listObjectVersions({
        prefix: `${userName}/${fileName}`,
        maxKeys: maxKeys,
      });
      console.log("result: ", result);

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Storage");
      }
    }
  }

  async info({
    userName: userName,
    fileName: fileName,
    versionId: versionId = undefined,
  }) {
    try {
      const result = await this.#contentsInstance.infoObject({
        key: `${userName}/${fileName}`,
        versionId: versionId,
      });
      console.log("result: ", result);

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Storage");
      }
    }
  }

  async download({
    userName: userName,
    fileName: fileName,
    versionId: versionId = undefined,
  }) {
    try {
      const result = await this.#contentsInstance.downloadObject({
        key: `${userName}/${fileName}`,
        versionId: versionId,
      });
      console.log("result: ", result);

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Storage");
      }
    }
  }

  async delete({
    userName: userName,
    fileName: fileName,
    versionId: versionId = undefined,
  }) {
    try {
      const result = await this.#contentsInstance.deleteObject({
        key: `${userName}/${fileName}`,
        versionId: versionId,
      });
      console.log("result: ", result);

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Storage");
      }
    }
  }
}
