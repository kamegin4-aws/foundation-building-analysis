/**
 * 入力バリデーションインターフェース
 */
export class IValidation {
  /**
   * バリデーションチェック
   * @param {FormData} formData フォームデータ
   * @typedef {Record<string,string>} FunctionReturn
   * @property {string} index エラーインデックス
   * @property {string} message エラーメッセージ
   * @typedef {Array<FunctionReturn>} FunctionReturnArray
   * @returns {FunctionReturnArray} 返り値
   */
  execute(formData) {
    throw new Error("Not implemented");
  }
}
