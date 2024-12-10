import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import usePersistedState, { STORAGE_KEYS } from "../hooks/usePersistedState";
import PropTypes from "prop-types";

const TasksContext = createContext();

export function TasksProvider({ children }) {
  // Task states
  const [tasks, setTasks] = usePersistedState(STORAGE_KEYS.TASKS, []);
  const [selectedTaskId, setSelectedTaskId] = usePersistedState(
    STORAGE_KEYS.SELECTED_TASK_ID,
    null
  );

  // Timer states
  const [timeLeft, setTimeLeft] = usePersistedState(
    STORAGE_KEYS.TIMER_TIME_LEFT,
    0
  );
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = usePersistedState(
    STORAGE_KEYS.TIMER_INPUT_MINUTES,
    "0"
  );
  const [totalFocus, setTotalFocus] = usePersistedState(
    STORAGE_KEYS.TIMER_TOTAL_FOCUS,
    0
  );

  // Timer functions
  const updateTimerMinutes = useCallback(
    (minutes) => {
      setInputMinutes(minutes);
      setTimeLeft(parseInt(minutes) * 60);
      setSelectedTaskId(null);
    },
    [setInputMinutes, setTimeLeft, setSelectedTaskId]
  );

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(parseInt(inputMinutes) * 60);
  }, [inputMinutes, setTimeLeft]);

  // Task functions
  const addTask = useCallback(
    (newTask) => {
      const taskWithId = {
        ...newTask,
        id: crypto.randomUUID(),
      };
      setTasks((prev) => [...prev, taskWithId]);
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (taskId, updatedTask) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      );
    },
    [setTasks]
  );

  const updateTaskStatus = useCallback(
    (taskId) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, done: !task.done } : task
        )
      );
    },
    [setTasks]
  );

  const selectTask = useCallback(
    (taskId) => {
      const selectedTask = tasks.find((task) => task.id === taskId);
      if (selectedTask?.duration) {
        setInputMinutes(Math.floor(selectedTask.duration / 60).toString());
        setTimeLeft(selectedTask.duration);
      }
      setSelectedTaskId(taskId);
    },
    [tasks, setInputMinutes, setTimeLeft, setSelectedTaskId]
  );

  const deleteTask = useCallback(
    (taskId) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
    },
    [selectedTaskId, setTasks, setSelectedTaskId]
  );

  // Status getters
  const getTasksDueToday = useCallback(() => {
    const isToday = (dateString) => {
      if (!dateString) return false;
      const today = new Date();
      const date = new Date(dateString);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    return tasks.filter(
      (task) => !task.done && task.deadline && isToday(task.deadline)
    ).length;
  }, [tasks]);

  const getOngoingTasks = useCallback(() => {
    return tasks.filter((task) => !task.done && task.duration > 0).length;
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter((task) => task.done).length;
  }, [tasks]);

  // Timer effects
  useEffect(() => {
    let intervalId;

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((time) => time - 1);
        setTotalFocus((total) => total + 1);
        if (selectedTaskId) {
          const selectedTask = tasks.find((task) => task.id === selectedTaskId);
          if (selectedTask?.duration) {
            updateTask(selectedTaskId, {
              duration: selectedTask.duration - 1,
            });
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    isRunning,
    selectedTaskId,
    setTimeLeft,
    setTotalFocus,
    tasks,
    timeLeft,
    updateTask,
  ]);

  return (
    <TasksContext.Provider
      value={{
        tasks: {
          tasks,
          selectedTaskId,
          addTask,
          updateTask,
          updateTaskStatus,
          selectTask,
          deleteTask,
        },
        timer: {
          timeLeft,
          isRunning,
          inputMinutes,
          toggleTimer,
          resetTimer,
          updateTimerMinutes,
        },
        status: {
          totalFocus,
          get tasksDueToday() {
            return getTasksDueToday();
          },
          get ongoingTasks() {
            return getOngoingTasks();
          },
          get completedTasks() {
            return getCompletedTasks();
          },
        },
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

TasksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
}
