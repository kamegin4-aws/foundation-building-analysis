"use client";
/*
import AlertWrapper from "@/ui/cloudscape/alert";
import ContainerWrapper from "@/ui/cloudscape/container";
import ContentLayoutWrapper from "@/ui/cloudscape/content_layout";
import HeaderWrapper from "@/ui/cloudscape/header";
import ButtonWrapper from "@/ui/cloudscape/button";
import Image from "next/image";
import { useEffect, useState } from "react";

import BreadcrumbProvider from "@/ui/components/provider/bread_crumb";
import FlashBarProvider from "@/ui/components/provider/flash_bar";
import TopNavigationProvider from "@/ui/components/provider/top_menu";
import React from "react";
import RelationalTable from "@/ui/components/table/relationnal_data";
import { RelationalDataList } from "@/library/api/elasticache_rds/list";

export default function ListPage() {
  //Alert
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  //RelationalTable
  const [relationalTableItems, setRelationalTableItems] = useState([]);
  const [relationalTableLoading, setRelationalTableLoading] = useState(false);

  useEffect(() => {
    const relationalData = new RelationalDataList();
    setRelationalTableLoading(true);
    relationalData
      .execute()
      .then((response) => {
        response.json().then((object) => {
          console.log(object);
          setRelationalTableItems(object);
        });
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
          setAlertMessage("Server Error");
        }
      })
      .finally(() => {
        setRelationalTableLoading(false);
      });
  }, []);

  return (
    <>
      <FlashBarProvider />
      <BreadcrumbProvider />
      <TopNavigationProvider />
      <ContentLayoutWrapper
        disableOverlap={true}
        header={
          <HeaderWrapper
            title={"Relational Data List"}
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
                <Image src={`/rds.svg`} alt="rds" width={500} height={500} />
              ),
              position: "side",
              width: "25%",
            }}
            content={
              <>
                <RelationalTable
                  items={relationalTableItems}
                  loading={relationalTableLoading}
                />
              </>
            }
          />
        }
      />
    </>
  );
}
*/
