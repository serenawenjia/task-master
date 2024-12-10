import StatusWidget from "../widgets/StatusWidget";
import WidgetWrapper from "../shared/WidgetWrapper";

function StatusPage() {
  return (
    <WidgetWrapper className="flex-1">
      <StatusWidget />
    </WidgetWrapper>
  );
}

export default StatusPage;
