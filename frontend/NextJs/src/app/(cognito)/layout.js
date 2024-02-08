"use client";

import TopNavigationWrapper from "@/ui/cloudscape/top_navigation";
import SideNavigationWrapper from "@/ui/cloudscape/side_navigation";
import AppLayoutWrapper from "@/ui/cloudscape/app_layout";
import BreadcrumbGroupWrapper from "@/ui/cloudscape/breadcrumb_group";
import { createContext, useState } from "react";

export const CognitoLayoutContext = createContext();

export default function CognitoLayout({ children, params }) {
  //OpenState
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);

  //breadCrumbGroup
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { text: "Home", href: "#" },
  ]);

  return (
    <CognitoLayoutContext.Provider
      value={{
        breadcrumbItems,
        setNavigationOpen,
        setToolsOpen,
        setSplitPanelOpen,
        setBreadcrumbItems,
      }}
    >
      <TopNavigationWrapper />
      <AppLayoutWrapper
        breadCrumbGroup={<BreadcrumbGroupWrapper items={breadcrumbItems} />}
        sideNavigation={<SideNavigationWrapper />}
        navigationOpen={navigationOpen}
        toolsOpen={toolsOpen}
        splitPanelOpen={splitPanelOpen}
        parentSetNavigationOpen={setNavigationOpen}
        parentSetSplitPanelOpen={setSplitPanelOpen}
        parentSetToolsOpen={setToolsOpen}
        content={children}
      />
    </CognitoLayoutContext.Provider>
  );
}
