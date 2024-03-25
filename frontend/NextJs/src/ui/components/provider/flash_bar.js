"use client";

import { LayoutContext } from "@/ui/components/provider/layout_provider";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useContext, useEffect } from "react";

export default function FlashBarProvider(props) {
  //LayoutContext
  const { flashBarItems, setFlashBarItems } = useContext(LayoutContext);

  const searchParams = useSearchParams();
  const searchType = searchParams.get("type");
  const searchMessages = searchParams.get("message");

  useEffect(() => {
    let items = flashBarItems.concat();
    if (searchType && searchMessages) {
      items.push({
        type: searchType,
        dismissible: true,
        dismissLabel: "Dismiss message",
        onDismiss: () => setFlashBarItems([]),
        content: <>{searchMessages}</>,
      });

      setFlashBarItems(items);
    }

    if (props.items) setFlashBarItems(flashBarItems.concat(props.items));
  }, []);

  return <></>;
}
