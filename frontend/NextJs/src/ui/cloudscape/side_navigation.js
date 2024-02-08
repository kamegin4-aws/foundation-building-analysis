import SideNavigation from "@cloudscape-design/components/side-navigation";

import {
  HEADER,
  ITEMS,
} from "@/ui/cloudscape/constant_group/constant_side_navigation";

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
      items={ITEMS}
    />
  );
}
