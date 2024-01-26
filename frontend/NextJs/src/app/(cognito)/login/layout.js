"use client";

import TopNavigationWrapper from "@/ui/cloudscape/top_navigation";
import SideNavigationWrapper from "@/ui/cloudscape/side_navigation";
import AppLayoutWrapper from "@/ui/cloudscape/app_layout";
import BreadcrumbGroupWrapper from "@/ui/cloudscape/breadcrumb_group";

export default function LoginLayout({ children, params }) {
  const breadcrumbItems = [
    { text: "Home", href: "#" },
    { text: "Login", href: "/login" },
  ];

  return (
    <>
      <TopNavigationWrapper />
      <AppLayoutWrapper
        breadCrumbGroup={<BreadcrumbGroupWrapper items={breadcrumbItems} />}
        sideNavigation={<SideNavigationWrapper />}
        content={children}
      />
    </>
  );
}
