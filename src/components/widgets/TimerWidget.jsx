import { useState, useEffect } from "react";
import { useTasksContext } from "../../contexts/TasksContext";
import toast from "react-hot-toast";

function TimerWidget() {
  const [isEditing, setIsEditing] = useState(false);
  const {
    timer: {
      timeLeft,
      isRunning,
      inputMinutes,
      toggleTimer,
      resetTimer,
      updateTimerMinutes,
    },
  } = useTasksContext();

  // Effect for timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      toggleTimer();
      toast.success("Timer completed!");
    }
  }, [timeLeft, isRunning, toggleTimer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    updateTimerMinutes(value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  const handleToggleTimer = () => {
    toggleTimer();
    if (!isRunning) {
      toast.success("Timer started");
    } else {
      toast.success("Timer paused");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-2xl font-bold">Timer</h2>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          {isEditing ? (
            <input
              type="text"
              value={inputMinutes}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="text-6xl font-mono w-32 text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <div
              className="text-6xl font-mono cursor-pointer"
              onClick={handleTimeClick}
            >
              {formatTime(timeLeft)}
            </div>
          )}
          <div className="mt-4 space-x-2">
            <button
              className={`${
                isRunning
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-accent-primary hover:bg-accent-primary/90"
              } text-gray-900 px-4 py-2 rounded`}
              onClick={handleToggleTimer}
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              className="bg-accent-primary text-gray-900 px-4 py-2 rounded hover:bg-accent-primary/90"
              onClick={resetTimer}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerWidget;
