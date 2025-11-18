import { FiPaperclip, FiSend } from "react-icons/fi";

export const ChatInput = ({
  message,
  handleInputChange,
  handleKeyDown,
  handleSend,
  inputRef,
  handleAttachClick,
  fileInputRef,
  handleFileSelect,
}) => {
  const isDisabled = !message.trim();

  return (
    <div className="border-t bg-white p-3 flex items-end gap-2 shrink-0">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="File attachment input"
      />

      {/* Attach Button */}
      <button
        onClick={handleAttachClick}
        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        aria-label="Attach file"
      >
        <FiPaperclip size={20} />
      </button>

      {/* Textarea Input */}
      <textarea
        ref={inputRef}
        rows={1}
        placeholder="Type a message..."
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1 border rounded-2xl px-4 py-2 resize-none outline-none focus:ring-2 focus:ring-blue-400 min-h-10 max-h-[150px] overflow-y-auto transition-shadow"
        aria-label="Message input"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        className={`p-3 rounded-full transition-all ${
          isDisabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        disabled={isDisabled}
        aria-label="Send message"
      >
        <FiSend size={18} />
      </button>
    </div>
  );
};
