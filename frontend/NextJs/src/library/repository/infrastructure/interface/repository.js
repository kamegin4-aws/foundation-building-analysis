import { Service_Name } from '@/library/repository/constant/repository';

/**
 *Repositoryインスタンスのインターフェース
 */
export class IRepositoryInstance {
  /**
   * オブジェクトのアップロード
   * @typedef {Object} InputObjectUploadObject
   * @property {Blob} body オブジェクトの中身
   * @property {string} key 保存場所: XXXX/XXXXXX.jpg
   * @property {string} tagging タグ：key1=value1&key2=value2
   * @param {InputObjectUploadObject} InputObjectUploadObject
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async uploadObject({ body: body, key: key, tagging: tagging = undefined }) {
    throw new Error('Not implemented');
  }

  /**
   * マルチパートオブジェクトの作成
   * @typedef {Object} InputObjetCreateMultipartObject
   * @property {string} key 保存場所: XXXX/XXXXXX.jpg
   * @property {string} tagging タグ：key1=value1&key2=value2
   * @param {InputObjetCreateMultipartObject} InputObjetCreateMultipartObject
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async createMultipartObject({ key: key, tagging: tagging = undefined }) {
    throw new Error('Not implemented');
  }

  /**
   * マルチパートオブジェクトのアップロード
   * @typedef {Object} InputObjetUploadMultipartObject
   * @property {Blob} body オブジェクトの中身
   * @property {string} key 保存場所: XXXX/XXXXXX.jpg
   * @property {string} uploadId アップロードID
   * @property {number} partNumber マルチパート番号
   * @param {InputObjetUploadMultipartObject} InputObjetUploadMultipartObject
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async uploadMultipartObject({
    body: body,
    key: key,
    uploadId: uploadId,
    partNumber: partNumber = 0,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * マルチパートアップロード
   * @typedef {Object} InputObjetMultipartUploadObject
   * @property {string} key 保存場所: XXXX/XXXXXX.jpg
   * @property {string} uploadId アップロードID
   * @property {Object[]} parts アップロードするパート
   * @param {InputObjetMultipartUploadObject} InputObjetMultipartUploadObject
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async multipartUploadObject({ key: key, uploadId: uploadId, parts: parts }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクト一覧
   * @typedef {Object} InputObjectListObjects
   * @property {string} prefix 指定されたプレフィックスで始まるキーへの応答を制限します。
   * @property {number} maxKeys 応答で返されるキーの最大数を設定します。
   * @property {string} startAfter この指定されたキーの後にリストを開始します。
   * @property {string} continuationToken リストがトークンを使用してこのバケットで継続されていることを Amazon S3 に示します。
   * @param {InputObjectListObjects} InputObjectListObjects
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async listObjects({
    prefix: prefix = undefined,
    maxKeys: maxKeys = 1000,
    startAfter: startAfter = undefined,
    continuationToken: continuationToken = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトのバージョン一覧
   * @typedef {Object} InputObjectListObjectVersions
   * @property {string} prefix 指定されたプレフィックスで始まるキーへの応答を制限します。
   * @property {number} maxKeys 応答で返されるキーの最大数を設定します。
   * @property {string} keyMarker バケット内のオブジェクトをリストするときに開始するキーを指定します。
   * @property {string} versionIdMarker リストを開始するオブジェクトのバージョンを指定します。
   * @param {InputObjectListObjectVersions} InputObjectListObjectVersions
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async listObjectVersions({
    prefix: prefix = undefined,
    maxKeys: maxKeys = 1000,
    keyMarker: keyMarker = undefined,
    versionIdMarker: versionIdMarker = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトの情報
   * @typedef {Object} InputObjectDetailObject
   * @property {string} key オブジェクトキー
   * @property {string} versionId オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectDetailObject} InputObjectDetailObject
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async detailObject({ key: key, versionId: versionId = undefined }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトのダウンロード
   * @typedef {Object} InputObjectDownloadObject
   * @property {string} key オブジェクトキー
   * @property {string} range オブジェクトの指定されたバイト範囲をダウンロードします。
   * @property {string} versionId オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectDownloadObject} InputObjectDownloadObject
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async downloadObject({
    key: key,
    range: range = 'bytes=0-9',
    versionId: versionId = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトの削除
   * @typedef {Object} InputObjectDeleteObject
   * @property {string} key オブジェクトキー
   * @property {string} versionId オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectDeleteObject} InputObjectDeleteObject
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async deleteObject({ key: key, versionId: versionId = undefined }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトのタグ情報
   * @typedef {Object} InputObjectInfoObjectTag
   * @property {string} key オブジェクトキー
   * @property {string} versionId オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectInfoObjectTag} InputObjectInfoObjectTag
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async objectTagDetail({ key: key, versionId: versionId = undefined }) {
    throw new Error('Not implemented');
  }

  /**
   * オブジェクトのタグ情報更新
   * @typedef {Object} InputObjectObjectTagUpdate
   * @property {string} key オブジェクトキー
   * @property {Object[]} tagSet タグ要素
   * @property {string} versionId オブジェクトの特定のバージョンを参照するために使用されるバージョン ID
   * @param {InputObjectObjectTagUpdate} InputObjectObjectTagUpdate
   * @return {Promise<Object>} s3Clientのレスポンス
   */
  async objectTagUpdate({
    key: key,
    tagSet: tagSet,
    versionId: versionId = undefined,
  }) {
    throw new Error('Not implemented');
  }

