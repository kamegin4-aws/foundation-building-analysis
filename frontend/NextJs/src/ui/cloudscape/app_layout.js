"use client";

import * as React from "react";
import { AppLayout } from "@cloudscape-design/components";
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";
import SpaceBetween from "@cloudscape-design/components/space-between";

const LOCALE = "jp";

export default function AppLayoutWrapper(props) {
  const [navigationOpen, setNavigationOpen] = React.useState(false);
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [splitPanelOpen, setSplitPanelOpen] = React.useState(false);

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        breadcrumbs={props.breadCrumbGroup ? props.breadCrumbGroup : undefined}
        navigationOpen={navigationOpen}
        navigation={props.sideNavigation ? props.sideNavigation : undefined}
        notifications={props.notifications ? props.notifications : undefined}
        toolsOpen={toolsOpen}
        tools={props.helpPanel ? props.helpPanel : undefined}
        content={
          <SpaceBetween size="l">
            {props.content ? props.content : <></>}
          </SpaceBetween>
        }
        splitPanelOpen={splitPanelOpen}
        splitPanel={props.splitPanel ? props.splitPanel : undefined}
        onNavigationChange={(event) => {
          event.preventDefault();
          //console.log(event.detail.open);
          setNavigationOpen(event.detail.open);
        }}
        onSplitPanelToggle={(event) => {
          event.preventDefault();
          //console.log(event.detail.open);
          setSplitPanelOpen(event.detail.open);
        }}
        onToolsChange={(event) => {
          event.preventDefault();
          //console.log(event.detail.open);
          setToolsOpen(event.detail.open);
        }}
      />
    </I18nProvider>
  );
}
