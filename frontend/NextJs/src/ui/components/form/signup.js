"use client";

import FormWrapper from "@/ui/cloudscape/form";

import ButtonWrapper from "@/ui/cloudscape/button";
import FormFieldWrapper from "@/ui/cloudscape/form_field";
import InputWrapper from "@/ui/cloudscape/input";

import { useState } from "react";

import { SignupValidation } from "@/library/validation/cognito/signup";
import { ZodWrapper } from "@/library/validation/infrastructure/zod/zod_client";
import { Signup } from "@/library/api/cognito/signup";

import TextContentWrapper from "@/ui/cloudscape/text_content";

import React from "react";

export default function SignupForm(props) {
  //Form
  const [userNameInputValue, setUserNameInputValue] = useState("");
  const [userNameErrorText, setUserNameErrorText] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [signupButtonLoading, setSignupButtonLoading] = useState(false);
  const [signupButtonLoadingText, setSignupButtonLoadingText] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setSignupButtonLoading(true);
      setSignupButtonLoadingText("サインアップ中...");

      const signupValidation = new SignupValidation(new ZodWrapper());
      const signup = new Signup();

      const formData = new FormData();
      formData.append("user_name", userNameInputValue);
      formData.append("user_email", emailInputValue);
      formData.append("password", passwordInputValue);

      const validationResult = signupValidation.execute(formData);
      setUserNameErrorText("");
      setEmailErrorText("");
      setPasswordErrorText("");
      props.parentSetAlertDisplay(false);

      if (validationResult == true) {
        console.log("signupValidation: true");
        const apiResponse = await signup.execute(formData);

        if (apiResponse.ok) {
          const apiResponseObject = await apiResponse.json();
          console.log("apiResponseObject:", apiResponseObject);
          props.parentSetAlertDisplay(true);
          props.parentSetAlertType("success");
          props.parentSetAlertHeader("確認番号を送信しました。");
          props.parentSetAlertMessage(
            "メールアドレスを確認してください（件名: Your verification code）"
          );
          props.parentSetAlertAction(
            <ButtonWrapper
              variant={"normal"}
              iconName={"treeview-expand"}
              iconAlt={"確認コードを入力"}
              name={"確認コードを入力"}
              onClick={props.parentOpenConfirmCodeModal}
            />
          );
        } else {
          props.parentSetAlertDisplay(true);
          props.parentSetAlertType("error");
          props.parentSetAlertHeader("サインアップに失敗しました。");
          props.parentSetAlertMessage(await apiResponse.json());
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
        props.parentSetAlertDisplay(true);
        props.parentSetAlertType("error");
        props.parentSetAlertHeader("エラーが発生しました。");
        props.parentSetAlertMessage(e.message);
      } else {
        props.parentSetAlertDisplay(true);
        props.parentSetAlertType("error");
        props.parentSetAlertHeader("エラーが発生しました。");
        props.parentSetAlertMessage("Client Error");
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

  return (
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
  );
}
