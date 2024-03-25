import Icon from "@cloudscape-design/components/icon";
import React from "react";

export default function IconWrapper(props) {
  return (
    <Icon
      alt={props.alt ? props.alt : undefined}
      name={props.name ? props.name : undefined}
      size={props.size ? props.size : "normal"}
      variant={props.variant ? props.variant : "normal"}
      svg={props.svg ? props.svg : undefined}
    />
  );
}
