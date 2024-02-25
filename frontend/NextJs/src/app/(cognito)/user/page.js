"use client";

import AlertWrapper from "@/ui/cloudscape/alert";
import ContentLayoutWrapper from "@/ui/cloudscape/content_layout";
import HeaderWrapper from "@/ui/cloudscape/header";
import ButtonWrapper from "@/ui/cloudscape/button";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";

import { CognitoLayoutContext } from "@/app/(cognito)/layout";
import BoxWrapper from "@/ui/cloudscape/box";
import SpaceBetweenWrapper from "@/ui/cloudscape/space_between";
import IconWrapper from "@/ui/cloudscape/icon";
import ColumnLayoutWrapper from "@/ui/cloudscape/column_layout";
import ContainerWrapper from "@/ui/cloudscape/container";
import Image from "next/image";

import { UserInfoCookie } from "@/library/cookies/cognito/user_info";
import { SignOut } from "@/library/api/cognito/sign_out";

export default function UserInfoPage() {
  const router = useRouter();

  //CognitoLayoutContext
  const { setBreadcrumbItems, setMenuDropdownItems } =
    useContext(CognitoLayoutContext);

  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertHeader, setAlertHeader] = useState();
  const [alertMessage, setAlertMessage] = useState();

  //Contents
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const deleteOnClick = (event) => {
    event.preventDefault();
  };

  const signOutOnClick = async (event) => {
    event.preventDefault();
    try {
      setSignOutButtonLoading(true);
      setSignOutButtonLoadingText("サインアウト中...");

      const signOut = new SignOut();
      const response = await signOut.execute();

      if (response.ok) {
        router.push("/");
      } else {
        setAlertDisplay(true);
        setAlertType("error");
        setAlertHeader("ログアウトに失敗しました。");
        setAlertMessage(await response.json());
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        setAlertDisplay(true);
        setAlertType("error");
        setAlertHeader("エラーが発生しました。");
        setAlertMessage(e.message);
      } else {
        setAlertDisplay(true);
        setAlertType("error");
        setAlertHeader("エラーが発生しました。");
        setAlertMessage("Client Error");
      }
    } finally {
      setSignOutButtonLoading(false);
    }
  };

  useEffect(() => {
    setBreadcrumbItems([
      { text: "Home", href: "/" },
      { text: "UserInfo", href: "/user" },
    ]);

    const userInfoCookie = new UserInfoCookie();
    userInfoCookie
      .get()
      .then((userInfo) => {
        console.log("userInfo", userInfo);
        setUserName(userInfo.userName);
        setEmail(userInfo.email);

        const topMenu = [
          {
            type: "menu-dropdown",
            text: userInfo.userName,
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
      })
      .catch((e) => {
        if (e instanceof Error) {
          console.log(e.message);
          setAlertDisplay(true);
          setAlertType("error");
          setAlertHeader("エラーが発生しました。");
          setAlertMessage(e.message);
        } else {
          setAlertDisplay(true);
          setAlertType("error");
          setAlertHeader("エラーが発生しました。");
          setAlertMessage("Client Error");
        }
      });
  }, []);

  return (
    <>
      <ContentLayoutWrapper
        disableOverlap={true}
        header={
          <HeaderWrapper
            title={"User Info"}
            alert={
              alertDisplay ? (
                <AlertWrapper
                  type={alertType}
                  header={alertHeader}
                  message={alertMessage}
                  parentAlertDisplay={setAlertDisplay}
                />
              ) : undefined
            }
            actions={
              <>
                <ButtonWrapper
                  variant={"normal"}
                  iconName={"remove"}
                  iconAlt={"削除"}
                  name={"削除"}
                  onClick={deleteOnClick}
                />
                <ButtonWrapper
                  variant={"link"}
                  iconName={"edit"}
                  iconAlt={"編集"}
                  name={"編集"}
                  href={"#"}
                />
              </>
            }
          />
        }
        content={
          <>
            <ContainerWrapper
              variant={"embedded"}
              media={{
                content: (
                  <Image
                    src="/cognito.svg"
                    alt="cognito"
                    width={500}
                    height={500}
                  />
                ),
                position: "side",
                width: "25%",
              }}
              content={
                <ColumnLayoutWrapper
                  columnNumber={2}
                  borders={"vertical"}
                  content={
                    <>
                      <BoxWrapper
                        variant={"div"}
                        content={
                          <SpaceBetweenWrapper
                            size={"xs"}
                            direction={"horizontal"}
                            contents={
                              <>
                                ユーザー名
                                <IconWrapper name={"user-profile"} />
                              </>
                            }
                          />
                        }
                      />
                      <BoxWrapper variant={"div"} content={userName} />
                      <BoxWrapper
                        variant={"div"}
                        content={
                          <SpaceBetweenWrapper
                            size={"xs"}
                            direction={"horizontal"}
                            contents={
                              <>
                                Eメール
                                <IconWrapper name={"envelope"} />
                              </>
                            }
                          />
                        }
                      />
                      <BoxWrapper variant={"div"} content={email} />
                    </>
                  }
                />
              }
            />
          </>
        }
      />
    </>
  );
}
