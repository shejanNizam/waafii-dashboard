import { createElement, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { MdOutlineArrowRight } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import main_logo from "../../assets/main_logo/main_logo_waafii_sidebar.svg";
import { dashboardItems } from "../../constants/router.constants";
import { logout } from "../../redux/slices/authSlice";
import { routeLinkGenerators } from "../../utils/routeLinkGenerators";

const SubMenu = ({ children, rootPath, location, openName, name, onClose }) => {
  const isSubmenuOpen =
    name === openName?.name ||
    (location.pathname.includes(rootPath) && !openName.name);

  return (
    <div
      className={`pl-8 pr-6 space-y-0.5 transition-all duration-300 overflow-hidden ${
        isSubmenuOpen ? "max-h-96 pt-1" : "max-h-0"
      }`}
    >
      {children?.map(({ subName, subPath, subIcon }, index) => (
        <NavLink
          key={index}
          to={subPath}
          onClick={() => onClose && onClose()}
          className={({ isActive }) =>
            isActive
              ? "bg-primary/70 text-white w-full px-2 py-1 flex items-center justify-start gap-3 transition-all rounded-lg"
              : "text-black hover:text-white hover:bg-primary/70 w-full px-2 py-1 flex items-center justify-start gap-2 transition-all rounded-lg"
          }
        >
          <div className="shrink-0">
            {createElement(subIcon, { size: "17" })}
          </div>
          <span className="text-sm lg:text-base truncate">{subName}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const [openName, setOpenName] = useState({});
  const navigate = useNavigate();

  const handleLogOut = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Sure",
      cancelButtonText: "Cancel",
      showConfirmButton: true,
      confirmButtonColor: "#DC2626",
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
        localStorage.removeItem("token");
        navigate("/auth");
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col border border-gray-200 rounded-xl shadow-md">
      <div className="h-full flex flex-col justify-between bg-hash pt-4 px-4 lg:px-6">
        {/* Logo and Close Button */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center justify-start md:justify-center">
              <img
                src={main_logo}
                className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-20 xl:w-28 xl:h-28  object-contain"
                alt="main_logo_lms"
              />
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <IoClose size={24} className="text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="mt-6 flex-1 overflow-y-auto space-y-1 lg:space-y-2 text-black pr-2 scrollbar-thin">
          {routeLinkGenerators(dashboardItems).map(
            ({ name, icon, path, children, rootPath }, indx) => {
              const isMenuActive =
                name === openName?.name ||
                (location.pathname.includes(rootPath) && !openName.name);

              return children?.length ? (
                <li key={indx} className="overflow-hidden">
                  <button
                    aria-label="Toggle submenu"
                    onClick={() =>
                      setOpenName((c) => ({
                        name: c?.name === name ? null : name,
                      }))
                    }
                    className={`outline-none w-full px-3 lg:px-4 py-2 lg:py-3 flex items-center justify-between gap-2 lg:gap-3 text-base lg:text-lg transition-all rounded-lg ${
                      isMenuActive
                        ? "bg-primary/70 text-white shadow-sm"
                        : "hover:text-white hover:bg-primary/70"
                    }`}
                  >
                    <div className="flex items-center justify-start gap-2 lg:gap-3">
                      <div className="shrink-0">
                        {createElement(icon, { size: "20" })}
                      </div>
                      <span className="truncate">{name}</span>
                    </div>
                    <MdOutlineArrowRight
                      className={`text-black shrink-0 transition-transform duration-300 ${
                        isMenuActive ? "rotate-90" : ""
                      }`}
                      size={20}
                    />
                  </button>
                  <SubMenu
                    children={children}
                    rootPath={rootPath}
                    location={location}
                    openName={openName}
                    name={name}
                    onClose={onClose}
                  />
                </li>
              ) : (
                <li key={indx}>
                  <NavLink
                    to={path}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primary/70 text-white shadow-sm w-full px-3 lg:px-4 py-2 lg:py-3 flex items-center justify-start gap-2 lg:gap-3 text-base lg:text-lg transition-all rounded-lg"
                        : "hover:text-white hover:bg-primary/70 w-full px-3 lg:px-4 py-2 lg:py-3 flex items-center justify-start gap-2 lg:gap-3 text-base lg:text-lg transition-all rounded-lg"
                    }
                  >
                    <div className="shrink-0">
                      {createElement(icon, { size: "20" })}
                    </div>
                    <span className="truncate">{name}</span>
                  </NavLink>
                </li>
              );
            }
          )}
        </ul>

        {/* Logout Button */}
        <div className="py-4 lg:py-6 border-t border-gray-200 mt-4">
          <button
            onClick={handleLogOut}
            className="bg-gray-500 hover:bg-gray-600 text-white w-full px-4 py-3 lg:py-4 flex justify-center items-center gap-2 rounded-lg text-base lg:text-lg transition-colors"
          >
            <BiLogOut className="text-white" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
