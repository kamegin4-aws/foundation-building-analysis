import FormField from "@cloudscape-design/components/form-field";

export default function FormFieldWrapper(props) {
  return (
    <FormField
      description={props.description ? props.description : ""}
      label={props.label ? props.label : "FormFieldUndefined"}
    >
      {props.formField ? props.formField : <></>}
    </FormField>
  );
}
