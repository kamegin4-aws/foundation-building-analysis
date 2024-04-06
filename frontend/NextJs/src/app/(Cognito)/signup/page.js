"use client";

import AlertWrapper from "@/ui/cloudscape/alert";
import ContainerWrapper from "@/ui/cloudscape/container";
import ContentLayoutWrapper from "@/ui/cloudscape/content_layout";
import FormWrapper from "@/ui/cloudscape/form";
import HeaderWrapper from "@/ui/cloudscape/header";
import LinkWrapper from "@/ui/cloudscape/link";
import ButtonWrapper from "@/ui/cloudscape/button";
import FormFieldWrapper from "@/ui/cloudscape/form_field";
import InputWrapper from "@/ui/cloudscape/input";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";

import { SignupValidation } from "@/library/validation/cognito/signup";
import { ZodWrapper } from "@/library/validation/infrastructure/zod/zod_client";
import { Signup } from "@/library/api/cognito/signup";
import ModalWrapper from "@/ui/cloudscape/modal";
import { ConfirmSignupValidation } from "@/library/validation/cognito/confirm_signup";
import { ConfirmSignup } from "@/library/api/cognito/confirm_signup";
import TextContentWrapper from "@/ui/cloudscape/text_content";
import BreadcrumbProvider from "@/ui/components/provider/bread_crumb";
import FlashBarProvider from "@/ui/components/provider/flash_bar";
import React from "react";

