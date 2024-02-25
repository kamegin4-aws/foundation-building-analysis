import TopNavigation from "@cloudscape-design/components/top-navigation";
import Input from "@cloudscape-design/components/input";
import {
  LOGO_SRC,
  SETTINGS_ITEMS,
  USER_PROFILE_ITEMS,
} from "@/ui/cloudscape/constant/constant_top_navigation";

export default function TopNavigationWrapper(props) {
  return (
    <TopNavigation
      identity={{
        href: "#",
        title: "基本基盤アプリ",
        logo: {
          src: LOGO_SRC,
          alt: "Foundation Building App",
        },
      }}
      utilities={
        /*
        {
          type: "button",
          iconName: "notification",
          title: "Notifications",
          ariaLabel: "Notifications (unread)",
          badge: true,
          disableUtilityCollapse: false,
        },
        */
        /*
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
        */
        props.menuDropdown
      }
      //search={<Input type="search" placeholder="Search" ariaLabel="Search" />}
    />
  );
}
