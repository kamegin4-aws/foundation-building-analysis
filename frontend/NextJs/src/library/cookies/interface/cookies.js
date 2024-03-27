/**
 * クッキーインターフェース
 */
export class ICookie {
  /**
   * クッキーの保存
   * @param {Record<string,string>} data インプット
   */
  set(data) {
    throw new Error("Not implemented");
  }

  /**
   * クッキーの取得
   * @returns {Promise<Record<string,string>|boolean>} data アウトプット
   */
  async get() {
    throw new Error("Not implemented");
  }

  /**
   * クッキーの削除
   */
  delete() {
    throw new Error("Not implemented");
  }
}
