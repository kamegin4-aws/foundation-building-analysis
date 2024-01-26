import * as React from "react";
import Alert from "@cloudscape-design/components/alert";

export default function AlertWrapper(props) {
  return (
    <Alert
      dismissible={true}
      type={props.type ? props.type : "info"}
      header={props.header ? props.header : "AlertUndefined"}
      onDismiss={(event) => {
        event.preventDefault();
        //console.log(event.detail);
        props.parentAlertDisplay(false);
      }}
    >
      {props.message ? props.message : ""}
    </Alert>
  );
}
