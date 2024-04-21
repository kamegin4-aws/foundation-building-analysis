/**
 *Storage用インターフェース
 */
export class IStorage {
  /**
   * オブジェクトのアップロード
   * @typedef {Object} InputObjectUpload
   * @property {Buffer} body オブジェクトの中身
   * @property {string} userName ユーザー名
   * @property {string} fileName ファイル名
   * @property {Record<string,string>} [keyValueArray=undefined] タグ：key1=value1&key2=value2
   * @param {InputObjectUpload} input インプット
   * @typedef {Object} OutputObjectUpload
   * @property {string} ETag アップロードされたオブジェクトのエンティティタグ
   * @property {string} [VersionId] オブジェクトのバージョンID
   * @return {Promise<OutputObjectUpload>} アウトプット
   */
  async upload({
    body: body,
    userName: userName,
    fileName: fileName,
    keyValueArray: keyValueArray = undefined,
  }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクト一覧
   * @typedef {Object} InputObjectList
   * @property {string} userName ユーザー名
   * @property {number} [maxKeys=1000] 応答で返されるキーの最大数を設定します。
   * @property {string} [startAfter=undefined] この指定されたキーの後にリストを開始します。
   * @param {InputObjectList} input インプット
   * @return {Promise<Record<string,string>[]>} 結果
   * @typedef {Object} OutputObjectList
   */
  async list({
    userName: userName,
    maxKeys: maxKeys = 1000,
    startAfter: startAfter = undefined,
  }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクトのバージョン一覧
   * @typedef {Object} InputObjectListVersions
   * @property {string} userName ユーザー名
   * @property {string} fileName ファイル名
   * @property {string} [mimeTyp="UnKnown"] MIMEタイプ
   * @property {number} [maxKeys=1000] 応答で返されるキーの最大数を設定します。
   * @param {InputObjectListVersions} input インプット
   * @return {Promise<import("@aws-sdk/client-s3").ListObjectVersionsCommandOutput>} 結果
   * @typedef {Object} OutputObjectListVersions
   */
  async listVersions({
    userName: userName,
    fileName: fileName,
    mimeTyp: mimeTyp = "UnKnown",
    maxKeys: maxKeys = 1000,
  }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクトの情報
   * @typedef {Object} InputObjectInfo
   * @property {string} userName ユーザー名
   * @property {string} fileName ファイル名
   * @property {string} [mimeTyp="UnKnown"] MIMEタイプ
   * @property {string} [versionId=undefined] オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectInfo} input インプット
   * @return {Promise<import("@aws-sdk/client-s3").GetObjectAttributesCommandOutput>} 結果
   * @typedef {Object} OutputObjectInfo
   */
  async info({
    userName: userName,
    fileName: fileName,
    mimeTyp: mimeTyp = "UnKnown",
    versionId: versionId = undefined,
  }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクトのダウンロード
   * @typedef {Object} InputObjectDownload
   * @property {string} userName ユーザー名
   * @property {string} fileName ファイル名
   * @property {string} [mimeTyp="UnKnown"] MIMEタイプ
   * @property {string} [versionId=undefined] オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectDownload} input インプット
   * @return {Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>} 結果
   * @typedef {Object} OutputObjectDownload
   */
  async download({
    userName: userName,
    fileName: fileName,
    mimeTyp: mimeTyp = "UnKnown",
    versionId: versionId = undefined,
  }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクトの削除
   * @typedef {Object} InputObjectDelete
   * @property {string} userName ユーザー名
   * @property {string} fileName ファイル名
   * @property {string} [mimeTyp="UnKnown"] MIMEタイプ
   * @property {string} [versionId=undefined] オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectDelete} input インプット
   * @return {Promise<boolean>} 成功時:True
   */
  async delete({
    userName: userName,
    fileName: fileName,
    mimeTyp: mimeTyp = "UnKnown",
    versionId: versionId = undefined,
  }) {
    throw new Error("Not implemented");
  }

  /**
   * オブジェクトのタグ情報
   * @typedef {Object} InputObjectInfoObjectTag
   * @property {string} userName ユーザー名
   * @property {string} fileName ファイル名
   * @property {string} [mimeTyp="UnKnown"] MIMEタイプ
   * @property {string} [versionId=undefined] オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectInfoObjectTag} input インプット
   * @return {Promise<import("@aws-sdk/client-s3").GetObjectTaggingCommandOutput>} 結果
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/GetObjectTaggingCommand/
   */
  async infoTag({
    userName: userName,
    fileName: fileName,
    mimeTyp: mimeTyp = "UnKnown",
    versionId: versionId = undefined,
  }) {
    throw new Error("Not implemented");
  }
}
