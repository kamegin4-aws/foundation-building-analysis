import { AppLayout } from "@cloudscape-design/components";
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";
import SpaceBetween from "@cloudscape-design/components/space-between";

const LOCALE = "jp";

export default function AppLayoutWrapper(props) {
  //const [navigationOpen, setNavigationOpen] = React.useState(false);
  //const [toolsOpen, setToolsOpen] = React.useState(false);
  //const [splitPanelOpen, setSplitPanelOpen] = React.useState(false);

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        breadcrumbs={props.breadCrumbGroup ? props.breadCrumbGroup : undefined}
        navigationOpen={props.navigationOpen ? props.navigationOpen : false}
        navigation={props.sideNavigation ? props.sideNavigation : undefined}
        notifications={props.notifications ? props.notifications : undefined}
        toolsOpen={props.toolsOpen ? props.toolsOpen : false}
        tools={props.helpPanel ? props.helpPanel : undefined}
        content={
          <SpaceBetween direction="vertical" size="l">
            {props.content ? props.content : <></>}
          </SpaceBetween>
        }
        splitPanelOpen={props.splitPanelOpen ? props.splitPanelOpen : false}
        splitPanel={props.splitPanel ? props.splitPanel : undefined}
        onNavigationChange={(event) => {
          event.preventDefault();
          //console.log(event.detail.open);
          props.parentSetNavigationOpen(event.detail.open);
        }}
        onSplitPanelToggle={(event) => {
          event.preventDefault();
          //console.log(event.detail.open);
          props.parentSetSplitPanelOpen(event.detail.open);
        }}
        onToolsChange={(event) => {
          event.preventDefault();
          //console.log(event.detail.open);
          props.parentSetToolsOpen(event.detail.open);
        }}
      />
    </I18nProvider>
  );
}
