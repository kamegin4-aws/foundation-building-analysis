"use client";

import AlertWrapper from "@/ui/cloudscape/alert";
import ContainerWrapper from "@/ui/cloudscape/container";
import ContentLayoutWrapper from "@/ui/cloudscape/content_layout";
import FormWrapper from "@/ui/cloudscape/form";
import HeaderWrapper from "@/ui/cloudscape/header";
import ButtonWrapper from "@/ui/cloudscape/button";
import FormFieldWrapper from "@/ui/cloudscape/form_field";
import InputWrapper from "@/ui/cloudscape/input";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ZodWrapper } from "@/library/validation/infrastructure/zod/zod_client";
import BreadcrumbProvider from "@/ui/components/provider/bread_crumb";
import FlashBarProvider from "@/ui/components/provider/flash_bar";
import { RelationalDataCreateValidation } from "@/library/validation/elasticache_rds/create";
import { RelationalDataCreate } from "@/library/api/elasticache_rds/create";
import TopNavigationProvider from "@/ui/components/provider/top_menu";
import React from "react";

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

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setCreateButtonLoading(true);
      setCreateButtonLoadingText("保存中...");

      const createValidation = new RelationalDataCreateValidation(
        new ZodWrapper()
      );
      const relationalDataCreate = new RelationalDataCreate();

      const formData = new FormData();
      formData.append("key", keyInputValue);
      formData.append("value", valueInputValue);

      const createValidationResult = createValidation.execute(formData);
      setKeyErrorText("");
      setValueErrorText("");
      setAlertDisplay(false);

      if (createValidationResult == true) {
        console.log("Validation: true");
        const apiResponse = await relationalDataCreate.execute(formData);

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
