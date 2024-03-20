"use client";

import { CognitoLayoutContext } from "@/app/(Cognito)/layout";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

export default function FlashBarProvider(props) {
  //CognitoLayoutContext
  const { flashBarItems, setFlashBarItems } = useContext(CognitoLayoutContext);

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
