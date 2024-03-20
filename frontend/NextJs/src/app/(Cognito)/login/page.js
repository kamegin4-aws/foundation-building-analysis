"use client";

import AlertWrapper from "@/ui/cloudscape/alert";
import ContainerWrapper from "@/ui/cloudscape/container";
import ContentLayoutWrapper from "@/ui/cloudscape/content_layout";
import FormWrapper from "@/ui/cloudscape/form";
import HeaderWrapper from "@/ui/cloudscape/header";
import LinkWrapper from "@/ui/cloudscape/link";
import TabsWrapper from "@/ui/cloudscape/tabs";
import ButtonWrapper from "@/ui/cloudscape/button";
import FormFieldWrapper from "@/ui/cloudscape/form_field";
import InputWrapper from "@/ui/cloudscape/input";
import Image from "next/image";
import { useEffect, useState } from "react";

import { LoginValidation } from "@/library/validation/cognito/login";
import { ZodWrapper } from "@/library/validation/infrastructure/zod/zod_client";
import { UserNameLogin } from "@/library/api/cognito/login";
import TextContentWrapper from "@/ui/cloudscape/text_content";
import BreadcrumbProvider from "@/ui/components/provider/bread_crumb";
import FlashBarProvider from "@/ui/components/provider/flash_bar";

export default function LoginPage() {
  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertHeader, setAlertHeader] = useState();
  const [alertMessage, setAlertMessage] = useState();

  //Form
  const [userNameInputValue, setUserNameInputValue] = useState("");
  const [userNameErrorText, setUserNameErrorText] = useState();
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState();
  const [loginButtonLoading, setLoginButtonLoading] = useState(false);
  const [loginButtonLoadingText, setLoginButtonLoadingText] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoginButtonLoading(true);
      setLoginButtonLoadingText("ログイン中...");

      const loginValidation = new LoginValidation(new ZodWrapper());
      const userNameLogin = new UserNameLogin();

      const formData = new FormData();
      formData.append("user_name", userNameInputValue);
      formData.append("password", passwordInputValue);

      const validationResult = loginValidation.execute(formData);
      setUserNameErrorText();
      setPasswordErrorText();
      setAlertDisplay(false);

      if (validationResult == true) {
        console.log("loginValidation: true");
        const apiResponse = await userNameLogin.execute(formData);

        if (apiResponse.ok) {
          const apiResponseObject = await apiResponse.json();
          console.log("apiResponseObject", apiResponseObject);
          setAlertDisplay(true);
          setAlertType("success");
          setAlertHeader("ログインしました。");
          //setCognitoTokens(apiResponseObject);
          //setAlertMessage(JSON.stringify(apiResponseObject));
        } else {
          setAlertDisplay(true);
          setAlertType("error");
          setAlertHeader("ログインに失敗しました。");
          setAlertMessage(await apiResponse.json());
        }
      } else {
        console.log("loginValidation: false: ", validationResult);
        const validationResultObject = validationResult;
        for (let validation of validationResultObject) {
          if (validation["index"] == "userName")
            setUserNameErrorText(validation["message"]);
          else if (validation["index"] == "password")
            setPasswordErrorText(validation["message"]);
        }

        return false;
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
      setLoginButtonLoading(false);
    }
  };

  const clearOnClick = (event) => {
    event.preventDefault();
    console.log(event.detail);
    setUserNameInputValue("");
    setPasswordInputValue("");
    setUserNameErrorText();
    setPasswordErrorText();
  };

  useEffect(() => {}, []);

  return (
    <>
      <FlashBarProvider />
      <BreadcrumbProvider />
      <ContentLayoutWrapper
        header={<HeaderWrapper title={"Login"} />}
        content={
          <ContainerWrapper
            header={
              <HeaderWrapper
                title={"Login Form"}
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
              />
            }
            footer={<LinkWrapper href={"/signup"} alt={"アカウントの作成"} />}
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
              <TabsWrapper
                tabs={[
                  {
                    label: "User Name",
                    id: "userName",
                    content: (
                      <FormWrapper
                        id={"login_form"}
                        onSubmit={onSubmit}
                        actions={
                          <>
                            <ButtonWrapper
                              variant={"normal"}
                              iconName={"refresh"}
                              iconAlt={"クリア"}
                              name={"クリア"}
                              onClick={clearOnClick}
                            />
                            <ButtonWrapper
                              formAction={"submit"}
                              iconName={"user-profile-active"}
                              iconAlt={"ログイン"}
                              name={"ログイン"}
                              loading={loginButtonLoading}
                              loadingText={loginButtonLoadingText}
                            />
                          </>
                        }
                        container={
                          <>
                            <FormFieldWrapper
                              label={"ユーザー名"}
                              description={
                                "ユーザー名を入力してください。(例)太郎"
                              }
                              formField={
                                <InputWrapper
                                  value={userNameInputValue}
                                  parentSetValue={setUserNameInputValue}
                                />
                              }
                              errorText={userNameErrorText}
                            />
                            <FormFieldWrapper
                              label={"パスワード"}
                              description={
                                <TextContentWrapper
                                  contents={
                                    <ul style={{ color: "gray" }}>
                                      <li>パスワードを入力してください。</li>
                                      <li>パスワードの最小文字数:8 文字。</li>
                                      <li>少なくとも 1 つの数字を含む。</li>
                                      <li>{`少なくとも 1 つの特殊文字を含む(^ $ * . [ ] { } ( ) ? - " ! @ # % & / \ , > < ' : ; | _ ~ \` + =)。`}</li>
                                      <li>少なくとも 1 つの大文字を含む。</li>
                                      <li>少なくとも 1 つの小文字を含む。</li>
                                    </ul>
                                  }
                                />
                              }
                              formField={
                                <InputWrapper
                                  type={"password"}
                                  value={passwordInputValue}
                                  parentSetValue={setPasswordInputValue}
                                />
                              }
                              errorText={passwordErrorText}
                            />
                          </>
                        }
                      />
                    ),
                  },
                  {
                    label: "Google",
                    id: "google",
                    content: "Google Login content area in preparation",
                  },
                  {
                    label: "X(Twitter)",
                    id: "x_twitter",
                    content: "X(Twitter) Login content area in preparation",
                  },
                  {
                    label: "Instagram",
                    id: "instagram",
                    content: "Instagram Login content area in preparation",
                  },
                ]}
              />
            }
          />
        }
      />
    </>
  );
}
