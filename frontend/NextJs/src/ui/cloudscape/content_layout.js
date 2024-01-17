import * as React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function CContentLayout(props) {
  return (
    <ContentLayout>
      <SpaceBetween size="xs">{props.content}</SpaceBetween>
    </ContentLayout>
  );
}
