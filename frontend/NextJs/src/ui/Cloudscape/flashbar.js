import Flashbar from "@cloudscape-design/components/flashbar";
import React from "react";

export default function FlashBarWrapper(props) {
  /*
  const [items, setItems] = React.useState([
    {
      type: "info", //success, error, warning, info
      dismissible: true,
      dismissLabel: "Dismiss message",
      onDismiss: () => setItems([]),
      content: (
        <>
          This is an info flash message. It contains{" "}
          <Link color="inverted">a link to another page</Link>.
        </>
      ),
    },
  ]);
  */

  return <Flashbar items={props.items} />;
}
