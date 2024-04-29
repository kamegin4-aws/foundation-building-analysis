import Box from "@cloudscape-design/components/box";
import React from "react";

export default function BoxWrapper(props) {
  return (
    <Box
      color={props.color ? props.color : undefined}
      display={props.display ? props.display : undefined}
      float={props.aside ? props.aside : undefined}
      fontSize={props.fontSize ? props.fontSize : undefined}
      textAlign={props.textAlign ? props.textAlign : "left"}
      variant={props.variant ? props.variant : "p"}
    >
      {props.content ? props.content : <></>}
    </Box>
  );
}
