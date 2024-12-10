import TaskRow from "../shared/TaskRow";
import { useTasksContext } from "../../contexts/TasksContext";
import useScreenSize from "../../hooks/useScreenSize";
import UpsertTaskModal from "../desktop/UpsertTaskModal";

function TasksWidget() {
  const {
    tasks: { tasks, updateTaskStatus, selectTask },
  } = useTasksContext();
  const isMobile = useScreenSize();

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-2xl font-bold">Tasks</h2>
        {!isMobile && (
          <UpsertTaskModal
            trigger={
              <button className="bg-accent-primary text-gray-900 px-4 py-2 rounded hover:bg-accent-primary/90">
                Add Task
              </button>
            }
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 pt-4">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onStatusChange={() => updateTaskStatus(task.id)}
              onSelect={() => selectTask(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TasksWidget;
