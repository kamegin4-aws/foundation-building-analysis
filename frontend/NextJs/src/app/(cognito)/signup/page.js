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

import { signupValidation } from "@/library/validation/cognito/signup";
import { signup } from "@/library/api/cognito/signup";
import ModalWrapper from "@/ui/cloudscape/modal";
import { confirmSignupValidation } from "@/library/validation/cognito/confirm_signup";
import { confirmSignup } from "@/library/api/cognito/confirm_signup";
import { CognitoLayoutContext } from "@/app/(cognito)/layout";

export default function SignupPage() {
  const router = useRouter();

  //CognitoLayoutContext
  const { breadcrumbItems, setBreadcrumbItems } =
    useContext(CognitoLayoutContext);

  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertHeader, setAlertHeader] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const [alertAction, setAlertAction] = useState();

  //Form
  const [userNameInputValue, setUserNameInputValue] = useState("");
  const [userNameInputInvalid, setUserNameInputInvalid] = useState(false);
  const [emailInputValue, setEmailInputValue] = useState("");
  const [emailInputInvalid, setEmailInputInvalid] = useState(false);
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [passwordInputInvalid, setPasswordInputInvalid] = useState(false);
  const [signupButtonLoading, setSignupButtonLoading] = useState(false);
  const [signupButtonLoadingText, setSignupButtonLoadingText] = useState("");

  //Modal
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmCodeInputValue, setConfirmCodeInputValue] = useState("");
  const [confirmCodeInputInvalid, setConfirmCodeInputInvalid] = useState(false);
  const [confirmCodeButtonLoading, setConfirmCodeButtonLoading] =
    useState(false);
  const [confirmCodeButtonLoadingText, setConfirmCodeButtonLoadingText] =
    useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setSignupButtonLoading(true);
      setSignupButtonLoadingText("サインアップ中...");

      const formData = new FormData();
      formData.append("user_name", userNameInputValue);
      formData.append("user_email", emailInputValue);
      formData.append("password", passwordInputValue);

      const validationResult = signupValidation(formData);
      let validationMessage = "";
      setUserNameInputInvalid(false);
      setEmailInputInvalid(false);
      setPasswordInputInvalid(false);
      setAlertDisplay(false);

      if (validationResult == true) {
        console.log("signupValidation: true");
        const apiResponse = await signup(formData);

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
        const validationResultObject = JSON.parse(validationResult);
        for (const validation of validationResultObject) {
          if (validation["index"] == "userName") setUserNameInputInvalid(true);
          else if (validation["index"] == "password")
            setPasswordInputInvalid(true);
          else if (validation["index"] == "email") setEmailInputValue(true);

          validationMessage += validation["message"] + "\n";
        }

        setAlertDisplay(true);
        setAlertType("error");
        setAlertHeader("入力が間違えています。");
        setAlertMessage(validationMessage);

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
  };

  const confirmCodeSubmitOnClick = async (event) => {
    event.preventDefault();
    console.log(event.detail);
    try {
      setConfirmCodeButtonLoading(true);
      setConfirmCodeButtonLoadingText("確認中...");

      const formData = new FormData();
      formData.append("user_name", userNameInputValue);
      formData.append("code", confirmCodeInputValue);

      const validationResult = confirmSignupValidation(formData);
      let validationMessage = "";
      setUserNameInputInvalid(false);
      setEmailInputInvalid(false);
      setPasswordInputInvalid(false);
      setConfirmCodeInputInvalid(false);
      setAlertDisplay(false);

      if (validationResult == true) {
        console.log("confirmSignupValidation: true");
        const apiResponse = await confirmSignup(formData);

        if (apiResponse.ok) {
          const apiResponseObject = await apiResponse.json();
          console.log("apiResponseObject:", apiResponseObject);
          setAlertDisplay(true);
          setAlertType("success");
          setAlertHeader("確認完了。");
          setAlertMessage("メールアドレス確認を完了しました。");

          router.push("/login");
        } else {
          setAlertDisplay(true);
          setAlertType("error");
          setAlertHeader("確認に失敗しました。");
          setAlertMessage(await apiResponse.json());
        }
      } else {
        console.log("confirmSignupValidation: false: ", validationResult);
        const validationResultObject = JSON.parse(validationResult);
        for (const validation of validationResultObject) {
          if (validation["index"] == "userName") setUserNameInputInvalid(true);
          else if (validation["index"] == "code")
            setConfirmCodeInputInvalid(true);

          validationMessage += validation["message"] + "\n";
        }

        setAlertDisplay(true);
        setAlertType("error");
        setAlertHeader("入力が間違えています。");
        setAlertMessage(validationMessage);

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

  useEffect(() => {
    setBreadcrumbItems([
      { text: "Home", href: "#" },
      { text: "Signup", href: "/signup" },
    ]);
  }, []);

  return (
    <>
      <ContentLayoutWrapper
        content={
          <>
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
                <FormWrapper
                  id={"login_form"}
                  onSubmit={onSubmit}
                  actions={
                    <>
                      <ButtonWrapper
                        variant={"normal"}
                        name={"クリア"}
                        onClick={clearOnClick}
                      />
                      <ButtonWrapper
                        formAction={"submit"}
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
                            invalid={userNameInputInvalid}
                            parentSetValue={setUserNameInputValue}
                          />
                        }
                      />
                      <FormFieldWrapper
                        label={"メールアドレス"}
                        description={`
                                メースアドレスを入力してください。(例)example@example.com。\n
                                サインアップに必要な確認番号が送られてきます。
                              `}
                        formField={
                          <InputWrapper
                            value={emailInputValue}
                            invalid={emailInputInvalid}
                            parentSetValue={setEmailInputValue}
                            type={"email"}
                            inputMode={"email"}
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
              }
            />
            <ModalWrapper
              header={"確認コード"}
              visible={confirmModalVisible}
              parentSetVisible={setConfirmModalVisible}
              content={
                <FormFieldWrapper
                  label={"確認コード"}
                  description={`
                                メースアドレスに記載の confirmation code を入力してください。
                              `}
                  formField={
                    <InputWrapper
                      value={confirmCodeInputValue}
                      invalid={confirmCodeInputInvalid}
                      parentSetValue={setConfirmCodeInputValue}
                      inputMode={"numeric"}
                    />
                  }
                />
              }
              footer={
                <>
                  <ButtonWrapper
                    variant={"normal"}
                    name={"キャンセル"}
                    onClick={confirmCodeCancelOnClick}
                  />
                  <ButtonWrapper
                    onClick={confirmCodeSubmitOnClick}
                    name={"送信"}
                    loading={confirmCodeButtonLoading}
                    loadingText={confirmCodeButtonLoadingText}
                  />
                </>
              }
            />
          </>
        }
      />
    </>
  );
}
