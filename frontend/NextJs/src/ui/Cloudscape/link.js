import Link from '@cloudscape-design/components/link';
import React from 'react';

export default function LinkWrapper(props) {
  return (
    <Link
      href={props.href ? props.href : '#'}
      external={props.external ? props.external : false}
      target={props.target ? '_blank' : ''}
    >
      {props.alt ? props.alt : ''}
    </Link>
  );
}
