"use client";

import AlertWrapper from "@/ui/cloudscape/alert";
import ContainerWrapper from "@/ui/cloudscape/container";
import ContentLayoutWrapper from "@/ui/cloudscape/content_layout";
import FormWrapper from "@/ui/cloudscape/form";
import HeaderWrapper from "@/ui/cloudscape/header";
import LinkWrapper from "@/ui/cloudscape/link";
import SpaceBetweenWrapper from "@/ui/cloudscape/space_between";
import TabsWrapper from "@/ui/cloudscape/tabs";
import ButtonWrapper from "@/ui/cloudscape/button";
import FormFieldWrapper from "@/ui/cloudscape/form_field";
import InputWrapper from "@/ui/cloudscape/input";
import Image from "next/image";
import { useEffect, useState } from "react";

import { loginValidation } from "@/library/validation/cognito/login";
import { userNameLogin } from "@/library/api/cognito/login";

export default function LoginPage() {
  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertHeader, setAlertHeader] = useState();
  const [alertMessage, setAlertMessage] = useState();

  //Form
  const [userNameInputValue, setUserNameInputValue] = useState("");
  const [userNameInputInvalid, setUserNameInputInvalid] = useState(false);
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [passwordInputInvalid, setPasswordInputInvalid] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("user_name", userNameInputValue);
    formData.append("password", passwordInputValue);

    const validationResult = loginValidation(formData);
    let validationMessage = "";
    setUserNameInputInvalid(false);
    setPasswordInputInvalid(false);
    setAlertDisplay(false);

    if (validationResult == true) {
      console.log("loginValidation: true");
      const apiResponse = await userNameLogin(formData);

      if (apiResponse.ok) {
        const apiResponseObject = await apiResponse.json();
        console.log(apiResponseObject);
        setAlertDisplay(true);
        setAlertType("success");
        setAlertHeader("ログインしました。");
        setAlertMessage(JSON.stringify(apiResponseObject));
      } else {
        setAlertDisplay(true);
        setAlertType("error");
        setAlertHeader("ログインに失敗しました。");
        setAlertMessage(JSON.stringify(apiResponseObject));
      }
    } else {
      console.log("loginValidation: false: ", validationResult);
      const validationResultObject = JSON.parse(validationResult);
      for (const validation of validationResultObject) {
        if (validation["index"] == "userName") setUserNameInputInvalid(true);
        else if (validation["index"] == "password")
          setPasswordInputInvalid(true);

        validationMessage += validation["message"] + "\n";
      }

      setAlertDisplay(true);
      setAlertType("error");
      setAlertHeader("入力が間違えています。");
      setAlertMessage(validationMessage);

      return false;
    }
  };

  const clearOnClick = (event) => {
    event.preventDefault();
    console.log(event.detail);
    setUserNameInputValue("");
    setPasswordInputValue("");
  };

  /*
  useEffect(() => {
  }, []);
  */
  return (
    <>
      <ContentLayoutWrapper
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
                          <SpaceBetweenWrapper
                            size={"m"}
                            direction={"horizontal"}
                            contents={
                              <>
                                <ButtonWrapper
                                  variant={"normal"}
                                  name={"クリア"}
                                  onClick={clearOnClick}
                                />
                                <ButtonWrapper
                                  formAction={"submit"}
                                  name={"ログイン"}
                                />
                              </>
                            }
                          />
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
                                  invalid={userNameInputInvalid}
                                  parentSetValue={setUserNameInputValue}
                                />
                              }
                            />
                            <FormFieldWrapper
                              label={"パスワード"}
                              description={`
                                パスワードを入力してください。\n
                                パスワードの最小文字数:8 文字。\n
                                少なくとも 1 つの数字を含む。\n
                                少なくとも 1 つの特殊文字を含む(^ $ * . [ ] { } ( ) ? - " ! @ # % & / \ , > < ' : ; | _ ~ \` + =)。\n
                                少なくとも 1 つの大文字を含む。\n
                                少なくとも 1 つの小文字を含む。\n
                                `}
                              formField={
                                <InputWrapper
                                  type={"password"}
                                  value={passwordInputValue}
                                  invalid={passwordInputInvalid}
                                  parentSetValue={setPasswordInputValue}
                                />
                              }
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
