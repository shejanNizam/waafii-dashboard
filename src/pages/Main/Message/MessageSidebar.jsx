import { FiX } from "react-icons/fi";
import main_logo from "../../../assets/main_logo/main_logo_lms.svg";

export default function MessageSidebar({
  type,
  list,
  selectedUser,
  handleSelectUser,
  isSidebarOpen,
  setIsSidebarOpen,
  sidebarRef,
}) {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed sm:static top-0 left-0 h-full sm:h-auto w-3/4 sm:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="p-4 border-b bg-white flex justify-between items-center shrink-0">
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {type === "group" ? "Groups" : "Chats"}
          </h3>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="sm:hidden text-gray-600 hover:text-gray-800 p-1"
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {list?.length > 0 ? (
            list.map((item) => {
              const { name, profileImage } = item?.users[0]?.roleId || {};
              const lastMessageText =
                item.last_message?.message_text || "Start a chat...";
              const lastMessageTime = formatTime(item.last_message?.createdAt);

              return (
                <li
                  key={item?._id}
                  onClick={() => handleSelectUser(item)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer border-b hover:bg-gray-100 transition-colors ${
                    selectedUser?._id === item?._id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                  aria-current={
                    selectedUser?._id === item._id ? "true" : "false"
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={profileImage ? profileImage : main_logo}
                      alt={name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">
                        {name ? name : "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 truncate w-full">
                        {lastMessageText}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-1">
                    {lastMessageTime}
                  </span>
                </li>
              );
            })
          ) : (
            <li className="p-4 text-center text-gray-500">
              No {type === "group" ? "groups" : "chats"} found.
            </li>
          )}
        </ul>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 sm:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}
