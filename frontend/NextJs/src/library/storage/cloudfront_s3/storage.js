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
        key: `FoundationBuildingApp/${userName}/${fileName}`,
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
        prefix: `FoundationBuildingApp/${userName}/`,
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
    maxKeys: maxKeys = 1000,
  }) {
    try {
      const result = await this.#contentsInstance.listObjectVersions({
        prefix: `FoundationBuildingApp/${userName}/${fileName}`,
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
        key: `FoundationBuildingApp/${userName}/${fileName}`,
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
        key: `FoundationBuildingApp/${userName}/${fileName}`,
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
        key: `FoundationBuildingApp/${userName}/${fileName}`,
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
    versionId: versionId = undefined,
  }) {
    try {
      const result = await this.#contentsInstance.infoObjectTag({
        key: `FoundationBuildingApp/${userName}/${fileName}`,
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
