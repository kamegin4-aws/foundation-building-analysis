import * as React from "react";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";

export default function BreadcrumbGroupWrapper(props) {
  return (
    <BreadcrumbGroup
      items={props.items ? props.items : []}
      ariaLabel="Breadcrumbs"
    />
  );
}