  /**
   * 共通エンティティに変換
   * @typedef {Object} InputObjectToEntity
   * @property {Object} response1 s3Clientのレスポンス
   * @property {string} type 変換タイプ(upload,multiUpload,list,listVersions,detail,delete,tagUpdate)
   * @property {string} serviceName サービス名('objectData')
   * @property {Object} response2 s3Clientのレスポンス(detailのみ必要)
   * @property {string} key オブジェクトキー(detailのみ必要)
   * @param {InputObjectToEntity} InputObjectToEntity
   * @returns {Object} Repositoryエンティティ
   */
  toEntity({
    serviceName: serviceName,
    response1: response1,
    type: type,
    response2: response2 = undefined,
    key: key = undefined,
  }) {
    switch (type) {
      case 'upload':
        return this.toEntityForUpload({ response: response1 });
      case 'multiUpload':
        return this.toEntityForMultipartUpload({ response: response1 });
      case 'list':
        return this.toEntityForList({
          response: response1,
          serviceName: serviceName,
        });
      case 'listVersions':
        return this.toEntityForListVersions({
          response: response1,
          serviceName: serviceName,
        });
      case 'detail':
        return this.toEntityForDetail({
          responseAttributes: response1,
          responseTagging: response2,
          key: key,
          serviceName: serviceName,
        });
      case 'delete':
        return this.toEntityForDelete({ response: response1 });
      case 'tagUpdate':
        return this.toEntityForTagUpdate({ response: response1 });
      default:
        return {};
    }
  }

  toEntityForUpload({ response: response }) {
    let entity = {};
    entity.versionId = response.VersionId;
    let date = new Date();
    const dateString = date.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
    entity.updatedAt = dateString;
  }

  toEntityForMultipartUpload({ response: response }) {
    let entity = {};
    entity.versionId = response.VersionId;
    let date = new Date();
    const dateString = date.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
    entity.updatedAt = dateString;
  }

  toEntityForList({ response: response, serviceName: serviceName }) {
    return response.Contents.map((content) => {
      let entity = {};
      const parsedKey = parseString({
        key: content.Key,
        serviceName: serviceName,
      });
      entity.metaKey = parsedKey.metaKey;
      entity.metaValue = parsedKey.metaValue;
      entity.mimeType = parsedKey.mimeType;
      entity.fileName = parsedKey.fileName;
      entity.versionId = content.VersionId;
      entity.userId = parsedKey.userId;
      const lastModified = new Date(content.LastModified);
      entity.updatedAt = lastModified.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
      });
      return entity;
    });
  }

  toEntityForListVersions({ response: response, serviceName: serviceName }) {
    // response.Versionsから、Keyが同じで、response.DeleteMarkersの、IsLatestがtrueのものは除く。
    const filteredVersions = response.Versions.filter((version) => {
      response.DeleteMarkers.find(
        (marker) => marker.Key === version.Key && marker.IsLatest != true
      );
    });

    return filteredVersions.map((version) => {
      let entity = {};
      const parsedKey = parseString({
        key: version.Key,
        serviceName: serviceName,
      });
      entity.metaKey = parsedKey.metaKey;
      entity.metaValue = parsedKey.metaValue;
      entity.mimeType = parsedKey.mimeType;
      entity.fileName = parsedKey.fileName;
      entity.versionId = version.VersionId;
      entity.userId = parsedKey.userId;
      const lastModified = new Date(version.LastModified);
      entity.updatedAt = lastModified.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
      });
      return entity;
    });
  }

  toEntityForDetail({
    responseAttributes: responseAttributes,
    responseTagging: responseTagging,
    key: key,
    serviceName: serviceName,
  }) {
    let entity = {};
    const parsedKey = parseString({ key: key, serviceName: serviceName });
    entity.metaKey = parsedKey.metaKey;
    entity.metaValue = parsedKey.metaValue;
    entity.mimeType = parsedKey.mimeType;
    entity.fileName = parsedKey.fileName;
    entity.userId = parsedKey.userId;
    entity.versionId = responseAttributes.VersionId;
    const tagSet = responseTagging.TagSet;
    //tagSetの中から、Keyの値がcommentのものを抽出する
    const commentTag = tagSet.find((tag) => tag.Key === 'comment');
    entity.comment = commentTag ? commentTag.Value : '';
    const lastModified = new Date(responseAttributes.LastModified);
    entity.updatedAt = lastModified.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
    return entity;
  }

  toEntityForDelete({ response: response }) {
    let entity = {};
    entity.versionId = response.VersionId;

    return entity;
  }

  toEntityForTagUpdate({ response: response }) {
    let entity = {};
    entity.versionId = response.VersionId;

    return entity;
  }
}

function parseString({ key: key, serviceName: serviceName }) {
  if (serviceName == Service_Name[0]) {
    const regex =
      /^userId=([^\/]+)\/metaKey=([^\/]+)\/metaValue=([^\/]+)\/mimeType=([^\/]+)\/(.*)$/;
    const match = key.match(regex);

    return {
      userId: match ? match[1] : '',
      metaKey: match ? match[2] : '',
      metaValue: match ? match[3] : '',
      mimeType: match ? match[4] : '',
      fileName: match ? match[5] : '',
    };
  } else {
    return {};
  }
}
