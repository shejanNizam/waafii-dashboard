import { useCallback, useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import {
  useGetAllConversationsQuery,
  useGetAllMessagesQuery,
  useSendFileMutation,
  useSendMessageMutation,
} from "../../../redux/features/messageApi/messageApi";

import main_logo from "../../../assets/main_logo/main_logo_lms.svg";
import { ChatInput } from "./ChatInput";
import ChatMessages from "./ChatMessages";
import MessageSidebar from "./MessageSidebar";

export default function Message({ type }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const sidebarRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const conversionId = selectedUser?._id;

  const { data: conversation } = useGetAllConversationsQuery({ type });
  const [sendMessage] = useSendMessageMutation();
  const [sendFile] = useSendFileMutation();

  const list = conversation?.data || [];

  const {
    data: fetchedMessagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = useGetAllMessagesQuery({ conversionId }, { skip: !conversionId });

  const remoteMessages = fetchedMessagesData?.data?.data?.messages || [];
  // console.log(remoteMessages);

  const formattedRemoteMessages = remoteMessages?.map((msg) => ({
    id: msg._id,
    text: msg.message_text,
    sender: msg.sender_id,
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    attachment: msg.attachment_id,
  }));

  const combinedMessages = [...formattedRemoteMessages, ...localMessages].sort(
    (a, b) => {
      if (a.id < 0 && b.id < 0) {
        return b.id - a.id;
      }
      return String(a.id).localeCompare(String(b.id));
    }
  );

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [combinedMessages.length, selectedUser]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        isSidebarOpen &&
        window.innerWidth < 640
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidebarOpen]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      inputRef.current?.focus();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleSend = useCallback(async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage && !fileToUpload) return;
    if (!conversionId) return;

    const isFileMessage = !!fileToUpload;

    const newMessage = {
      id: Date.now() * -1,
      text: trimmedMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      attachment: isFileMessage
        ? { name: fileToUpload.name, status: "sending" }
        : null,
    };
    setLocalMessages((prev) => [...prev, newMessage]);

    try {
      if (isFileMessage) {
        const formData = new FormData();

        formData.append("images", fileToUpload);

        const jsonData = {
          msgType: "attachments",
          message_text: trimmedMessage || undefined,
        };

        formData.append("data", JSON.stringify(jsonData));

        await sendFile({ conversionId, formData }).unwrap();
      } else if (trimmedMessage) {
        const data = { message_text: trimmedMessage, msgType: "text" };
        await sendMessage({ conversionId, data }).unwrap();
      }

      setMessage("");
      setFileToUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (inputRef.current) {
        inputRef.current.style.height = "40px";
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Failed to send message/file:", error);
      setLocalMessages((prev) =>
        prev.filter((msg) => msg.id !== newMessage.id)
      );
    }
  }, [message, fileToUpload, conversionId, sendMessage, sendFile]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "40px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const handleSelectUser = (item) => {
    setSelectedUser(item);
    setLocalMessages([]);
    setFileToUpload(null);
    setIsSidebarOpen(false);
  };

  const displayUser = selectedUser?.users?.[0]?.roleId;

  return (
    <div className="relative flex h-[80vh] bg-white shadow-2xl rounded-xl overflow-hidden">
      <button
        className={`absolute top-3 right-3 sm:hidden p-2 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-100 transition z-50 ${
          isSidebarOpen ? "opacity-0 pointer-events-none" : ""
        }`}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open Chats"
      >
        <FiMenu size={20} />
      </button>

      {/* Sidebar Component (existing) */}
      <MessageSidebar
        type={type}
        list={list}
        selectedUser={selectedUser}
        handleSelectUser={handleSelectUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sidebarRef={sidebarRef}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
        {selectedUser ? (
          <>
            <div className="flex items-center justify-between p-4 bg-white border-b shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={displayUser?.profileImage || main_logo}
                  alt={displayUser?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {displayUser?.name || "N/A"}
                  </h4>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            {isMessagesError && !isMessagesLoading ? (
              <div className="flex-1 flex items-center justify-center text-red-500 p-4">
                <p>🚨 Error loading messages. Please try again.</p>
              </div>
            ) : (
              <ChatMessages
                messages={combinedMessages}
                bottomRef={bottomRef}
                isLoading={isMessagesLoading}
                selectedUser={selectedUser}
              />
            )}

            {/* File Preview */}
            {fileToUpload && (
              <div className="p-2 px-4 bg-yellow-50 text-sm text-yellow-700 border-t border-yellow-200 flex justify-between items-center">
                <span>
                  File selected: **{fileToUpload.name}**{" "}
                  {message.trim()
                    ? " (with caption)"
                    : " (Type caption or send)"}
                </span>
                <button
                  onClick={() => {
                    setFileToUpload(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-yellow-900 hover:text-red-600 font-semibold ml-4"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Input Area */}
            <ChatInput
              message={message}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              handleSend={handleSend}
              inputRef={inputRef}
              handleAttachClick={handleAttachClick}
              fileInputRef={fileInputRef}
              handleFileSelect={handleFileSelect}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500/80 text-lg p-4 text-center">
            <h2 className="text-2xl font-light mb-2">Welcome to your Inbox</h2>
            <p>
              Select a **{type === "group" ? "group" : "chat"}** from the
              sidebar to start messaging 💬
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
