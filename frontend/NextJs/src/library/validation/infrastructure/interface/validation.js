/**
 *バリデーション用インスタンスのインターフェース
 */
export class IValidationInstance {
  /**
   * ユーザーネームのバリデーション
   * @typedef {Object} InputObjectUserNameValidation
   * @property {string} userName ユーザーネーム
   * @param {InputObjectUserNameValidation} input インプット
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  userNameValidation({ userName: userName }) {
    throw new Error("Not implemented");
  }

  /**
   * パスワードバリデーション
   * @typedef {Object} InputObjectPasswordValidation
   * @property {string} password パスワード
   * @param {InputObjectPasswordValidation} input インプット
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  passwordValidation({ password: password }) {
    throw new Error("Not implemented");
  }

  /**
   * Eメールバリデーション
   * @typedef {Object} InputObjectEmailValidation
   * @property {string} email Eメール
   * @param {InputObjectEmailValidation} input インプット
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  emailValidation({ email: email }) {
    throw new Error("Not implemented");
  }

  /**
   * コードバリデーション
   * @typedef {Object} InputObjectCodeValidation
   * @property {string} code コード
   * @param {InputObjectCodeValidation} input インプット
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  codeValidation({ code: code }) {
    throw new Error("Not implemented");
  }

  /**
   * キーバリデーション
   * @typedef {Object} InputObjectKeyValidation
   * @property {string} key キー
   * @param {InputObjectKeyValidation} input インプット
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  keyValidation({ key: key }) {
    throw new Error("Not implemented");
  }

  /**
   * バリューバリデーション
   * @typedef {Object} InputObjectValueValidation
   * @property {string} value バリュー
   * @param {InputObjectValueValidation} input インプット
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  valueValidation({ value: value }) {
    throw new Error("Not implemented");
  }

  /**
   * MIMEタイプバリデーション
   * @typedef {Object} InputObjectFileMIMETypeValidation
   * @property {string} mimeType MIMEタイプ
   * @param {InputObjectFileMIMETypeValidation} input インプット
   * @returns {boolean|string} 成功時:true, 失敗時:エラーメッセージ
   */
  fileMIMETypeValidation({ mimeType: mimeType }) {
    throw new Error("Not implemented");
  }

  /**
   * ファイルサイズバリデーション
   * @typedef {Object} InputObjectFileSizeValidation
   * @property {number} fileSize ファイルサイズ
   * @param {InputObjectFileSizeValidation} input インプット
   * @returns {boolean|string} 成功時:true, 失敗時:エラーメッセージ
   */
  fileSizeValidation({ fileSize: fileSize }) {
    throw new Error("Not implemented");
  }

  /**
   * ファイル名バリデーション
   * @typedef {Object} InputObjectFileNameValidation
   * @property {string} fileName ファイル名
   * @param {InputObjectFileNameValidation} input インプット
   * @returns {boolean|string} 成功時:true, 失敗時:エラーメッセージ
   */
  fileNameValidation({ fileName: fileName }) {
    throw new Error("Not implemented");
  }

  /**
   * 総ファイル数バリデーション
   * @typedef {Object} InputObjectFilesNumberValidation
   * @property {number} filesNumber 総ファイル数
   * @param {InputObjectFilesNumberValidation} input インプット
   * @returns {boolean|string} 成功時:true, 失敗時:エラーメッセージ
   */
  filesNumberValidation({ filesNumber: filesNumber }) {
    throw new Error("Not implemented");
  }

  /**
   * 総ファイルサイズバリデーション
   * @typedef {Object} InputObjectFilesSizeValidation
   * @property {number} filesSize 総ファイルサイズ
   * @param {InputObjectFilesSizeValidation} input インプット
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  filesSizeValidation({ filesSize: filesSize }) {
    throw new Error("Not implemented");
  }
}
