import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import UpsertTaskSection from "../shared/UpsertTaskSection";

function NewTask() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">New Task</h2>
        <button
          onClick={() => navigate("/mobile")}
          className="p-2 hover:bg-accent-primary/10 rounded-full"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>

      <UpsertTaskSection onClose={() => navigate("/mobile")} />
    </div>
  );
}

export default NewTask;
