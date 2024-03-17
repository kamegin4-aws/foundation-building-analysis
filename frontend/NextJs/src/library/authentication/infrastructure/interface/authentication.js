/**
 * 認証インスタンス(クライアントサイド)用のインターフェース
 */
export class IAuthenticationInstance {
  /**
   * セッションの確認
   * @typedef {Record<string,string>} FunctionReturn
   * @property {string} idToken IDトークン
   * @property {string} accessToken アクセストークン
   * @property {string} refreshToken リフレッシュトークン
   * @returns {FunctionReturn | boolean} 成功時:FunctionReturn 失敗時:false
   */
  getSession() {
    throw new Error("Not implemented");
  }

  /**
   * セッションリフレッシュ
   * @typedef {Record<string,string>} FunctionReturn
   * @property {string} idToken IDトークン
   * @property {string} accessToken アクセストークン
   * @property {string} refreshToken リフレッシュトークン
   * @returns {FunctionReturn | boolean} 成功時:FunctionReturn 失敗時:false
   */
  refreshSession() {
    throw new Error("Not implemented");
  }

  /**
   * ユーザー情報の取得
   * @typedef {Record<string,string>} FunctionReturn
   * @returns {FunctionReturn | boolean} 成功時:FunctionReturn 失敗時:false
   */
  getUserAttributes() {
    throw new Error("Not implemented");
  }
}
