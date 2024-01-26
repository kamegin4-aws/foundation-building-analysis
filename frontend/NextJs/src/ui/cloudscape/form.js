import * as React from "react";
import Form from "@cloudscape-design/components/form";

export default function FormWrapper(props) {
  return (
    <form
      onSubmit={props.onSubmit ? props.onSubmit : (e) => e.preventDefault()}
    >
      <Form actions={props.actions ? props.actions : undefined}>
        {props.container ? props.container : <></>}
      </Form>
    </form>
  );
}
