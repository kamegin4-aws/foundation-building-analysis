import * as React from "react";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function SpaceBetweenWrapper(props) {
  return (
    <SpaceBetween
      size={props.size ? props.size : "l"}
      direction={props.direction ? props.direction : "vertical"}
    >
      {props.contents ? props.contents : <></>}
    </SpaceBetween>
  );
}
