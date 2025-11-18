import {
  CalendarOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, DatePicker, Input, Modal, Table } from "antd";
import { useState } from "react";
// import { useGetAllParentsQuery } from "../../../redux/features/parentsApi/parentsApi"; // Removed Redux/RTK Query
import { CiCircleInfo } from "react-icons/ci";
import CustomLoading from "../../../utils/CustomLoading";
import { InfoRow, NameCell } from "../../../utils/utils";

const DUMMY_USER_DATA = [
  {
    _id: "656e18f8e4e941544a42b15e",
    name: "Henry Smith",
    email: "example@gmail.com",
    phoneNumber: "+966 555 1234",
    profileImage: "https://i.pravatar.cc/150?img=1",
    location: "Riyadh, Saudi Arabia",
    registrationDate: "2024-09-01",
    childs_name: "Alice Smith",
    childs_grade: "Grade 5",
    relationship_with_child: "Father",
    bookedSessions: 12,
  },
  {
    _id: "656e18f8e4e941544a42b15f",
    name: "Maria Garcia",
    email: "example@gmail.com",
    phoneNumber: "+966 555 5678",
    profileImage: "https://i.pravatar.cc/150?img=2",
    location: "Jeddah, Saudi Arabia",
    registrationDate: "2024-09-15",
    childs_name: "Ben Garcia",
    childs_grade: "Grade 7",
    relationship_with_child: "Mother",
    bookedSessions: 8,
  },
  {
    _id: "656e18f8e4e941544a42b160",
    name: "David Lee",
    email: "example@gmail.com",
    phoneNumber: "+966 555 9012",
    profileImage: "https://i.pravatar.cc/150?img=3",
    location: "Dammam, Saudi Arabia",
    registrationDate: "2024-10-05",
    childs_name: "Charlie Lee",
    childs_grade: "Grade 3",
    relationship_with_child: "Guardian",
    bookedSessions: 20,
  },
  {
    _id: "656e18f8e4e941544a42b161",
    name: "Sarah Johnson",
    email: "example@gmail.com",
    phoneNumber: "+966 555 3456",
    profileImage: "https://i.pravatar.cc/150?img=4",
    location: "Khobar, Saudi Arabia",
    registrationDate: "2024-10-20",
    childs_name: "Daisy Johnson",
    childs_grade: "Grade 10",
    relationship_with_child: "Mother",
    bookedSessions: 5,
  },
  {
    _id: "656e18f8e4e941544a42b162",
    name: "Michael Brown",
    email: "example@gmail.com",
    phoneNumber: "+966 555 7890",
    profileImage: "https://i.pravatar.cc/150?img=5",
    location: "Mecca, Saudi Arabia",
    registrationDate: "2024-11-01",
    childs_name: "Ethan Brown",
    childs_grade: "Grade 1",
    relationship_with_child: "Father",
    bookedSessions: 15,
  },
];

// --- UPDATED generateColumns FUNCTION ---
const generateColumns = (showDetails) => [
  {
    title: "SL No.",
    dataIndex: "slNo",
    key: "slNo",
    width: 100,
    render: (_, record, index) => (
      <span className="text-gray-500 font-medium">#{index + 1}</span>
    ),
  },
  {
    title: "User Name",

    dataIndex: "name",
    key: "fullName",
    render: (text, record) => (
      <NameCell name={record.name} avatar={record.profileImage} />
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Location",

    dataIndex: "location",
    key: "location",
  },
  {
    title: "Date",
    dataIndex: "registrationDate",
    key: "registrationDate",
    render: (date) => <span className="font-medium text-gray-600">{date}</span>,
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <div className="font-semibold " onClick={() => showDetails(record)}>
        <CiCircleInfo size={24} />
      </div>
    ),
  },
];

export default function UserManagement() {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- Dummy Data Logic ---
  const isLoading = false;
  const data = {
    data: {
      result: DUMMY_USER_DATA,
      meta: { total: DUMMY_USER_DATA.length },
    },
  };

  const userData = data?.data?.result || [];
  const meta = data?.data?.meta || {};
  const totalItems = meta.total || 0;

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    setCurrentPage(1);
  };

  const handlePageChange = (page, limit) => {
    setCurrentPage(page);
    setPageSize(limit);
  };

  const showDetailsModal = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const columns = generateColumns(showDetailsModal);

  const filteredData = userData?.filter((user) => {
    const textMatch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      user.location.toLowerCase().includes(searchText.toLowerCase());

    const dateMatch = !selectedDate || user.registrationDate === selectedDate;

    return textMatch && dateMatch;
  });

  const tableDataSource = filteredData || [];

  const modalTitle = (
    <div className="text-center">
      <h3 className="text-sm font-semibold tracking-widest uppercase text-primary">
        User's Information
      </h3>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CustomLoading />
      </div>
    );
  }

  return (
    <>
      <div className="p-2 md:p-4 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900 flex items-baseline">
            Users ( {totalItems} )
          </h1>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-sm md:max-w-md gap-2">
            <DatePicker
              size="large"
              onChange={handleDateChange}
              placeholder="Select Date"
              className="shrink-0 w-full sm:w-auto"
              suffixIcon={<CalendarOutlined style={{ color: "#1890ff" }} />}
            />

            <Input.Search
              placeholder="Search by name, phone, or location..."
              allowClear
              enterButton="Search"
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={tableDataSource}
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              showSizeChanger: false,
              onChange: handlePageChange,
            }}
            scroll={{ x: "max-content" }}
            className="w-full"
            rowKey="_id"
            rowClassName={() =>
              "hover:bg-blue-50/50 transition duration-150 ease-in-out cursor-pointer"
            }
          />
        </div>
      </div>

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        closeIcon={<CloseOutlined />}
        width={450}
        centered
        className="user-profile-modal"
      >
        {selectedUser && (
          <div className="flex flex-col items-center py-4 text-gray-700">
            <Avatar
              size={80}
              src={selectedUser.profileImage}
              icon={<UserOutlined />}
              className="shadow-xl ring-4 ring-blue-50/50"
            />
            <p className="mt-4 text-xs tracking-wide text-gray-500">
              See all details about
            </p>
            <h2 className="text-xl font-bold text-primary mb-6">
              {selectedUser.name}
            </h2>

            <div className="w-full max-w-xs text-left text-base space-y-2">
              <InfoRow label="ID" value={selectedUser._id.slice(0, 8)} />
              <InfoRow label="Full name" value={selectedUser.name} />
              <InfoRow label="Email" value={selectedUser.email} />
              <InfoRow label="Phone" value={selectedUser.phoneNumber} />
              <InfoRow label="Location" value={selectedUser.location} />
              <InfoRow label="Date" value={selectedUser.registrationDate} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
