"use client";

import TopNavigationWrapper from "@/ui/cloudscape/top_navigation";
import SideNavigationWrapper from "@/ui/cloudscape/side_navigation";
import AppLayoutWrapper from "@/ui/cloudscape/app_layout";
import BreadcrumbGroupWrapper from "@/ui/cloudscape/breadcrumb_group";
import FlashBarWrapper from "@/ui/cloudscape/flashbar";
import { useState, useContext } from "react";
import CognitoProvider from "@/ui/components/provider/cognito_provider";
import AppLayoutProvider, {
  LayoutContext,
} from "@/ui/components/provider/layout_provider";
import React from "react";

export default function CognitoLayout({ children, params }) {
  //OpenState
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);

  //LayoutContext
  const {
    breadcrumbItems,
    sideNavigationItems,
    helpPanel,
    splitPanel,
    flashBarItems,
    menuDropdownItems,
  } = useContext(LayoutContext);

  return (
    <>
      <TopNavigationWrapper menuDropdown={menuDropdownItems} />
      <AppLayoutWrapper
        breadCrumbGroup={<BreadcrumbGroupWrapper items={breadcrumbItems} />}
        sideNavigation={<SideNavigationWrapper />}
        navigationOpen={navigationOpen}
        toolsOpen={toolsOpen}
        splitPanelOpen={splitPanelOpen}
        parentSetNavigationOpen={setNavigationOpen}
        parentSetSplitPanelOpen={setSplitPanelOpen}
        parentSetToolsOpen={setToolsOpen}
        helpPanel={helpPanel}
        splitPanel={splitPanel}
        notifications={<FlashBarWrapper items={flashBarItems} />}
        content={<CognitoProvider>{children}</CognitoProvider>}
      />
    </>
  );
}
