import ColumnLayout from "@cloudscape-design/components/column-layout";

export default function ColumnLayoutWrapper(props) {
  return (
    <ColumnLayout columns={props.columnNumber ? props.columnNumber : 1}>
      {props.content ? props.content : <></>}
    </ColumnLayout>
  );
}
