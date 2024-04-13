/**
 * 入力バリデーションインターフェース
 */
export class IValidation {
  /**
   * バリデーションチェック
   * @typedef {Object} InputObjectExecute
   * @property {Record<string,string>} formData フォームオブジェクト
   * @param {InputObjectExecute} input インプット
   * @typedef {Object} FunctionReturnExecute
   * @property {string} index エラーインデックス
   * @property {string} message エラーメッセージ
   * @returns {FunctionReturnExecute[] | boolean} 返り値
   */
  execute({ formData: formData }) {
    throw new Error("Not implemented");
  }
}
