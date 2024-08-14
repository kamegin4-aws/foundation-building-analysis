import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import React from 'react';

export default function BreadcrumbGroupWrapper(props) {
  return (
    <BreadcrumbGroup
      items={props.items ? props.items : []}
      ariaLabel="Breadcrumbs"
    />
  );
}
