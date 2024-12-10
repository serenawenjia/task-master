import PropTypes from "prop-types";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTasksContext } from "../../contexts/TasksContext";
import UpsertTaskModal from "../desktop/UpsertTaskModal";
import toast from "react-hot-toast";

function TaskRow({ task, onStatusChange, onSelect }) {
  const {
    tasks: { deleteTask },
  } = useTasksContext();

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (task.duration) {
      onSelect();
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onStatusChange();
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
    toast.success("Task deleted successfully");
  };

  return (
    <div
      className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={handleCheckboxClick}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent-secondary"
        >
          {task.done ? (
            <CheckCircleIcon className="w-6 h-6 text-accent-primary" />
          ) : (
            <CheckCircleOutlineIcon className="w-6 h-6 text-gray-400" />
          )}
        </button>
        <div>
          <h3
            className={`font-medium ${
              task.done ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
          <div className="flex items-center">
            {task.tags.length > 0 && (
              <div className="flex space-x-2">
                {task.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs bg-gray-200 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {task.deadline && (
              <span
                className={`text-xs text-gray-500 ${
                  task.tags.length > 0 ? "ml-2" : ""
                }`}
              >
                Due {formatDeadline(task.deadline)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-gray-600 font-mono">
          {formatDuration(task.duration)}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <UpsertTaskModal
            task={task}
            trigger={
              <button
                className="p-1 hover:bg-accent-secondary rounded-full group/edit"
                title="Edit task"
              >
                <EditIcon className="w-5 h-5 text-gray-600 group-hover/edit:text-accent-primary" />
              </button>
            }
          />
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-100 rounded-full group/delete"
            title="Delete task"
          >
            <DeleteIcon className="w-5 h-5 text-gray-600 group-hover/delete:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

TaskRow.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    done: PropTypes.bool.isRequired,
    deadline: PropTypes.string,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TaskRow;
