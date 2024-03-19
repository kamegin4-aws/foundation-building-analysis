import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function ModalWrapper(props) {
  //const [visible, setVisible] = React.useState(false);

  return (
    <Modal
      onDismiss={() =>
        props.parentSetVisible ? props.parentSetVisible(false) : undefined
      }
      visible={props.visible ? props.visible : false}
      footer={
        props.footer ? (
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              {props.footer}
            </SpaceBetween>
          </Box>
        ) : undefined
      }
      header={props.header ? props.header : undefined}
    >
      {props.content ? (
        <SpaceBetween direction="vertical" size="s">
          {props.content}
        </SpaceBetween>
      ) : (
        <></>
      )}
    </Modal>
  );
}
