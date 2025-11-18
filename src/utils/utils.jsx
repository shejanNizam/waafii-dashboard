import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="flex items-center space-x-4 p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition duration-300 hover:shadow-xl">
    <div
      className={`p-4 rounded-2xl ${
        colorClass || "bg-gray-100 text-gray-600"
      } shrink-0`}
    >
      {Icon && <Icon className="w-8 h-8 md:w-10 md:h-10" aria-label={title} />}
    </div>
    <div>
      <p className="text-lg font-semibold text-gray-500 truncate">{title}</p>
      <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export const NameCell = ({ name, avatar }) => (
  <div className="flex items-center space-x-2">
    <Avatar
      size="small"
      src={avatar}
      alt={name}
      icon={<UserOutlined />}
      className="shrink-0"
    />
    <span className="text-gray-800 font-medium pl-1 ">{name}</span>
  </div>
);

export const InfoRow = ({ label, value }) => (
  <div className="flex">
    <span className="w-24 font-semibold">{label}</span>
    <span className="mx-2">:</span>
    <span className="1 font-medium">{value}</span>
  </div>
);
