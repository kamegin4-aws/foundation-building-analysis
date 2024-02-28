/**
 * API実行インターフェース
 */
export class IApi {
  /**
   * API実行
   * @param {FormData} [FormData=undefined] formData フォームデータ
   * @returns {Promise<Response>} API実行結果
   */
  async execute(formData = undefined) {
    throw new Error("Not implemented");
  }
}
