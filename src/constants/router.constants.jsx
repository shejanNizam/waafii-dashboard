import { CiSettings, CiUser } from "react-icons/ci";
import { RiDashboardHorizontalLine } from "react-icons/ri";

import { FaServicestack } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { MdOutlineSecurityUpdateWarning } from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import Notifications from "../components/Notifications";
import DashboardHome from "../pages/Main/DashboardHome/DashboardHome";
import AssignedProfessional from "../pages/Main/Parents/AssignedProfessional";
import ServiceProvider from "../pages/Main/ServiceProvider/ServiceProvider";
import UserManagement from "../pages/Main/UserManagement/UserManagement";
import WithdrawalRequests from "../pages/Main/WithdrawalRequests/WithdrawalRequests";
import About from "../pages/Settings/About";
import EditAbout from "../pages/Settings/EditAbout";
import EditMyProfile from "../pages/Settings/EditMyProfile";
import EditPrivacyPolicy from "../pages/Settings/EditPrivacyPolicy";
import EditTermsConditions from "../pages/Settings/EditTermsConditions";
import MyProfile from "../pages/Settings/MyProfile";
import PrivacyPolicy from "../pages/Settings/PrivacyPolicy";
import TermsConditions from "../pages/Settings/TermsConditions";

export const dashboardItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: RiDashboardHorizontalLine,
    element: <DashboardHome />,
  },
  {
    path: "notifications",
    element: <Notifications />,
  },
  {
    name: "User Management",
    path: "user-management",
    icon: LuUsers,
    element: <UserManagement />,
  },
  {
    name: "Service Providers",
    path: "service-providers",
    icon: LuUsers,
    element: <ServiceProvider />,
  },
  {
    name: "Withdrawal Requests",
    path: "withdrawal-requests",
    icon: LuUsers,
    element: <WithdrawalRequests />,
  },
  {
    path: "parents/assigned-professional/:id",
    icon: LuUsers,
    element: <AssignedProfessional />,
  },

  // {
  //   name: "Sessions",
  //   path: "sessions",
  //   icon: FaRegClock,
  //   element: <Sessions />,
  // },
  // {
  //   name: "Parents",
  //   path: "parents",
  //   icon: LuUsers,
  //   element: <Parents />,
  // },
  // {
  //   path: "parents/assigned-professional/:id",
  //   icon: LuUsers,
  //   element: <AssignedProfessional />,
  // },
  // {
  //   name: "Professionals",
  //   path: "professionals",
  //   icon: LuBookUser,
  //   element: <Professionals />,
  // },
  // {
  //   name: "Resources",
  //   path: "resources",
  //   icon: GrResources,
  //   element: <Resources />,
  // },
  // {
  //   path: "resources/subject/:id",
  //   element: <Subjects />,
  // },
  // {
  //   path: "resources/materials/:id",
  //   element: <Materials />,
  // },
  // {
  //   name: "Calendar",
  //   path: "calendar",
  //   icon: MdOutlineEditCalendar,
  //   element: <Calendar />,
  // },
  // {
  //   name: "Message",
  //   path: "message",
  //   icon: FaRegMessage,
  //   element: <TabbedMessage />,
  // },
  {
    name: "Settings",
    rootPath: "settings",
    icon: CiSettings,
    children: [
      {
        name: "Profile",
        path: "settings/profile",
        icon: CiUser,
        element: <MyProfile />,
      },
      {
        path: "settings/profile/edit",
        element: <EditMyProfile />,
      },
      {
        name: "About Us",
        icon: FaServicestack,
        path: "settings/about",
        element: <About />,
      },
      {
        path: "settings/about/edit",
        element: <EditAbout />,
      },
      {
        name: "Terms & Services",
        icon: TbAirConditioning,
        path: "settings/terms",
        element: <TermsConditions />,
      },
      {
        path: "settings/terms/edit",
        element: <EditTermsConditions />,
      },
      {
        name: "Privacy Policy",
        icon: MdOutlineSecurityUpdateWarning,
        path: "settings/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "settings/privacy/edit",
        element: <EditPrivacyPolicy />,
      },
    ],
  },
];
