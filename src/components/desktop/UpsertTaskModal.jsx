import PropTypes from "prop-types";
import UpsertTaskSection from "../shared/UpsertTaskSection";
import Modal from "../shared/Modal";

function UpsertTaskModal({ trigger, task }) {
  return (
    <Modal trigger={trigger} title={task ? "Edit Task" : "Add Task"}>
      {({ onClose }) => (
        <UpsertTaskSection
          onClose={onClose}
          initialTask={task}
          isEditing={Boolean(task)}
        />
      )}
    </Modal>
  );
}

UpsertTaskModal.propTypes = {
  trigger: PropTypes.node,
  task: PropTypes.object,
};

export default UpsertTaskModal;
