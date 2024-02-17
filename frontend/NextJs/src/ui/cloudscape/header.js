import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function HeaderWrapper(props) {
  return (
    <Header
      variant="h1"
      actions={
        props.actions ? (
          <SpaceBetween direction="horizontal" size="xs">
            {props.actions}
          </SpaceBetween>
        ) : undefined
      }
    >
      {props.title ? props.title : <></>}
      {props.alert ? props.alert : <></>}
    </Header>
  );
}
