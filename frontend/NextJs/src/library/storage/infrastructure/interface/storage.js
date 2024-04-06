/**
 *Storage用インスタンスのインターフェース
 */
export class IStorageInstance {
  /**
   * オブジェクトのアップロード
   * @typedef {Object} InputObjectUploadObject
   * @property {Buffer} body オブジェクトの中身
   * @property {string} key 保存場所: XXXX/XXXXXX.jpg
   * @property {string} [tagging=undefined] タグ：key1=value1&key2=value2
   * @param {InputObjectUploadObject} input インプット
   * @return {Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>} 結果
   * @typedef {Object} OutputObjectUploadObject
   * @property {string} ETag アップロードされたオブジェクトのエンティティタグ
   * @property {string} VersionId オブジェクトのバージョンID
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/PutObjectCommand/
   */
  async uploadObject({ body: body, key: key, tagging: tagging = undefined }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクト一覧
   * @typedef {Object} InputObjectListObjects
   * @property {string} prefix 指定されたプレフィックスで始まるキーへの応答を制限します。
   * @property {number} [maxKeys=1000] 応答で返されるキーの最大数を設定します。
   * @property {string} [startAfter=undefined] この指定されたキーの後にリストを開始します。
   * @param {InputObjectListObjects} input インプット
   * @return {Promise<import("@aws-sdk/client-s3").ListObjectsV2CommandOutput>} 結果
   * @typedef {Object} OutputObjectListObjects
   * @property {Record<string,string>[]} Contents 返される各オブジェクトに関するメタデータ
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/ListObjectsV2Command/
   */
  async listObjects({
    prefix: prefix = "",
    maxKeys: maxKeys = 1000,
    startAfter: startAfter = undefined,
  }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクトのバージョン一覧
   * @typedef {Object} InputObjectListObjectVersions
   * @property {string} prefix 指定されたプレフィックスで始まるキーへの応答を制限します。
   * @property {number} [maxKeys=1000] 応答で返されるキーの最大数を設定します。
   * @param {InputObjectListObjectVersions} input インプット
   * @return {Promise<import("@aws-sdk/client-s3").ListObjectVersionsCommandOutput>} 結果
   * @typedef {Object} OutputObjectListObjectVersions
   * @property {Record<string,string>[]} Versions バージョン情報のコンテナ
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/ListObjectVersionsCommand/
   */
  async listObjectVersions({ prefix: prefix = "", maxKeys: maxKeys = 1000 }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクトの情報
   * @typedef {Object} InputObjectInfoObject
   * @property {string} key オブジェクトキー
   * @property {string} [versionId=undefined] オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectInfoObject} input インプット
   * @return {Promise<import("@aws-sdk/client-s3").GetObjectAttributesCommandOutput>} 結果
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/GetObjectAttributesCommand/
   */
  async infoObject({ key: key = "", versionId: versionId = undefined }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクトのダウンロード
   * @typedef {Object} InputObjectDownloadObject
   * @property {string} key オブジェクトキー
   * @property {string} [versionId=undefined] オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectDownloadObject} input インプット
   * @return {Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>} 結果
   * @typedef {Object} OutputObjectDownloadObject
   * @property {Buffer} Body オブジェクトの中身
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/GetObjectCommand/
   */
  async downloadObject({ key: key = "", versionId: versionId = undefined }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクトの削除
   * @typedef {Object} InputObjectDeleteObject
   * @property {string} key オブジェクトキー
   * @property {string} [versionId=undefined] オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectDeleteObject} input インプット
   * @return {Promise<boolean>} 成功時:True
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/DeleteObjectCommand/
   */
  async deleteObject({ key: key = "", versionId: versionId = undefined }) {
    throw new Error("Not implemented");
  }
}
