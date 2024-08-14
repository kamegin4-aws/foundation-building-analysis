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
    userId: userId,
    metaKey: metaKey,
    metaValue: metaValue,
    mimeType: mimeType,
    fileName: fileName,
    comment: comment = undefined,
    body: body,
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
    userId: userId,
    metaKey: metaKey,
    metaValue: metaValue,
    mimeType: mimeType,
    fileName: fileName,
    comment: comment = undefined,
    body: body,
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
    userId = undefined,
    metaKey = undefined,
    limit = 20,
    offset = 0,
    searchValue = undefined,
    orderBy = 'updatedAt',
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
  async listVersions({
    userId: userId,
    metaKey: metaKey,
    metaValue: metaValue,
    mimeType: mimeType,
    fileName: fileName,
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
    userId: userId,
    metaKey: metaKey,
    metaValue: metaValue,
    mimeType: mimeType,
    fileName: fileName,
    versionId: versionId,
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
    userId: userId,
    metaKey: metaKey,
    metaValue: metaValue,
    mimeType: mimeType,
    fileName: fileName,
    versionId: versionId,
    comment: comment,
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
    userId: userId,
    metaKey: metaKey,
    metaValue: metaValue,
    mimeType: mimeType,
    fileName: fileName,
    versionId: versionId,
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
  async permanentlyDelete({
    userId: userId,
    metaKey: metaKey,
    metaValue: metaValue,
    mimeType: mimeType,
    fileName: fileName,
  }) {
    throw new Error('Not implemented');
  }
}
