"use client";

import AlertWrapper from "@/ui/Cloudscape/alert";
import ContainerWrapper from "@/ui/Cloudscape/container";
import ContentLayoutWrapper from "@/ui/Cloudscape/content_layout";
import HeaderWrapper from "@/ui/Cloudscape/header";
import ButtonWrapper from "@/ui/Cloudscape/button";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

import BreadcrumbProvider from "@/ui/components/provider/bread_crumb";
import FlashBarProvider from "@/ui/components/provider/flash_bar";
import TopNavigationProvider from "@/ui/components/provider/top_menu";
import React from "react";
import { CognitoContext } from "@/ui/components/provider/cognito_provider";
import ContentsTable from "@/ui/components/table/contents_data";
import { S3Context } from "@/ui/components/provider/s3_provider";
import Loading from "@/app/loading";

export default function ListPage() {
  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  //ContentsTable
  const [contentsTableItems, setContentsTableItems] = useState([]);
  const [contentsTableLoading, setContentsTableLoading] = useState(false);

  //S3Context
  const { contentsClient } = useContext(S3Context);

  //CognitoContext
  const { userAttributes } = useContext(CognitoContext);

  useEffect(() => {
    if (contentsClient && userAttributes) {
      setContentsTableLoading(true);
      contentsClient
        .list({ userName: userAttributes.userName })
        .then((objects) => {
          console.log(objects);

          let items = [];
          for (let i = 0; i < objects.length; i++) {
            let fileName = objects[i].Key.split("/").slice(-1)[0];
            let mimeType = objects[i].Key.split("/").slice(-2)[0].split("=")[1];

            items.push({
              key: objects[i].Key,
              fileName: fileName,
              mimeType: mimeType,
              size: String(objects[i].Size),
              lastModified: objects[i].LastModified,
            });
          }

          setContentsTableItems(items);
        })
        .catch((error) => {
          if (error instanceof Error) {
            setAlertDisplay(true);
            setAlertType("error");
            setAlertHeader("データの取得に失敗しました。");
            setAlertMessage(error.message);
          } else {
            setAlertDisplay(true);
            setAlertType("error");
            setAlertHeader("データの取得に失敗しました。");
            setAlertMessage("CLient Error");
          }
        })
        .finally(() => {
          setContentsTableLoading(false);
        });
    }
  }, [contentsClient, userAttributes]);

  if (!contentsClient || !userAttributes) return <Loading />;

  return (
    <>
      <FlashBarProvider />
      <BreadcrumbProvider />
      <TopNavigationProvider />
      <ContentLayoutWrapper
        disableOverlap={true}
        header={
          <HeaderWrapper
            title={"Contents Data List"}
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
                  onClick={undefined}
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
          <ContainerWrapper
            variant={"embedded"}
            media={{
              content: (
                <Image src={`/s3.svg`} alt="rds" width={500} height={500} />
              ),
              position: "side",
              width: "25%",
            }}
            content={
              <ContentsTable
                items={contentsTableItems}
                loading={contentsTableLoading}
              />
            }
          />
        }
      />
    </>
  );
}
