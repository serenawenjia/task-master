import TasksWidget from "../widgets/TasksWidget";
import TimerWidget from "../widgets/TimerWidget";
import StatusWidget from "../widgets/StatusWidget";
import WidgetWrapper from "../shared/WidgetWrapper";

function HomePage() {
  return (
    <>
      <div className="col-span-4 h-[calc(100vh-2rem)]">
        <WidgetWrapper>
          <TasksWidget />
        </WidgetWrapper>
      </div>
      <div className="col-span-4 h-[calc(100vh-2rem)] grid grid-rows-2 gap-6">
        <WidgetWrapper>
          <TimerWidget />
        </WidgetWrapper>
        <WidgetWrapper>
          <StatusWidget />
        </WidgetWrapper>
      </div>
    </>
  );
}

export default HomePage;
