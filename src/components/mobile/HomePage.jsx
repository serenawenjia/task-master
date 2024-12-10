import TimerWidget from "../widgets/TimerWidget";
import TasksWidget from "../widgets/TasksWidget";
import WidgetWrapper from "../shared/WidgetWrapper";

function MobileHome() {
  return (
    <>
      <WidgetWrapper>
        <TimerWidget />
      </WidgetWrapper>
      <WidgetWrapper className="flex-1">
        <TasksWidget />
      </WidgetWrapper>
    </>
  );
}

export default MobileHome;
