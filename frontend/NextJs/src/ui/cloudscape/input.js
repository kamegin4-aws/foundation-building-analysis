import Input from "@cloudscape-design/components/input";

export default function InputWrapper(props) {
  //const [value, setValue] = React.useState("");

  return (
    <Input
      onChange={({ detail }) => {
        //setValue(detail.value);
        props.parentSetValue(detail.value);
      }}
      value={props.value ? props.value : ""}
      type={props.type ? props.type : "text"}
      inputMode={props.inputMode ? props.inputMode : "text"}
      invalid={props.invalid ? props.invalid : false}
    />
  );
}
