import { Pagination } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FaArrowLeft, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useGetAllNotificationsQuery } from "../redux/features/notificationApi";
import CustomLoading from "../utils/CustomLoading";

const NotificationItem = ({ title, time, isNew = false }) => (
  <div
    className={`flex items-center p-4 border-b border-gray-100 transition duration-150 hover:bg-gray-50 ${
      isNew ? "bg-blue-50/50" : ""
    }`}
  >
    <div className="shrink-0 mr-4 text-blue-500">
      <FaBell className="w-6 h-6" />
    </div>

    <div className="grow">
      <p className="text-gray-900 font-medium text-base leading-snug">
        {title}
      </p>
      <p className="text-gray-500 text-sm mt-0.5">{time}</p>
    </div>
  </div>
);

export default function Notifications() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isFetching } = useGetAllNotificationsQuery({
    page: currentPage,
    limit: pageSize,
  });

  const notifications = data?.data?.result || [];
  const totalNotifications = data?.data?.meta?.total || 0;
  const apiCurrentPage = data?.data?.meta?.page || 1;
  const apiPageSize = data?.data?.meta?.limit || 10;

  const formattedNotifications = notifications.map((item) => ({
    id: item._id,
    title: item.message,
    time: dayjs(item.createdAt).format("MMM DD, hh:mm a"),
    isNew: !item.isRead,
  }));

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div className="min-h-screen bg-white mx-auto shadow-lg">
      <header className="flex items-center p-4 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition duration-150"
          aria-label="Go back to previous page"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold ml-4 text-gray-900">
          All Notifications
        </h3>
      </header>

      <div className="divide-y divide-gray-100 min-h-[500px]">
        {isFetching && (
          <div className="flex justify-center items-center h-screen">
            <CustomLoading />
          </div>
        )}

        {!isFetching &&
          formattedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              title={notification.title}
              time={notification.time}
              isNew={notification.isNew}
            />
          ))}

        {!isFetching && formattedNotifications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            You are all caught up! No new notifications.
          </div>
        )}
      </div>

      {!isFetching && totalNotifications > 0 && (
        <div className="flex justify-end p-4 border-t border-gray-200">
          <Pagination
            current={apiCurrentPage}
            pageSize={apiPageSize}
            total={totalNotifications}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            responsive={true}
          />
        </div>
      )}
    </div>
  );
}
