import { MIME_TYPE } from "@/library/common/constant/mimeType_check";
import { mimeTypeCheck } from "@/library/common/mimeType_check";
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
      let mimeTypeForApp = MIME_TYPE[10];

      if (keyValueArray) {
        for (let i = 0; i < keyValueArray.length; i++) {
          if (keyValueArray[i].key == "mimeType")
            // @ts-ignore
            mimeTypeForApp = mimeTypeCheck(keyValueArray[i].value);
          if (i == keyValueArray.length - 1)
            tagging += `${keyValueArray[i].key}=${keyValueArray[i].value}`;
          else tagging += `${keyValueArray[i].key}=${keyValueArray[i].value}&`;
        }
      }

      const result = await this.#contentsInstance.uploadObject({
        body: body,
        key: `${process.env.NEXT_PUBLIC_APP_NAME}/userName=${userName}/mimeType=${mimeTypeForApp}/${fileName}`,
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
        prefix: `${process.env.NEXT_PUBLIC_APP_NAME}/userName=${userName}/`,
        maxKeys: maxKeys,
        startAfter: startAfter,
      });

      let toString = Object.prototype.toString;

      for (let i = 0; i < result.Contents.length; i++) {
        if ("LastModified" in result.Contents[i]) {
          let flg = toString.call(result.Contents[i].LastModified).slice(8, -1);
          if (flg == "Date") {
            result.Contents[i].LastModified =
              result.Contents[i].LastModified.toLocaleString("ja-JP");
          }
        }
      }

      return result.Contents;
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
    mimeTyp: mimeTyp = "UnKnown",
    maxKeys: maxKeys = 1000,
  }) {
    try {
      const result = await this.#contentsInstance.listObjectVersions({
        prefix: `${process.env.NEXT_PUBLIC_APP_NAME}/userName=${userName}/mimeType=${mimeTyp}/${fileName}`,
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
    mimeTyp: mimeTyp = "UnKnown",
    versionId: versionId = undefined,
  }) {
    try {
      const result = await this.#contentsInstance.infoObject({
        key: `${process.env.NEXT_PUBLIC_APP_NAME}/userName=${userName}/mimeType=${mimeTyp}/${fileName}`,
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
    mimeTyp: mimeTyp = "UnKnown",
    versionId: versionId = undefined,
  }) {
    try {
      const result = await this.#contentsInstance.downloadObject({
        key: `${process.env.NEXT_PUBLIC_APP_NAME}/userName=${userName}/mimeType=${mimeTyp}/${fileName}`,
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
    mimeTyp: mimeTyp = "UnKnown",
    versionId: versionId = undefined,
  }) {
    try {
      const result = await this.#contentsInstance.deleteObject({
        key: `${process.env.NEXT_PUBLIC_APP_NAME}/userName=${userName}/mimeType=${mimeTyp}/${fileName}`,
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

  async infoTag({
    userName: userName,
    fileName: fileName,
    mimeTyp: mimeTyp = "UnKnown",
    versionId: versionId = undefined,
  }) {
    try {
      const result = await this.#contentsInstance.infoObjectTag({
        key: `${process.env.NEXT_PUBLIC_APP_NAME}/userName=${userName}/mimeType=${mimeTyp}/${fileName}`,
        versionId: versionId,
      });

      return result.TagSet;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`client error: ${e.message}`);
      } else {
        throw new Error("client error: Storage");
      }
    }
  }
}
