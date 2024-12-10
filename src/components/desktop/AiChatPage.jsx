import AiChatWindow from "../shared/AiChatWindow";
import ChatIcon from "@mui/icons-material/Chat";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import WidgetWrapper from "../shared/WidgetWrapper";

function AiChat() {
  return (
    <>
      {/* Left 2 columns - Chat List */}
      <div className="col-span-2 h-[calc(100vh-2rem)]">
        <WidgetWrapper>
          <h2 className="text-2xl font-bold mb-6">Chats</h2>

          <div className="flex-1 overflow-y-auto">
            {/* Current Section */}
            <div className="mb-6 p-3 bg-accent-secondary rounded-lg cursor-pointer">
              <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                <ChatIcon className="w-4 h-4 text-black" /> CURRENT
              </h3>
            </div>

            {/* Favorites Section - Disabled */}
            <div className="mb-6 p-3 rounded-lg opacity-50 cursor-not-allowed">
              <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                <StarIcon className="w-4 h-4 text-black" /> FAVORITES
              </h3>
            </div>

            {/* Trash Section - Disabled */}
            <div className="p-3 rounded-lg opacity-50 cursor-not-allowed">
              <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                <DeleteIcon className="w-4 h-4 text-black" /> TRASH
              </h3>
            </div>
          </div>
        </WidgetWrapper>
      </div>

      {/* Right 6 columns - Chat Window */}
      <div className="col-span-6 h-[calc(100vh-2rem)]">
        <WidgetWrapper>
          <AiChatWindow />
        </WidgetWrapper>
      </div>
    </>
  );
}

export default AiChat;
