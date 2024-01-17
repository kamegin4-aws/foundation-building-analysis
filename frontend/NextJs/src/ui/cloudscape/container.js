import * as React from "react";
import Container from "@cloudscape-design/components/container";

export default function CContainer(props) {
  return <Container header={props.header}>{props.content}</Container>;
}
