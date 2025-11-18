import { FiDownload } from "react-icons/fi";
import { useSelector } from "react-redux";
import main_logo from "../../../assets/main_logo/main_logo_lms.svg";
import CustomLoading from "../../../utils/CustomLoading";

const MessageBubble = ({ message, isMe, displayUserImage, displayName }) => {
  const attachment = message?.attachment?.[0];
  console.log(message);

  const isImage = attachment?.mimeType?.startsWith("image/");
  const fileName =
    attachment?.fileUrl?.split("/").pop() ||
    attachment?.name ||
    "File Download";
  const fileExtension = fileName.split(".").pop();

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
      {!isMe && (
        <img
          src={displayUserImage || main_logo}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover mr-2 shrink-0 mt-auto"
        />
      )}

      <div
        className={`flex flex-col max-w-xs sm:max-w-md ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-xl text-sm shadow-md wrap-break-word transition-colors 
            ${
              isMe
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
            }`}
        >
          {attachment && (
            <div
              className={`
                ${
                  isImage
                    ? "p-0 mb-2 rounded-lg overflow-hidden"
                    : "p-2 mb-2 border border-dashed rounded"
                }
                ${
                  isMe
                    ? "bg-blue-700/20 text-white"
                    : "bg-gray-50 text-gray-700"
                }
            `}
            >
              {isImage ? (
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={attachment.fileUrl}
                    alt={fileName}
                    className="max-h-48 w-full object-cover cursor-pointer"
                  />
                </a>
              ) : (
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-2 rounded transition-colors ${
                    isMe ? "hover:bg-blue-700" : "hover:bg-gray-100"
                  }`}
                  download
                >
                  <FiDownload size={18} className="shrink-0 text-white" />
                  <div className="min-w-0">
                    <p
                      className={`font-medium truncate ${
                        isMe ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {fileName.length > 25
                        ? `${fileName.substring(0, 22)}...${fileExtension}`
                        : fileName}
                    </p>
                    <p
                      className={`text-xs capitalize ${
                        isMe ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      {fileExtension} File
                    </p>
                  </div>
                </a>
              )}

              {attachment.isOptimistic && (
                <p
                  className={`text-xs mt-1 italic ${
                    isMe ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  Sending...
                </p>
              )}
            </div>
          )}

          {message.text && (
            <p className={`${attachment ? "mt-1" : ""}`}>{message.text}</p>
          )}
        </div>

        <p className={`mt-1 text-xs text-gray-500 ${isMe ? "mr-1" : "ml-1"}`}>
          {message.time}
          {/* {new Date().toLocaleString()} */}
        </p>
      </div>
    </div>
  );
};

export default function ChatMessages({
  messages,
  bottomRef,
  isLoading,
  selectedUser,
}) {
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?._id;
  const displayUser = selectedUser?.users?.[0]?.roleId;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-gray-500">
        <CustomLoading />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-gray-500/80">
        <p>No messages yet. Start the conversation! 🚀</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages?.map((message) => {
        const isMe =
          (message?.sender?._id && message.sender._id === currentUserId) ||
          (typeof message.sender === "string" &&
            message.sender === currentUserId);

        return (
          <MessageBubble
            key={message._id}
            message={message}
            isMe={isMe}
            displayUserImage={displayUser?.profileImage}
            displayName={displayUser?.name}
          />
        );
      })}
      <div ref={bottomRef} className="pt-1" />
    </div>
  );
}
