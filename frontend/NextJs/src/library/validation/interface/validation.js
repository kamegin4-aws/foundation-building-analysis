/**
 * 入力バリデーションインターフェース
 */
export class ValidationInterface {
  /**
   * バリデーションチェック
   * @param {FormData} formData フォームデータ
   * @typedef {Object} FunctionReturn
   * @property {string} index エラーインデックス
   * @property {string} message エラーメッセージ
   * @typedef {Array<FunctionReturn>} FunctionReturnArray
   * @returns {FunctionReturnArray} 返り値
   */
  execute(formData) {
    throw new Error("Not implemented");
  }
}
