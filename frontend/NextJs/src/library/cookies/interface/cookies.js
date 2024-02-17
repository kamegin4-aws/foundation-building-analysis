/**
 * クッキーインターフェース
 */
export class CookieInterface {
  /**
   * クッキーの保存
   * @typedef { {[key:string]:string} } Data
   * @param {Data} data インプット
   */
  set(data) {
    throw new Error("Not implemented");
  }

  /**
   * クッキーの取得
   * @typedef { {[key:string]:string} } Data
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
