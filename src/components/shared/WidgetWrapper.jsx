import PropTypes from "prop-types";

function WidgetWrapper({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-xl w-full h-full p-6 ${className}`}
    >
      {children}
    </div>
  );
}

WidgetWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

WidgetWrapper.defaultProps = {
  className: "",
};

export default WidgetWrapper;
