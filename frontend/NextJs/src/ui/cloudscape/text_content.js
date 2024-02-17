import TextContent from "@cloudscape-design/components/text-content";

export default function TextContentWrapper(props) {
  return <TextContent>{props.contents ? props.contents : <></>}</TextContent>;
}
