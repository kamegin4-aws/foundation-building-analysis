import Spinner from "@cloudscape-design/components/spinner";

export default function SpinnerWrapper(props) {
  return (
    <Spinner
      size={props.size ? props.size : "normal"} //normal| big| large
      variant={props.variant ? props.variant : "normal"}
    />
  );
}
