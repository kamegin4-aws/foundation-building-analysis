/**
 * 認証(クライアントサイド)用のインターフェース
 */
export class IGlobalAuthentication {
  /**
   * セッションの確認
   * @returns {boolean} 成功時:true 失敗時:false
   */
  checkSession() {
    throw new Error("Not implemented");
  }
}
