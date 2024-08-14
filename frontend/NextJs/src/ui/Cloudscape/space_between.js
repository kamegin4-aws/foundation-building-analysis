import SpaceBetween from '@cloudscape-design/components/space-between';
import React from 'react';

export default function SpaceBetweenWrapper(props) {
  return (
    <SpaceBetween
      size={props.size ? props.size : 'l'} //xxxs| xxs| xs| s| m| l| xl| xxl
      direction={props.direction ? props.direction : 'vertical'}
    >
      {props.contents ? props.contents : <></>}
    </SpaceBetween>
  );
}
