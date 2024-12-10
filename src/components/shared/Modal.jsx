import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

function Modal({ trigger, title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const onClose = () => setIsOpen(false);

  return (
    <>
      {/* Trigger element with click handler */}
      <div onClick={() => setIsOpen(true)}>{trigger}</div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 hover:bg-accent-primary/10 p-1 rounded"
              >
                <CloseIcon />
              </button>
            </div>
            {typeof children === "function" ? children({ onClose }) : children}
          </div>
        </div>
      )}
    </>
  );
}

Modal.propTypes = {
  trigger: PropTypes.node,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export default Modal;