export default function SignupPage() {
  const router = useRouter();

  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState(<></>);

  //Form
  const [userNameInputValue, setUserNameInputValue] = useState("");
  const [userNameErrorText, setUserNameErrorText] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [signupButtonLoading, setSignupButtonLoading] = useState(false);
  const [signupButtonLoadingText, setSignupButtonLoadingText] = useState("");

  //Modal
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmCodeInputValue, setConfirmCodeInputValue] = useState("");
  const [confirmCodeErrorText, setConfirmCodeErrorText] = useState("");
  const [confirmCodeButtonLoading, setConfirmCodeButtonLoading] =
    useState(false);
  const [confirmCodeButtonLoadingText, setConfirmCodeButtonLoadingText] =
    useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setSignupButtonLoading(true);
      setSignupButtonLoadingText("サインアップ中...");

      const signupValidation = new SignupValidation({
        validationInstance: new ZodWrapper(),
      });
      const signup = new Signup();

      const formData = new FormData();
      formData.append("user_name", userNameInputValue);
      formData.append("user_email", emailInputValue);
      formData.append("password", passwordInputValue);

      const validationResult = signupValidation.execute({ formData: formData });
      setUserNameErrorText("");
      setEmailErrorText("");
      setPasswordErrorText("");
      setAlertDisplay(false);

      if (validationResult == true) {
        console.log("signupValidation: true");
        const apiResponse = await signup.execute({ formData: formData });

        if (apiResponse.ok) {
          const apiResponseObject = await apiResponse.json();
          console.log("apiResponseObject:", apiResponseObject);
          setAlertDisplay(true);
          setAlertType("success");
          setAlertHeader("確認番号を送信しました。");
          setAlertMessage(
            "メールアドレスを確認してください（件名: Your verification code）"
          );
          setAlertAction(
            <ButtonWrapper
              variant={"normal"}
              iconName={"treeview-expand"}
              iconAlt={"確認コードを入力"}
              name={"確認コードを入力"}
              onClick={openConfirmCodeModal}
            />
          );
        } else {
          setAlertDisplay(true);
          setAlertType("error");
          setAlertHeader("サインアップに失敗しました。");
          setAlertMessage(await apiResponse.json());
        }
      } else {
        console.log("signupValidation: false: ", validationResult);
        const validationResultObject = validationResult;
        for (const validation of validationResultObject) {
          if (validation["index"] == "userName")
            setUserNameErrorText(validation["message"]);
          else if (validation["index"] == "password")
            setEmailErrorText(validation["message"]);
          else if (validation["index"] == "email")
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
      setSignupButtonLoading(false);
    }
  };

  const clearOnClick = (event) => {
    event.preventDefault();

    console.log(event.detail);
    setUserNameInputValue("");
    setPasswordInputValue("");
    setEmailInputValue("");
    setUserNameErrorText("");
    setEmailErrorText("");
    setPasswordErrorText("");
  };

  const openConfirmCodeModal = (event) => {
    event.preventDefault();
    console.log(event.detail);
    setConfirmModalVisible(true);
  };

  const confirmCodeCancelOnClick = (event) => {
    event.preventDefault();
    console.log(event.detail);
    setConfirmModalVisible(false);
    setUserNameErrorText("");
    setConfirmCodeErrorText("");
  };

  const confirmCodeSubmitOnClick = async (event) => {
    event.preventDefault();
    console.log(event.detail);
    try {
      setConfirmCodeButtonLoading(true);
      setConfirmCodeButtonLoadingText("確認中...");

      const confirmSignupValidation = new ConfirmSignupValidation({
        validationInstance: new ZodWrapper(),
      });
      const confirmSignup = new ConfirmSignup();

      const formData = new FormData();
      formData.append("user_name", userNameInputValue);
      formData.append("code", confirmCodeInputValue);

      const validationResult = confirmSignupValidation.execute({
        formData: formData,
      });
      setUserNameErrorText("");
      setConfirmCodeErrorText("");
      setAlertDisplay(false);

      if (validationResult == true) {
        console.log("confirmSignupValidation: true");
        const apiResponse = await confirmSignup.execute({ formData: formData });

        if (apiResponse.ok) {
          const apiResponseObject = await apiResponse.json();
          console.log("apiResponseObject:", apiResponseObject);
          setAlertDisplay(true);
          setAlertType("success");
          setAlertHeader("確認完了。");
          setAlertMessage("メールアドレス確認を完了しました。");

          router.push("/login?type=success&message=ユーザーを作成しました。");
        } else {
          setAlertDisplay(true);
          setAlertType("error");
          setAlertHeader("確認に失敗しました。");
          setAlertMessage(await apiResponse.json());
        }
      } else {
        console.log("confirmSignupValidation: false: ", validationResult);
        const validationResultObject = validationResult;
        for (const validation of validationResultObject) {
          if (validation["index"] == "userName")
            setUserNameErrorText(validation["message"]);
          else if (validation["index"] == "code")
            setConfirmCodeErrorText(validation["message"]);
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
      setConfirmCodeButtonLoading(false);
      setConfirmModalVisible(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <FlashBarProvider />
      <BreadcrumbProvider />
      <ContentLayoutWrapper
        header={<HeaderWrapper title={"Signup"} />}
        content={
          <ContainerWrapper
            header={
              <HeaderWrapper
                title={"SignUp Form"}
                alert={
                  alertDisplay ? (
                    <AlertWrapper
                      type={alertType}
                      header={alertHeader}
                      message={alertMessage}
                      parentAlertDisplay={setAlertDisplay}
                      action={alertAction}
                    />
                  ) : undefined
                }
              />
            }
            footer={<LinkWrapper href={"/login"} alt={"ログインに戻る"} />}
            media={{
              content: (
                <Image
                  src={`/cognito.svg`}
                  alt="cognito"
                  width={500}
                  height={500}
                />
              ),
              position: "side",
              width: "25%",
            }}
            content={
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
                      iconName={"user-profile"}
                      iconAlt={"サインアップ"}
                      name={"サインアップ"}
                      loading={signupButtonLoading}
                      loadingText={signupButtonLoadingText}
                    />
                  </>
                }
                container={
                  <>
                    <FormFieldWrapper
                      label={"ユーザー名"}
                      description={"ユーザー名を入力してください。(例)太郎"}
                      formField={
                        <InputWrapper
                          value={userNameInputValue}
                          parentSetValue={setUserNameInputValue}
                        />
                      }
                      errorText={userNameErrorText}
                    />
                    <FormFieldWrapper
                      label={"メールアドレス"}
                      description={
                        <TextContentWrapper
                          contents={
                            <p style={{ color: "gray" }}>
                              メースアドレスを入力してください。(例)example@example.com。
                              <br />
                              サインアップに必要な確認番号が送られてきます。
                            </p>
                          }
                        />
                      }
                      formField={
                        <InputWrapper
                          value={emailInputValue}
                          parentSetValue={setEmailInputValue}
                          type={"email"}
                          inputMode={"email"}
                        />
                      }
                      errorText={emailErrorText}
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
            }
          />
        }
      />
      <ModalWrapper
        header={"確認コード"}
        visible={confirmModalVisible}
        parentSetVisible={setConfirmModalVisible}
        content={
          <FormFieldWrapper
            label={"確認コード"}
            description={`メースアドレスに記載の confirmation code を入力してください。`}
            formField={
              <InputWrapper
                value={confirmCodeInputValue}
                parentSetValue={setConfirmCodeInputValue}
                inputMode={"numeric"}
              />
            }
            errorText={confirmCodeErrorText}
          />
        }
        footer={
          <>
            <ButtonWrapper
              variant={"normal"}
              iconName={"redo"}
              iconAlt={"キャンセル"}
              name={"キャンセル"}
              onClick={confirmCodeCancelOnClick}
            />
            <ButtonWrapper
              onClick={confirmCodeSubmitOnClick}
              iconName={"upload-download"}
              iconAlt={"送信"}
              name={"送信"}
              loading={confirmCodeButtonLoading}
              loadingText={confirmCodeButtonLoadingText}
            />
          </>
        }
      />
    </>
  );
}
