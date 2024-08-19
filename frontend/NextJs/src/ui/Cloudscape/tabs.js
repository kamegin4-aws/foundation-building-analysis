import Tabs from '@cloudscape-design/components/tabs';
import React from 'react';

export default function TabsWrapper(props) {
  return <Tabs tabs={props.tabs ? props.tabs : []} />;
}
