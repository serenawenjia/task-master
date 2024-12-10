import { useState } from "react";
import PropTypes from "prop-types";
import { useTasksContext } from "../../contexts/TasksContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import toast from "react-hot-toast";

const PREDEFINED_TAGS = ["Personal", "School", "Work"];

function UpsertTaskSection({ onClose, initialTask, isEditing }) {
  const {
    tasks: { addTask, updateTask },
  } = useTasksContext();

  const [formData, setFormData] = useState(
    initialTask
      ? {
          ...initialTask,
          duration: Math.floor(initialTask.duration / 60), // Convert seconds to minutes for editing
        }
      : {
          title: "",
          description: "",
          duration: "",
          tags: [],
          deadline: "",
        }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      duration: parseInt(formData.duration) * 60, // Convert to seconds
      done: initialTask ? initialTask.done : false,
    };

    if (isEditing) {
      updateTask(initialTask.id, taskData);
      toast.success("Task updated successfully");
    } else {
      addTask(taskData);
      toast.success("Task added successfully");
    }
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  // Get tomorrow's date for min attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border rounded p-2 min-h-[100px]"
          placeholder="Enter task description..."
        />
      </div>

      <div>
        <label className="block mb-1">
          Time Duration (minutes) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Tags</label>
        <div className="flex gap-4">
          {PREDEFINED_TAGS.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleTagToggle(tag)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-accent-secondary"
              >
                {formData.tags.includes(tag) ? (
                  <CheckCircleIcon className="w-4 h-4 text-accent-primary" />
                ) : (
                  <CheckCircleOutlineIcon className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          min={minDate}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-accent-primary text-gray-900 rounded py-2 hover:bg-accent-primary/90"
      >
        {isEditing ? "Save Task" : "Add Task"}
      </button>
    </form>
  );
}

UpsertTaskSection.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialTask: PropTypes.object,
  isEditing: PropTypes.bool,
};

export default UpsertTaskSection;
