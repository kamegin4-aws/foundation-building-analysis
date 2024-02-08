import ContentLayout from "@cloudscape-design/components/content-layout";

export default function ContentLayoutWrapper(props) {
  return <ContentLayout>{props.content ? props.content : <></>}</ContentLayout>;
}
