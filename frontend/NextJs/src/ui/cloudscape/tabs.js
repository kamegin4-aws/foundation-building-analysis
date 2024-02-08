import Tabs from "@cloudscape-design/components/tabs";

export default function TabsWrapper(props) {
  return <Tabs tabs={props.tabs ? props.tabs : []} />;
}
