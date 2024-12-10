import { Link, Outlet, useMatch } from "react-router-dom";
import PropTypes from "prop-types";
import HomeIcon from "@mui/icons-material/Home";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ColumnLayout from "./ColumnLayout";
import WidgetWrapper from "../shared/WidgetWrapper";

function NavLink({ to, icon: Icon, children }) {
  const match = useMatch({ path: to, end: to === "/" });

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-5 py-3 rounded-lg ${
        match
          ? "bg-accent-secondary text-accent-primary"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className={match ? "text-gray-900" : ""}>{children}</span>
    </Link>
  );
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
};

function DesktopLayout() {
  return (
    <div className="max-h-screen min-h-screen gap-6 p-4 bg-background grid grid-cols-10">
      {/* Left Navigation - 2 columns */}
      <ColumnLayout columns={2}>
        <WidgetWrapper>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">TaskMaster</h1>
          </div>
          <nav className="space-y-2">
            <NavLink to="/" icon={HomeIcon}>
              Dashboard
            </NavLink>
            <NavLink to="/ai-chat" icon={SmartToyIcon}>
              AI Chatbot
            </NavLink>
          </nav>
        </WidgetWrapper>
      </ColumnLayout>

      {/* Main Content - 8 columns */}
      <ColumnLayout columns={8} subgrid>
        <Outlet />
      </ColumnLayout>
    </div>
  );
}

export default DesktopLayout;
