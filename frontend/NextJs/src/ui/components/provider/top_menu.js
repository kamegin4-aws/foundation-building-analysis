"use client";

import Loading from "@/app/loading";
import { CognitoLayoutContext } from "@/app/(Cognito)/layout";
import { CognitoContext } from "@/ui/components/provider/cognito_provider";
import { useContext, useEffect } from "react";
import { SignOut } from "@/library/api/cognito/sign_out";
import { useRouter } from "next/navigation";

export default function TopNavigationProvider(props) {
  //CognitoLayoutContext
  const { setMenuDropdownItems } = useContext(CognitoLayoutContext);

  //CognitoContext
  const { userAttributes } = useContext(CognitoContext);

  const router = useRouter();

  const signOutOnClick = async (event) => {
    event.preventDefault();
    try {
      const signOut = new SignOut();
      const response = await signOut.execute();

      if (response.ok) {
        router.push("/");
      } else {
        router.push("?type=error&message=サインアウトに失敗しました。");
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        router.push(`?type=error&message=${e.message}`);
      } else {
        router.push("?type=error&message=エラーが発生しました。");
      }
    }
  };

  useEffect(() => {
    const topMenu = [
      {
        type: "menu-dropdown",
        text: userAttributes.userName,
        description: "ユーザーメニュー",
        iconName: "user-profile-active",
        items: [
          {
            id: "userInfo",
            text: "ユーザー情報",
            href: "/user",
          },
        ],
      },
      {
        type: "button",
        variant: "primary-button",
        iconName: "user-profile",
        text: "サインアウト",
        ariaLabel: "サインアウト",
        onClick: signOutOnClick,
      },
    ];

    setMenuDropdownItems(topMenu);
  }, []);

  if (!userAttributes) return <Loading />;

  return <></>;
}
