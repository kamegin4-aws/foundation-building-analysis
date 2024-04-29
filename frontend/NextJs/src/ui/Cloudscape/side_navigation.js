import SideNavigation from "@cloudscape-design/components/side-navigation";

import { HEADER, ITEMS } from "@/ui/Cloudscape/constant/side_navigation";
import React from "react";

export default function SideNavigationWrapper(props) {
  //const [activeHref, setActiveHref] = React.useState(props.initialActiveHref);

  return (
    <SideNavigation
      activeHref={props.activeHref ? props.activeHref : "#"}
      header={HEADER}
      onFollow={(event) => {
        if (!event.detail.external) {
          event.preventDefault();
          props.parentSetActiveHref(event.detail.href);
        }
      }}
      // @ts-ignore
      items={ITEMS}
    />
  );
}
