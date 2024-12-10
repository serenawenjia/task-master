import PropTypes from "prop-types";
import UpsertTaskSection from "../shared/AddTask";
import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

function EditTaskModal({ isOpen, onClose, task }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 hover:bg-accent-primary/10 p-1 rounded"
          >
            <CloseIcon />
          </button>
        </div>
        <UpsertTaskSection onClose={onClose} initialTask={task} isEditing />
      </div>
    </div>
  );
}

EditTaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

export default EditTaskModal;
