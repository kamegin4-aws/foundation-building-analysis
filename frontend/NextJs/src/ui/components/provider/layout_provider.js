'use client';

import React, { createContext, useState } from 'react';

export const LayoutContext = createContext(null);

export default function AppLayoutProvider(props) {
  //OptionComponents
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [sideNavigationItems, setSideNavigationItems] = useState([]);
  const [helpPanel, setHelpPanel] = useState();
  const [splitPanel, setSplitPanel] = useState();
  const [flashBarItems, setFlashBarItems] = useState([]);
  const [menuDropdownItems, setMenuDropdownItems] = useState([]);

  return (
    <LayoutContext.Provider
      value={{
        breadcrumbItems,
        sideNavigationItems,
        helpPanel,
        splitPanel,
        flashBarItems,
        menuDropdownItems,
        setBreadcrumbItems,
        setSideNavigationItems,
        setHelpPanel,
        setSplitPanel,
        setFlashBarItems,
        setMenuDropdownItems,
      }}
    >
      {props.children}
    </LayoutContext.Provider>
  );
}
