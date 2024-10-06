/**
 *Repositoryインターフェース
 */
export class IRepository {
  /**
   * オブジェクトのアップロード
   * @typedef {Object} InputObjectUpload
   * @property {string} userId ユーザーID
   * @property {string} metaKey メタキー
   * @property {string} metaValue メタバリュー
   * @property {string} mimeType MIMEタイプ
   * @property {string} fileName ファイル名
   * @property {string} comment コメント
   * @property {Blob} body オブジェクトデータ
   * @param {InputObjectUpload} InputObjectUpload
   * @returns {Promise<Object>} Repositoryエンティティ
   */
  async upload({
    userId,
    metaKey,
    metaValue,
    mimeType,
    fileName,
    body,
    comment = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトのマルチアップロード
   * @typedef {Object} InputObjectMultipartUpload
   * @property {string} userId ユーザーID
   * @property {string} metaKey メタキー
   * @property {string} metaValue メタバリュー
   * @property {string} mimeType MIMEタイプ
   * @property {string} fileName ファイル名
   * @property {string} comment コメント
   * @property {Blob} body オブジェクトデータ
   * @param {InputObjectMultipartUpload} InputObjectMultipartUpload
   * @returns {Promise<Object>} Repositoryエンティティ
   */
  async multipartUpload({
    userId,
    metaKey,
    metaValue,
    mimeType,
    fileName,
    body,
    comment = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクト一覧
   * @typedef {Object} InputObjectList
   * @property {string} userId ユーザーID
   * @property {string} metaKey メタキー
   * @property {number} limit 最大件数
   * @property {number} offset オフセット
   * @property {string} searchValue 検索キーワード
   * @property {string} orderBy 並び替え(updatedAt|key,[-]降順)
   * @param {InputObjectList} InputObjectList
   * @returns {Promise<Object[]>} Repositoryエンティティ
   */
  async list({
    limit = 20,
    offset = 0,
    orderBy = 'updatedAt',
    userId = undefined,
    metaKey = undefined,
    searchValue = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトのバージョン一覧
   * @typedef {Object} InputObjectListVersions
   * @property {string} userId ユーザーID
   * @property {string} metaKey メタキー
   * @property {string} metaValue メタバリュー
   * @property {string} mimeType MIMEタイプ
   * @property {string} fileName ファイル名
   * @param {InputObjectListVersions} InputObjectListVersions
   * @returns {Promise<Object[]>} Repositoryエンティティ
   */
  async listVersions({ userId, metaKey, metaValue, mimeType, fileName }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトのダウンロード
   * @typedef {Object} InputObjectDownload
   * @property {string} userId ユーザーID
   * @property {string} metaKey メタキー
   * @property {string} metaValue メタバリュー
   * @property {string} mimeType MIMEタイプ
   * @property {string} fileName ファイル名
   * @property {string} versionId バージョンID
   * @param {InputObjectDownload} InputObjectDownload
   * @returns {Promise<Object>} Repositoryエンティティ
   */
  async download({
    userId,
    metaKey,
    metaValue,
    mimeType,
    fileName,
    versionId = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトの詳細
   * @typedef {Object} InputObjectDetail
   * @property {string} userId ユーザーID
   * @property {string} metaKey メタキー
   * @property {string} metaValue メタバリュー
   * @property {string} mimeType MIMEタイプ
   * @property {string} fileName ファイル名
   * @property {string} versionId バージョンID
   * @param {InputObjectDetail} InputObjectDetail
   * @returns {Promise<Object>} Repositoryエンティティ
   */
  async detail({
    userId,
    metaKey,
    metaValue,
    mimeType,
    fileName,
    versionId = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * コメントの更新
   * @typedef {Object} InputObjectCommentUpdate
   * @property {string} userId ユーザーID
   * @property {string} metaKey メタキー
   * @property {string} metaValue メタバリュー
   * @property {string} mimeType MIMEタイプ
   * @property {string} fileName ファイル名
   * @property {string} versionId バージョンID
   * @property {string} comment コメント
   * @param {InputObjectCommentUpdate} InputObjectCommentUpdate
   * @returns {Promise<Object>} Repositoryエンティティ
   */
  async commentUpdate({
    userId,
    metaKey,
    metaValue,
    mimeType,
    fileName,
    comment,
    versionId = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトの削除
   * @typedef {Object} InputObjectDelete
   * @property {string} userId ユーザーID
   * @property {string} metaKey メタキー
   * @property {string} metaValue メタバリュー
   * @property {string} mimeType MIMEタイプ
   * @property {string} fileName ファイル名
   * @property {string} versionId バージョンID
   * @param {InputObjectDelete} InputObjectDelete
   *@returns {Promise<Object>} Repositoryエンティティ
   */
  async delete({
    userId,
    metaKey,
    metaValue,
    mimeType,
    fileName,
    versionId = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトの完全削除
   * @typedef {Object} InputObjectPermanentlyDelete
   * @property {string} userId ユーザーID
   * @property {string} metaKey メタキー
   * @property {string} metaValue メタバリュー
   * @property {string} mimeType MIMEタイプ
   * @property {string} fileName ファイル名
   * @param {InputObjectPermanentlyDelete} InputObjectPermanentlyDelete
   * @return {Promise<boolean>}
   */
  async permanentlyDelete({ userId, metaKey, metaValue, mimeType, fileName }) {
    throw new Error('Not implemented');
  }
}
