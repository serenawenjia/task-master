import { BrowserRouter } from "react-router-dom";
import ResponsiveLayout from "./components/layouts/ResponsiveLayout";
import { TasksProvider } from "./contexts/TasksContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <TasksProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </TasksProvider>
  );
}

export default App;
