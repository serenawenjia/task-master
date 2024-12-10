import PropTypes from "prop-types";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useTasksContext } from "../../contexts/TasksContext";

function StatusCard({ icon: Icon, title, count, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-6 w-6 text-accent-primary" />
        <h3 className="font-semibold text-black">{title}</h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-black">{count}</div>
        {subtitle && <div className="text-sm text-black">{subtitle}</div>}
      </div>
    </div>
  );
}

StatusCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  subtitle: PropTypes.string,
};

function StatusWidget({ showSeconds = false }) {
  const {
    status: { totalFocus, tasksDueToday, ongoingTasks, completedTasks },
  } = useTasksContext();

  const formatFocusTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return showSeconds
      ? `${hours}h ${minutes}m ${remainingSeconds}s`
      : `${hours}h ${minutes}m`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-2xl font-bold">Status</h2>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <StatusCard
            icon={AssignmentIcon}
            title="Tasks Due Today"
            count={tasksDueToday}
          />
          <StatusCard
            icon={AccessTimeIcon}
            title="Ongoing Tasks"
            count={ongoingTasks}
          />
          <StatusCard
            icon={CheckCircleIcon}
            title="Completed Tasks"
            count={completedTasks}
          />
          <StatusCard
            icon={LocalFireDepartmentIcon}
            title="Total Focus Time"
            count={formatFocusTime(totalFocus)}
          />
        </div>
      </div>
    </div>
  );
}

StatusWidget.propTypes = {
  showSeconds: PropTypes.bool,
};

StatusWidget.defaultProps = {
  showSeconds: false,
};

export default StatusWidget;
