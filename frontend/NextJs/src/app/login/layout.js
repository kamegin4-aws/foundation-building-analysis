"use client";

import CTopNavigation from "@/ui/cloudscape/top_navigation";
import CSideNavigation from "@/ui/cloudscape/side_navigation";
import CAppLayout from "@/ui/cloudscape/app_layout";
import CBreadcrumbGroup from "@/ui/cloudscape/breadcrumb_group";
import CContentLayout from "@/ui/cloudscape/content_layout";

export default function LoginLayout({ children, params }) {
  const breadcrumbItems = [
    { text: "Sample", href: "#" },
    { text: "Login", href: "/login" },
  ];

  return (
    <>
      <CTopNavigation />
      <CAppLayout
        breadCrumbGroup={<CBreadcrumbGroup items={breadcrumbItems} />}
        sideNavigation={<CSideNavigation />}
        content={<CContentLayout content={children} />}
      />
    </>
  );
}
