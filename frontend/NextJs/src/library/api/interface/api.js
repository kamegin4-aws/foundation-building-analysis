/**
 * API実行インターフェース
 */
export class IApi {
  /**
   * API実行
   * @param {FormData} [FormData=undefined] formData フォームデータ
   * @param {Record<string,str>} [query=undefined] query クエリパラメータ
   * @returns {Promise<Response>} API実行結果
   */
  async execute(formData = undefined, query = undefined) {
    throw new Error("Not implemented");
  }
}
