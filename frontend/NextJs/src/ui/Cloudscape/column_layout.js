import ColumnLayout from '@cloudscape-design/components/column-layout';
import React from 'react';

export default function ColumnLayoutWrapper(props) {
  return (
    <ColumnLayout
      columns={props.columnNumber ? props.columnNumber : 1}
      borders={props.borders ? props.borders : 'none'} //none| vertical| horizontal| all
      variant={props.variant ? props.variant : 'default'}
    >
      {props.content ? props.content : <></>}
    </ColumnLayout>
  );
}
