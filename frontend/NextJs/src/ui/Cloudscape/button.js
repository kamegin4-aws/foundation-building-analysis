import Button from '@cloudscape-design/components/button';
import React from 'react';

export default function ButtonWrapper(props) {
  return (
    <Button
      variant={props.variant ? props.variant : 'primary'}
      formAction={props.formAction ? props.formAction : 'none'}
      onClick={props.onClick ? props.onClick : undefined}
      loading={props.loading ? props.loading : false}
      loadingText={props.loadingText ? props.loadingText : undefined}
      iconAlign={props.iconAlign ? props.iconAlign : 'left'}
      iconAlt={props.iconAlt ? props.iconAlt : undefined}
      iconName={props.iconName ? props.iconName : undefined}
      target={props.target ? props.target : undefined}
      href={props.href ? props.href : undefined}
    >
      {props.name ? props.name : ''}
    </Button>
  );
}
