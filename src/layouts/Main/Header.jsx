import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  // const userName = "Admin";
  const unreadNotifications = 3;

  const avatarUrl = "https://placehold.co/100x100/3B82F6/FFFFFF?text=P";

  return (
    <header className="md:bg-primary w-full h-16 md:h-20 flex items-center justify-between px-4 md:px-8 md:shadow-sm rounded-lg z-50">
      <h1 className="text-white text-lg md:text-2xl font-semibold">
        Welcome back!
      </h1>

      <div className="flex items-center space-x-4 md:space-x-6">
        <button
          className="relative text-white p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
          onClick={() => navigate(`/notifications`)}
          aria-label="View notifications"
        >
          <FaBell size={40} className="w-5 h-5 md:w-6 md:h-6" />

          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full border-2 border-blue-600">
              {unreadNotifications}
            </span>
          )}
        </button>

        <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-full ring-2 ring-white overflow-hidden">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/100x100/3B82F6/FFFFFF?text=P";
            }}
          />
        </div>
      </div>
    </header>
  );
}
