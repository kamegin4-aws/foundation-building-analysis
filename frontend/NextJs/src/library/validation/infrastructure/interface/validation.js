/**
 *バリデーション用インスタンスのインターフェース
 */
export class IValidationInstance {
  /**
   * ユーザーネームのバリデーション
   * @param {string} userName ユーザーネーム
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  userNameValidation(userName) {
    throw new Error("Not implemented");
  }

  /**
   * パスワードバリデーション
   * @param {string} password パスワード
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  passwordValidation(password) {
    throw new Error("Not implemented");
  }

  /**
   * Eメールバリデーション
   * @param {string} email Eメール
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  emailValidation(email) {
    throw new Error("Not implemented");
  }

  /**
   * コードバリデーション
   * @param {string} code コード
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  codeValidation(code) {
    throw new Error("Not implemented");
  }

  /**
   * キーバリデーション
   * @param {string} key キー
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  keyValidation(key) {
    throw new Error("Not implemented");
  }

  /**
   * バリューバリデーション
   * @param {string} value バリュー
   * @returns {boolean | string} 成功時:true, 失敗時:エラーメッセージ
   */
  valueValidation(value) {
    throw new Error("Not implemented");
  }
}
