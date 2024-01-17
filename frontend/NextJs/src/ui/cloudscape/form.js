import * as React from "react";
import Form from "@cloudscape-design/components/form";

export default function CForm() {
  return (
    <form onSubmit="return false">
      <Form header={props.header}>{props.container}</Form>
    </form>
  );
}
