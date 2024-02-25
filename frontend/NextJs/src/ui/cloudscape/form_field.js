import FormField from "@cloudscape-design/components/form-field";

export default function FormFieldWrapper(props) {
  return (
    <FormField
      description={props.description ? props.description : ""}
      label={props.label ? props.label : ""}
      errorText={props.errorText ? props.errorText : undefined}
    >
      {props.formField ? props.formField : <></>}
    </FormField>
  );
}
