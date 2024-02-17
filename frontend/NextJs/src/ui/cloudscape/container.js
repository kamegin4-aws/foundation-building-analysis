import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function ContainerWrapper(props) {
  return (
    <Container
      variant={props.variant ? props.variant : "default"}
      header={props.header ? props.header : ""}
      footer={props.footer ? props.footer : undefined}
      media={props.media ? props.media : undefined}
    >
      <SpaceBetween size="l">
        {props.content ? props.content : <></>}
      </SpaceBetween>
    </Container>
  );
}
