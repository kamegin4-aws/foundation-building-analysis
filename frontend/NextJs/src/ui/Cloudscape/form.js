import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React from 'react';

export default function FormWrapper(props) {
  return (
    <form
      onSubmit={props.onSubmit ? props.onSubmit : (e) => e.preventDefault()}
    >
      <Form
        actions={
          props.actions ? (
            <SpaceBetween direction="horizontal" size="xs">
              {props.actions}
            </SpaceBetween>
          ) : undefined
        }
      >
        {props.container ? (
          <SpaceBetween direction="vertical" size="s">
            {props.container}
          </SpaceBetween>
        ) : (
          <></>
        )}
      </Form>
    </form>
  );
}
