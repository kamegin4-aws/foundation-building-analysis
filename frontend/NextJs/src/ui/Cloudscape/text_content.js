import TextContent from "@cloudscape-design/components/text-content";
import React from "react";

export default function TextContentWrapper(props) {
  return <TextContent>{props.contents ? props.contents : <></>}</TextContent>;
}
