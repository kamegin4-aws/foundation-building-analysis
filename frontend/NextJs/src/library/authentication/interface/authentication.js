/**
 * 認証(クライアントサイド)用のインターフェース
 */
export class IGlobalAuthentication {
  /**
   * セッションの確認
   * @returns {Promise<boolean>} 成功時:true 失敗時:false
   */
  async checkSession() {
    throw new Error('Not implemented');
  }
}
