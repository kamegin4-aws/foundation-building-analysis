import ContentLayout from '@cloudscape-design/components/content-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React from 'react';

export default function ContentLayoutWrapper(props) {
  return (
    <ContentLayout
      header={
        props.header ? (
          <SpaceBetween size="m">{props.header}</SpaceBetween>
        ) : undefined
      }
      disableOverlap={props.disableOverlap ? props.disableOverlap : false}
    >
      {props.content ? props.content : <></>}
    </ContentLayout>
  );
}
