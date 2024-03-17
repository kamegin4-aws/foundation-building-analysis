/**
 * クッキーインターフェース
 */
export class ICookie {
  /**
   * クッキーの保存
   * @typedef { Record<string,string>} Data
   * @param {Data} data インプット
   */
  set(data) {
    throw new Error("Not implemented");
  }

  /**
   * クッキーの取得
   * @typedef { Record<string,string>} Data
   * @returns {Data|boolean} data アウトプット
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
