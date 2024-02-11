import { setCognitoTokens } from "@/library/cookies/cognito/login";
import { listUserInGroup } from "@/library/api/cognito/list_user_in_group";
import { FREE_USER_GROUP } from "@/library/api/constant_group/constant_list_user_in_group";
import { addUserToGroup } from "@/library/api/cognito/add_user_to_group";

export async function userNameLogin(formData) {
  try {
    const urlLogin = "/sam/cognito/login";
    const responseLogin = fetch(urlLogin, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      mode: "cors",
      //credentials: "include",
      /*
      headers: {
        "Content-Type": "application/json",
      },
      */
      body: formData, // 本体のデータ型は "Content-Type" ヘッダーと一致させる必要があります
    });

    //ログイン
    const loginCP = (await responseLogin).clone();

    if (loginCP.ok) {
      let responseObjectLogin = await loginCP.json();
      setCognitoTokens(responseObjectLogin);

      const formDataListUser = new FormData();
      formDataListUser.append("group_name", FREE_USER_GROUP);

      //グループ内のユーザーを取得
      const user_name = formData.get("user_name");
      const responseListUser = await listUserInGroup(formDataListUser);
      if (responseListUser.ok) {
        const responseObjectListUser = await responseListUser.json();
        console.log(responseObjectListUser);
        const userMap = new Map(
          responseObjectListUser.Users.map((user, index) => [
            user.Username,
            index,
          ])
        );
        if (!userMap.has(user_name)) {
          //グループ内にユーザーがいなければ追加
          const formDataAddGroup = new FormData();
          formDataAddGroup.append("user_name", user_name);
          formDataAddGroup.append("group_name", FREE_USER_GROUP);

          //ユーザーをグループに追加
          const responseAddGroup = await addUserToGroup(formDataAddGroup);

          if (!responseAddGroup.ok) {
            throw new Error("Add User To Group Error");
          }
        }
      } else {
        throw new Error("List User In Group Error");
      }
    } else {
      throw new Error("Login Error");
    }

    return responseLogin;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("API Error");
    }
  }
}
