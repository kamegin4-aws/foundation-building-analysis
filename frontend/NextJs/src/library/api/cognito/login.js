import { CognitoTokensCookie } from "@/library/cookies/cognito/login";
import { UserInfoCookie } from "@/library/cookies/cognito/user_info";
import { ListUserInGroup } from "@/library/api/cognito/list_user_in_group";
import { GetUserInfo } from "@/library/api/cognito/get_user_info";
import { AddUserToGroup } from "@/library/api/cognito/add_user_to_group";
import { FREE_USER_GROUP } from "@/library/api/constant/constant_list_user_in_group";
import { IApi } from "@/library/api/interface/api";

export class UserNameLogin extends IApi {
  #url = "/sam/cognito/login";
  #options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: "cors",
  };
  constructor() {
    super();
  }

  async execute(formData) {
    try {
      this.#options.body = formData;

      const response = fetch(this.#url, this.#options);

      const cognitoTokensCookie = new CognitoTokensCookie();
      const userInfoCookie = new UserInfoCookie();
      const listUserInGroup = new ListUserInGroup();
      const getUserInfo = new GetUserInfo();
      const addUserToGroup = new AddUserToGroup();

      //ログイン
      const login = (await response).clone();

      if (login.ok) {
        let responseObjectLogin = await login.json();
        console.log("responseObjectLogin", responseObjectLogin);
        cognitoTokensCookie.set(responseObjectLogin);

        //グループ内のユーザーを取得
        const formDataListUser = new FormData();
        formDataListUser.append("group_name", FREE_USER_GROUP);
        const responseListUser =
          await listUserInGroup.execute(formDataListUser);
        if (responseListUser.ok) {
          const responseObjectListUser = await responseListUser.json();
          console.log(responseObjectListUser);
          const userMap = new Map(
            responseObjectListUser.Users.map((user, index) => [
              user.Username,
              index,
            ])
          );
          const user_name = formData.get("user_name");
          if (!userMap.has(user_name)) {
            //グループ内にユーザーがいなければ追加
            const formDataAddGroup = new FormData();
            formDataAddGroup.append("user_name", user_name);
            formDataAddGroup.append("group_name", FREE_USER_GROUP);
            const responseAddGroup =
              await addUserToGroup.execute(formDataAddGroup);

            if (!responseAddGroup.ok) {
              throw new Error("Add User To Group Error");
            }
          }

          //クッキーにユーザー情報がなければ取得
          if (!(await userInfoCookie.get())) {
            const formDataGetUserInfo = new FormData();
            const cognitoTokens = await cognitoTokensCookie.get();
            formDataGetUserInfo.append(
              "access_token",
              cognitoTokens.AccessToken
            );
            const responseGetUserInfo =
              await getUserInfo.execute(formDataGetUserInfo);
            if (!responseGetUserInfo.ok) {
              throw new Error("Get User Info Error");
            }
          }
        } else {
          throw new Error("List User In Group Error");
        }
      } else {
        throw new Error("Login Error");
      }

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("API Error");
      }
    }
  }
}
