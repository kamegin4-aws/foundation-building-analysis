import * as React from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import Input from "@cloudscape-design/components/input";
import {
  LOGO_SRC,
  SETTINGS_ITEMS,
  USER_PROFILE_ITEMS,
} from "@/ui/cloudscape/constant_group/constant_top_navigation";

export default function CTopNavigation() {
  return (
    <TopNavigation
      identity={{
        href: "#",
        title: "Service",
        logo: {
          src: LOGO_SRC,
          alt: "Service",
        },
      }}
      utilities={[
        {
          type: "button",
          iconName: "notification",
          title: "Notifications",
          ariaLabel: "Notifications (unread)",
          badge: true,
          disableUtilityCollapse: false,
        },
        {
          type: "menu-dropdown",
          iconName: "settings",
          ariaLabel: "Settings",
          title: "Settings",
          items: SETTINGS_ITEMS,
        },
        {
          type: "menu-dropdown",
          text: "Customer Name",
          description: "email@example.com",
          iconName: "user-profile",
          items: USER_PROFILE_ITEMS,
        },
      ]}
      search={<Input type="search" placeholder="Search" ariaLabel="Search" />}
    />
  );
}
