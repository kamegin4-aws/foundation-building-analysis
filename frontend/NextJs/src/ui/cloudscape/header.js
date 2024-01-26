import * as React from "react";
import Header from "@cloudscape-design/components/header";

export default function HeaderWrapper(props) {
  return (
    <Header variant="h1" actions={props.actions ? props.actions : undefined}>
      <>{props.title ? props.title : "HeaderUndefined"}</>
      <>{props.alert ? props.alert : <></>}</>
    </Header>
  );
}
