"use client";

import TopNavigationWrapper from "@/ui/cloudscape/top_navigation";
import SideNavigationWrapper from "@/ui/cloudscape/side_navigation";
import AppLayoutWrapper from "@/ui/cloudscape/app_layout";
import BreadcrumbGroupWrapper from "@/ui/cloudscape/breadcrumb_group";
import FlashBarWrapper from "@/ui/cloudscape/flashbar";
import { createContext, useState } from "react";

export const CognitoLayoutContext = createContext();

export default function CognitoLayout({ children, params }) {
  //OpenState
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);

  //OptionComponents
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { text: "Home", href: "#" },
  ]);
  const [topNavigationItems, setTopNavigationItems] = useState(
    <TopNavigationWrapper />
  );
  const [sideNavigationItems, setSideNavigationItems] = useState(
    <SideNavigationWrapper />
  );
  const [helpPanel, setHelpPanel] = useState();
  const [splitPanel, setSplitPanel] = useState();
  const [flashBarItems, setFlashBarItems] = useState([]);

  return (
    <CognitoLayoutContext.Provider
      value={{
        setBreadcrumbItems,
        setTopNavigationItems,
        setSideNavigationItems,
        setHelpPanel,
        setSplitPanel,
        setFlashBarItems,
      }}
    >
      {topNavigationItems}
      <AppLayoutWrapper
        breadCrumbGroup={<BreadcrumbGroupWrapper items={breadcrumbItems} />}
        sideNavigation={sideNavigationItems}
        navigationOpen={navigationOpen}
        toolsOpen={toolsOpen}
        splitPanelOpen={splitPanelOpen}
        parentSetNavigationOpen={setNavigationOpen}
        parentSetSplitPanelOpen={setSplitPanelOpen}
        parentSetToolsOpen={setToolsOpen}
        helpPanel={helpPanel}
        splitPanel={splitPanel}
        notifications={<FlashBarWrapper items={flashBarItems} />}
        content={children}
      />
    </CognitoLayoutContext.Provider>
  );
}
