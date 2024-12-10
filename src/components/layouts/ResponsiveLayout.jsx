import { Routes, Route } from "react-router-dom";
import useScreenSize from "../../hooks/useScreenSize";
import DesktopLayout from "../desktop/DesktopLayout";
import MobileLayout from "../mobile/MobileLayout";
import HomePage from "../desktop/HomePage";
import AiChatPage from "../desktop/AiChatPage";
import MobileHomePage from "../mobile/HomePage";
import MobileAiChatPage from "../mobile/AiChatPage";
import NewTaskPage from "../mobile/NewTaskPage";
import StatusPage from "../mobile/StatusPage";

function ResponsiveLayout() {
  const isMobile = useScreenSize();

  if (isMobile) {
    return (
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<MobileHomePage />} />
          <Route path="ai-chat" element={<MobileAiChatPage />} />
          <Route path="new-task" element={<NewTaskPage />} />
          <Route path="status" element={<StatusPage />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DesktopLayout />}>
        <Route index element={<HomePage />} />
        <Route path="ai-chat" element={<AiChatPage />} />
        <Route path="new-task" element={<HomePage />} />
        <Route path="status" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default ResponsiveLayout;
