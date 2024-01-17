"use client";

import * as React from "react";
import Tabs from "@cloudscape-design/components/tabs";

export default function CTabs(props) {
  const [activeTabId, setActiveTabId] = React.useState("first");

  return (
    <Tabs
      activeTabId={activeTabId}
      tabs={[
        {
          label: `${props.tabFirstLabel}`,
          id: "first",
          content: `${props.tabFirstContent}`,
        },
        {
          label: `${props.tabSecondLabel}`,
          id: "second",
          content: `${props.tabSecondContent}`,
        },
      ]}
      onChange={(event) => {
        event.preventDefault();
        //console.log(event.detail.open);
        setActiveTabId(event.detail.activeTabId);
      }}
    />
  );
}
