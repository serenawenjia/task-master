import { HashRouter } from "react-router-dom";
import ResponsiveLayout from "./components/layouts/ResponsiveLayout";
import { TasksProvider } from "./contexts/TasksContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <TasksProvider>
      <HashRouter>
        <ResponsiveLayout />
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </HashRouter>
    </TasksProvider>
  );
}

export default App;
