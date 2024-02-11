import { getCognitoTokens } from "@/library/cookies/cognito/login";

export async function addUserToGroup(formData) {
  try {
    const CognitoTokens = await getCognitoTokens();
    if (!CognitoTokens) {
      throw new Error("Not Cognito Tokens");
    }

    const url = "/sam/cognito/group/user/add";
    const response = fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      mode: "cors",
      //credentials: "include",

      headers: {
        Authorization: `Bearer ${CognitoTokens.IdToken.value}`,
      },

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
