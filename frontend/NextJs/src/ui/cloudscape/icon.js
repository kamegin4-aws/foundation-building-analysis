import Icon from "@cloudscape-design/components/icon";

export default function IconWrapper(props) {
  return (
    <Icon
      alt={props.alt ? props.alt : undefined}
      name={props.type ? props.type : undefined}
      size={props.size ? props.size : "normal"}
      variant={props.variant ? props.variant : "normal"}
      svg={props.svg ? props.svg : undefined}
    />
  );
}
