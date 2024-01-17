import * as React from "react";
import Header from "@cloudscape-design/components/header";

export default function CHeader(props) {
  return (
    <Header variant="h1" actions={props.actions}>
      {props.title}
    </Header>
  );
}
