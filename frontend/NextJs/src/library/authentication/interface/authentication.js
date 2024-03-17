/**
 * 認証(クライアントサイド)用のインターフェース
 */
export class IGlobalAuthentication {
  /**
   * セッションの確認
   * @typedef {Record<string,string>} FunctionReturn
   * @property {string} idToken IDトークン
   * @property {string} accessToken アクセストークン
   * @property {string} refreshToken リフレッシュトークン
   * @returns {FunctionReturn | boolean} 成功時:FunctionReturn 失敗時:false
   */
  checkSession() {
    throw new Error("Not implemented");
  }

  /**
   * ユーザーの取得
   * @typedef {Record<string,string>} FunctionReturn
   * @returns {FunctionReturn | boolean} 成功時:FunctionReturn 失敗時:false
   */
  getUser() {
    throw new Error("Not implemented");
  }
}
