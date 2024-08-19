/**
 * API実行インターフェース
 */
export class IApi {
  /**
   * API実行
   * @typedef {Object} InputObject
   * @property {Record<string,string>} [formData=undefined] フォームデータ
   * @property {Record<string,string>} [query=undefined] クエリ
   * @param {InputObject} input API実行インプット
   * @returns {Promise<Response>} API実行結果
   */
  async execute({
    formData: formData = undefined,
    query: query = undefined,
  } = {}) {
    throw new Error('Not implemented');
  }
}
