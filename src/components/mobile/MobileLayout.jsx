import { Outlet, NavLink, useMatch } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PropTypes from "prop-types";

function NavItem({ to, icon: Icon }) {
  const match = useMatch({ path: to, end: to === "/" });

  return (
    <NavLink
      to={to}
      className={`flex flex-col items-center p-2 ${
        match ? "text-accent-primary" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      <Icon className={`${to === "/new-task" ? "h-12 w-12" : "h-6 w-6"}`} />
    </NavLink>
  );
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

function MobileLayout() {
  const navItems = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/ai-chat", icon: SmartToyIcon, label: "AI Chatbot" },
    { to: "/new-task", icon: AddCircleOutlineIcon, label: "Add" },
    { to: "/status", icon: BarChartIcon, label: "Status" },
  ];

  return (
    <div className="flex flex-col max-h-screen min-h-screen bg-background gap-3 p-3">
      <main className="flex flex-col flex-1 gap-3 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="bg-white rounded-full shadow-lg">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ to, icon }) => (
            <NavItem key={to} to={to} icon={icon} />
          ))}

          {/* Disabled User Icon */}
          <div className="flex flex-col items-center p-2 text-gray-300 cursor-not-allowed">
            <PersonIcon className="h-6 w-6" />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default MobileLayout;
