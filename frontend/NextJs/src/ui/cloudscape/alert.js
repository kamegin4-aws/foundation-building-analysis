import Alert from "@cloudscape-design/components/alert";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function AlertWrapper(props) {
  return (
    <Alert
      dismissible={true}
      type={props.type ? props.type : "info"}
      header={props.header ? props.header : "AlertUndefined"}
      onDismiss={(event) => {
        event.preventDefault();
        //console.log(event.detail);
        props.parentAlertDisplay(false);
      }}
      action={
        props.action ? (
          <SpaceBetween direction="horizontal" size="xs">
            {props.action}
          </SpaceBetween>
        ) : undefined
      }
    >
      {props.message ? props.message : ""}
    </Alert>
  );
}
