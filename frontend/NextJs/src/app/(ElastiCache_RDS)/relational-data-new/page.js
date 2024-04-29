"use client";

import AlertWrapper from "@/ui/Cloudscape/alert";
import ContainerWrapper from "@/ui/Cloudscape/container";
import ContentLayoutWrapper from "@/ui/Cloudscape/content_layout";
import FormWrapper from "@/ui/Cloudscape/form";
import HeaderWrapper from "@/ui/Cloudscape/header";
import ButtonWrapper from "@/ui/Cloudscape/button";
import FormFieldWrapper from "@/ui/Cloudscape/form_field";
import InputWrapper from "@/ui/Cloudscape/input";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

import { ZodWrapper } from "@/library/validation/infrastructure/zod/zod_client";
import BreadcrumbProvider from "@/ui/components/provider/bread_crumb";
import FlashBarProvider from "@/ui/components/provider/flash_bar";
import { RelationalDataCreateValidation } from "@/library/validation/elasticache_rds/create";
import TopNavigationProvider from "@/ui/components/provider/top_menu";
import React from "react";
import { CognitoContext } from "@/ui/components/provider/cognito_provider";
import Loading from "@/app/loading";
import { RelationalDataUpdate } from "@/library/api/elasticache_rds/update";

export default function NewPage() {
  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  //Form
  const [keyInputValue, setKeyInputValue] = useState("");
  const [keyErrorText, setKeyErrorText] = useState("");
  const [valueInputValue, setValueInputValue] = useState("");
  const [valueErrorText, setValueErrorText] = useState("");
  const [createButtonLoading, setCreateButtonLoading] = useState(false);
  const [createButtonLoadingText, setCreateButtonLoadingText] = useState("");

  //CognitoContext
  const { userAttributes } = useContext(CognitoContext);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setCreateButtonLoading(true);
      setCreateButtonLoadingText("保存中...");

      const createValidation = new RelationalDataCreateValidation({
        validationInstance: new ZodWrapper(),
      });
      const relationalDataUpdate = new RelationalDataUpdate({
        userName: userAttributes.userName,
      });

      const formObject = {
        user_name: userAttributes.userName,
        elasticache: [
          {
            key: keyInputValue,
            value: valueInputValue,
          },
        ],
      };

      const createValidationResult = createValidation.execute({
        formData: formObject,
      });
      setKeyErrorText("");
      setValueErrorText("");
      setAlertDisplay(false);

      if (createValidationResult == true) {
        console.log("Validation: true");
        const apiResponse = await relationalDataUpdate.execute({
          formData: formObject,
        });

        if (apiResponse.ok) {
          const apiResponseObject = await apiResponse.json();
          console.log("apiResponseObject", apiResponseObject);
          setAlertDisplay(true);
          setAlertType("success");
          setAlertHeader("作成しました。");
          setAlertMessage("");
          //setCognitoTokens(apiResponseObject);
          //setAlertMessage(JSON.stringify(apiResponseObject));
        } else {
          setAlertDisplay(true);
          setAlertType("error");
          setAlertHeader("作成に失敗しました。");
          setAlertMessage(await apiResponse.json());
        }
      } else {
        console.log("Validation: false: ", createValidationResult);
        const validationResultObject = createValidationResult;
        for (let validation of validationResultObject) {
          if (validation["index"] == "key")
            setKeyErrorText(validation["message"]);
          else if (validation["index"] == "value")
            setValueErrorText(validation["message"]);
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
      setCreateButtonLoading(false);
    }
  };

  const clearOnClick = (event) => {
    event.preventDefault();
    console.log(event.detail);
    setKeyInputValue("");
    setValueInputValue("");
    setKeyErrorText("");
    setValueErrorText("");
  };

  useEffect(() => {}, []);

  if (!userAttributes) return <Loading />;

  return (
    <>
      <FlashBarProvider />
      <BreadcrumbProvider />
      <TopNavigationProvider />
      <ContentLayoutWrapper
        header={<HeaderWrapper title={"Relational Data New"} />}
        content={
          <ContainerWrapper
            header={
              <HeaderWrapper
                title={"Relational Data Form"}
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
            media={{
              content: (
                <Image src={`/rds.svg`} alt="rds" width={500} height={500} />
              ),
              position: "side",
              width: "25%",
            }}
            content={
              <FormWrapper
                id={"relation_data_form"}
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
                      iconName={"add-plus"}
                      iconAlt={"作成"}
                      name={"作成"}
                      loading={createButtonLoading}
                      loadingText={createButtonLoadingText}
                    />
                  </>
                }
                container={
                  <>
                    <FormFieldWrapper
                      label={"キー"}
                      description={
                        "識別用のキーを入力してください。(例）食べ物"
                      }
                      formField={
                        <InputWrapper
                          value={keyInputValue}
                          parentSetValue={setKeyInputValue}
                        />
                      }
                      errorText={keyErrorText}
                    />
                    <FormFieldWrapper
                      label={"バリュー"}
                      description={
                        "保存する値を入力してください。※個人情報は入力しないでください。（例）カレー"
                      }
                      formField={
                        <InputWrapper
                          value={valueInputValue}
                          parentSetValue={setValueInputValue}
                        />
                      }
                      errorText={valueErrorText}
                    />
                  </>
                }
              />
            }
          />
        }
      />
    </>
  );
}
