import { useState, useEffect } from "react";

export const STORAGE_KEYS = {
  TIMER_TIME_LEFT: "timer-time-left",
  TIMER_INPUT_MINUTES: "timer-input-minutes",
  TIMER_TOTAL_FOCUS: "timer-total-focus",
  TASKS: "tasks",
  SELECTED_TASK_ID: "selected-task-id",
  CHAT_MESSAGES: "chat-messages",
};

function usePersistedState(key, initialValue) {
  // Initialize state with value from localStorage or initial value
  const [state, setState] = useState(() => {
    try {
      const savedValue = localStorage.getItem(key);
      return savedValue ? JSON.parse(savedValue) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistedState;
