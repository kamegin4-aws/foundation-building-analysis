import * as React from "react";
import Button from "@cloudscape-design/components/button";

export default function ButtonWrapper(props) {
  return (
    <Button
      variant={props.variant ? props.variant : "primary"}
      formAction={props.formAction ? props.formAction : "none"}
      onClick={props.onClick ? props.onClick : undefined}
      loading={props.loading ? props.loading : false}
      loadingText={props.loadingText ? props.loadingText : undefined}
    >
      {props.name ? props.name : "ButtonUndefined"}
    </Button>
  );
}
