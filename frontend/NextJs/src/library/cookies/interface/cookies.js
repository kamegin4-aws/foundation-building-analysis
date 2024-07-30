/**
 * クッキーインターフェース
 */
export class ICookie {
  /**
   * クッキーの保存
   * @typedef {Object} InputObject
   * @property {Record<string,string>} data インプット
   * @param {InputObject} input インプット
   */
  set({ data: data }) {
    throw new Error('Not implemented');
  }

  /**
   * クッキーの取得
   * @returns {Promise<Record<string,string>>} data アウトプット
   */
  async get() {
    throw new Error('Not implemented');
  }

  /**
   * クッキーの削除
   */
  delete() {
    throw new Error('Not implemented');
  }
}
