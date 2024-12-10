import { useState, useRef, useEffect } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ReactMarkdown from "react-markdown";
import usePersistedState, { STORAGE_KEYS } from "../../hooks/usePersistedState";
import { useTasksContext } from "../../contexts/TasksContext";
import toast from "react-hot-toast";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

let MAX_TOKENS = 4096;
const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "system",
    content:
      "Break down tasks provided by the user into steps. Reply with the following format strictly: Number. - **Title**: title, - **Description**: description, - **Duration**: duration minutes (with 1 value)",
  },
  {
    id: 2,
    role: "assistant",
    content: "Welcome! Describe your task, and I'll break it down into steps!",
  },
  { id: 3, role: "user", content: "How to make glazed salmon in 3 steps?" },
  {
    id: 4,
    role: "assistant",
    content:
      "1. - **Title**: Prepare Ingredients  \n   - **Description**: Gather all necessary ingredients including salmon fillets, soy sauce, honey, garlic, and lemon juice. Measure them according to your recipe's requirements.  \n   - **Duration**: 10 minutes  \n\n2. - **Title**: Make the Glaze  \n   - **Description**: In a small bowl, mix soy sauce, honey, minced garlic, and lemon juice. Stir until the honey is completely dissolved and the mixture is smooth.  \n   - **Duration**: 5 minutes  \n\n3. - **Title**: Cook the Salmon  \n   - **Description**: Preheat a skillet over medium heat. Place the salmon fillets in the skillet and pour the glaze over them. Cook for about 5-7 minutes on each side, or until the salmon is cooked through and the glaze is caramelized.  \n   - **Duration**: 15 minutes  ",
  },
];

function AiChatWindow() {
  const messagesContainerRef = useRef(null);
  const [messages, setMessages] = usePersistedState(
    STORAGE_KEYS.CHAT_MESSAGES,
    INITIAL_MESSAGES
  );

  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    tasks: { addTask },
  } = useTasksContext();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleRegenerate = async (messageId) => {
    if (isLoading) return;

    try {
      setError("");
      setIsLoading(true);

      // Find the last user message before this assistant message
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      const previousMessages = messages.slice(0, messageIndex);
      const lastUserMessage = [...previousMessages]
        .reverse()
        .find((m) => m.role === "user");

      if (!lastUserMessage) return;

      // Prepare messages for API
      const apiMessages = messages
        .slice(0, messageIndex)
        .filter((m) => m.role !== "error")
        .map(({ role, content }) => ({ role, content }));

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: apiMessages,
            temperature: 0.5,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        // Replace the old assistant message with the new one
        setMessages((prev) => [
          ...prev.slice(0, messageIndex),
          {
            id: messageId,
            role: "assistant",
            content: data.choices[0].message.content,
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTasks = (content) => {
    try {
      // Split content by numbered items (1., 2., etc)
      const taskGroups = content.split(/\d+\./);
      const tasks = [];

      // Process each task group
      taskGroups.forEach((group) => {
        if (!group.trim()) return; // Skip empty groups

        // Extract values using regex
        const titleMatch = group.match(/\*\*Title\*\*:\s*([^\n]+)/);
        const descriptionMatch = group.match(/\*\*Description\*\*:\s*([^\n]+)/);
        const durationMatch = group.match(/\*\*Duration\*\*:\s*(\d+)/);

        if (titleMatch) {
          const task = {
            title: titleMatch[1].trim(),
            description: descriptionMatch ? descriptionMatch[1].trim() : "",
            duration: durationMatch ? parseInt(durationMatch[1]) * 60 : 0, // Convert to seconds
            done: false,
            tags: ["AI Generated"],
          };
          tasks.push(task);
        }
      });

      // Add all valid tasks
      if (tasks.length === 0) {
        toast.error("No valid tasks found in the response");
        return;
      }

      tasks.forEach((task) => {
        addTask(task);
      });

      // Show success toast
      toast.success(
        `Added ${tasks.length} task${tasks.length === 1 ? "" : "s"}`
      );

      // Clear any previous error
      setError("");
    } catch (err) {
      console.error("Failed to parse tasks:", err);
      toast.error("Failed to parse tasks from the response");
      setError("Failed to parse tasks from the response");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    try {
      setError("");
      setIsLoading(true);

      // Add user message
      const userMessage = {
        id: messages.length + 1,
        role: "user",
        content: newMessage,
      };
      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");

      // Prepare messages for API
      const apiMessages = messages
        .filter((m) => m.role !== "error")
        .map(({ role, content }) => ({ role, content }));
      apiMessages.push({ role: "user", content: userMessage.content });

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: apiMessages,
            temperature: 0.5,
            max_tokens: MAX_TOKENS,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const aiMessage = {
          id: messages.length + 2,
          role: "assistant",
          content: data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again later.");
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          role: "error",
          content: "Failed to get response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    toast.success("Chat history cleared");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Title Section */}
      <div className="flex-none flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-secondary rounded-full flex items-center justify-center">
            <SmartToyIcon className="w-6 h-6 text-gray-800" />
          </div>
          <h2 className="text-xl font-semibold">TaskMaster Bot</h2>
        </div>
        <button
          onClick={handleClearHistory}
          className="p-2 hover:bg-accent-secondary rounded-full transition-colors"
          title="Clear chat history"
        >
          <DeleteSweepIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages Section */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages
            .filter((message) => message.role !== "system")
            .map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-accent-primary text-gray-800"
                      : message.role === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-accent-secondary text-gray-800"
                  }`}
                >
                  <div className="markdown prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  {message.role === "assistant" &&
                    message.id !== INITIAL_MESSAGES[1].id && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleRegenerate(message.id)}
                          className="p-2 hover:bg-accent-primary/20 rounded-full disabled:opacity-50"
                          title="Regenerate response"
                          disabled={isLoading}
                        >
                          <RefreshIcon className="w-5 h-5 text-gray-900" />
                        </button>
                        <button
                          onClick={() => handleCopy(message.content)}
                          className="p-2 hover:bg-accent-primary/20 rounded-full"
                          title="Copy to clipboard"
                        >
                          <ContentCopyIcon className="w-5 h-5 text-gray-900" />
                        </button>
                        <button
                          onClick={() => handleAddTasks(message.content)}
                          className="p-2 hover:bg-accent-primary/20 rounded-full"
                          title="Add as tasks"
                        >
                          <PlaylistAddIcon className="w-5 h-5 text-gray-900" />
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          {isLoading && (
            <div className="text-center text-gray-500">Thinking...</div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                {error}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="flex-none border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-accent-primary p-2.5 rounded-full hover:bg-accent-primary/80 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <SendIcon className="w-5 h-5 text-gray-800" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AiChatWindow;
