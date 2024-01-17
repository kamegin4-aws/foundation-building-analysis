"use client";

import * as React from "react";
import { AppLayout } from "@cloudscape-design/components";
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";

const LOCALE = "jp";

export default function CAppLayout(props) {
  const [navigationOpen, setNavigationOpen] = React.useState(false);
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [splitPanelOpen, setSplitPanelOpen] = React.useState(false);

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        breadcrumbs={props.breadCrumbGroup}
        navigationOpen={navigationOpen}
        navigation={props.sideNavigation}
        notifications={props.notifications}
        toolsOpen={toolsOpen}
        tools={props.helpPanel}
        content={props.content}
        splitPanelOpen={splitPanelOpen}
        splitPanel={props.splitPanel}
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
