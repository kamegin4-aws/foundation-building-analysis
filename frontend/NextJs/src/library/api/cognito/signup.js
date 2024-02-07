export async function signup(formData) {
  try {
    const url =
      "https://up8wjt0dp5.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/signup";
    const response = fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      mode: "cors",
      /*
      headers: {
        "Content-Type": "application/json",
      },
      */
      body: formData, // 本体のデータ型は "Content-Type" ヘッダーと一致させる必要があります
    });

    return response;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("API Error");
    }
  }
}
