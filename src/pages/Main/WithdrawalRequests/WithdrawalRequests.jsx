import {
  CalendarOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, DatePicker, Input, Modal, Table } from "antd";
import { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import CustomLoading from "../../../utils/CustomLoading";
import { InfoRow } from "../../../utils/utils";

const DUMMY_WITHDRAWAL_DATA = [
  {
    _id: "656e18f8e4e941544a42b15e",
    trId: "12345678",
    providerName: "Henry",
    acctNumber: "548", // Last 3 digits for display
    amount: 9.99,
    date: "29 July 2024",
    status: "Approved",
    // For Modal Details (reusing existing user data fields for a complete example)
    email: "henry@example.com",
    phoneNumber: "+966 555 1234",
    profileImage: "https://i.pravatar.cc/150?img=1",
    location: "Riyadh, Saudi Arabia",
  },
  {
    _id: "656e18f8e4e941544a42b15f",
    trId: "12345679",
    providerName: "Henry",
    acctNumber: "214",
    amount: 9.99,
    date: "29 July 2024",
    status: "Reject",
    email: "maria@example.com",
    phoneNumber: "+966 555 5678",
    profileImage: "https://i.pravatar.cc/150?img=2",
    location: "Jeddah, Saudi Arabia",
  },
  {
    _id: "656e18f8e4e941544a42b160",
    trId: "12345680",
    providerName: "Henry",
    acctNumber: "253",
    amount: 9.99,
    date: "29 July 2024",
    status: "Pending",
    email: "david@example.com",
    phoneNumber: "+966 555 9012",
    profileImage: "https://i.pravatar.cc/150?img=3",
    location: "Dammam, Saudi Arabia",
  },
  {
    _id: "656e18f8e4e941544a42b161",
    trId: "12345681",
    providerName: "Henry",
    acctNumber: "256",
    amount: 9.99,
    date: "29 July 2024",
    status: "Approved",
    email: "sarah@example.com",
    phoneNumber: "+966 555 3456",
    profileImage: "https://i.pravatar.cc/150?img=4",
    location: "Khobar, Saudi Arabia",
  },
  {
    _id: "656e18f8e4e941544a42b162",
    trId: "12345682",
    providerName: "Henry",
    acctNumber: "547",
    amount: 9.99,
    date: "29 July 2024",
    status: "Pending",
    email: "michael@example.com",
    phoneNumber: "+966 555 7890",
    profileImage: "https://i.pravatar.cc/150?img=5",
    location: "Mecca, Saudi Arabia",
  },
  {
    _id: "656e18f8e4e941544a42b163",
    trId: "12345683",
    providerName: "Henry",
    acctNumber: "125",
    amount: 9.99,
    date: "29 July 2024",
    status: "Reject",
    email: "test1@example.com",
    phoneNumber: "+966 555 0001",
    profileImage: "https://i.pravatar.cc/150?img=6",
    location: "Medina, Saudi Arabia",
  },
  {
    _id: "656e18f8e4e941544a42b164",
    trId: "12345684",
    providerName: "Henry",
    acctNumber: "127",
    amount: 9.99,
    date: "29 July 2024",
    status: "Reject",
    email: "test2@example.com",
    phoneNumber: "+966 555 0002",
    profileImage: "https://i.pravatar.cc/150?img=7",
    location: "Taif, Saudi Arabia",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "green";
    case "Reject":
      return "red";
    case "Pending":
      return "orange";
    default:
      return "default";
  }
};

const generateWithdrawalColumns = (showDetails) => [
  {
    title: "#Tr.ID",
    dataIndex: "trId",
    key: "trId",
    render: (text) => (
      <span className="text-gray-900 font-semibold">{text}</span>
    ),
  },
  {
    title: "Providers Name",
    dataIndex: "providerName",
    key: "providerName",
  },
  {
    title: "Acct number",
    dataIndex: "acctNumber",
    key: "acctNumber",
    render: (text) => <span className="font-mono">*** *** *** {text}</span>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => (
      <span className="font-semibold text-gray-700">${amount.toFixed(2)}</span>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date) => <span className="font-medium text-gray-600">{date}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const color = getStatusColor(status);
      return (
        <span
          className={`font-semibold ${
            color === "green"
              ? "text-green-600"
              : color === "red"
              ? "text-red-600"
              : "text-orange-500"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <div
        className="font-semibold cursor-pointer"
        onClick={() => showDetails(record)}
      >
        <CiCircleInfo size={24} color="#1890ff" />
      </div>
    ),
  },
];

export default function WithdrawalRequests() {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isLoading = false;
  const data = {
    data: {
      result: DUMMY_WITHDRAWAL_DATA,
      meta: { total: DUMMY_WITHDRAWAL_DATA.length },
    },
  };

  const withdrawalData = data?.data?.result || [];
  const meta = data?.data?.meta || {};
  const totalItems = meta.total || 0;

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString ? date.format("D MMMM YYYY") : null);
    setCurrentPage(1);
  };

  const handlePageChange = (page, limit) => {
    setCurrentPage(page);
    setPageSize(limit);
  };

  const showDetailsModal = (record) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
  };

  const columns = generateWithdrawalColumns(showDetailsModal);

  const filteredData = withdrawalData?.filter((request) => {
    const textMatch =
      request.providerName.toLowerCase().includes(searchText.toLowerCase()) ||
      request.trId.toLowerCase().includes(searchText.toLowerCase()) ||
      request.acctNumber.toLowerCase().includes(searchText.toLowerCase());

    const dateMatch = !selectedDate || request.date === selectedDate;

    return textMatch && dateMatch;
  });

  const tableDataSource = filteredData || [];

  const modalTitle = (
    <div className="text-center">
      <h3 className="text-sm font-semibold tracking-widest uppercase text-primary">
        Withdrawal Request Details
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
            Withdraw Request
          </h1>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-sm md:max-w-md gap-2">
            <DatePicker
              size="large"
              onChange={handleDateChange}
              placeholder="Date"
              className="shrink-0 w-full sm:w-auto"
              suffixIcon={<CalendarOutlined style={{ color: "#1890ff" }} />}
              format="D MMMM YYYY"
            />

            <Input.Search
              placeholder="Name or ID"
              allowClear
              enterButton={
                <div className="h-full flex items-center justify-center">
                  <UserOutlined className="text-xl" />
                </div>
              }
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
        closeIcon={<CloseOutlined />}
        width={450}
        centered
        className="user-profile-modal"
        footer={
          selectedRequest?.status !== "Approved" &&
          selectedRequest?.status !== "Reject" && (
            <div className="flex justify-center items-center gap-4 p-4 w-[80%] mx-auto">
              <button
                className="bg-red-600 hover:bg-red-600/80 text-white rounded-xl p-2 w-1/2"
                onClick={() => setIsModalVisible(false)}
              >
                Reject
              </button>
              <button
                type="default"
                className="bg-primary hover:bg-primary/80 text-white rounded-xl p-2 w-1/2"
                onClick={() => setIsModalVisible(false)}
              >
                Approved
              </button>
            </div>
          )
        }
      >
        {selectedRequest && (
          <div className="flex flex-col items-center py-4 text-gray-700">
            <Avatar
              size={80}
              src={selectedRequest.profileImage}
              icon={<UserOutlined />}
              className="shadow-xl ring-4 ring-blue-50/50"
            />
            <p className="mt-4 text-xs tracking-wide text-gray-500">
              Details for Transaction ID
            </p>
            <h2 className="text-xl font-bold text-primary mb-6">
              #{selectedRequest.trId}
            </h2>

            <div className="w-full max-w-xs text-left text-base space-y-2">
              <InfoRow
                label="Provider Name"
                value={selectedRequest.providerName}
              />
              <InfoRow
                label="Amount"
                value={`$${selectedRequest.amount.toFixed(2)}`}
              />
              <InfoRow
                label="Account No."
                value={`*** *** *** ${selectedRequest.acctNumber}`}
              />
              <InfoRow label="Request Date" value={selectedRequest.date} />
              <InfoRow label="Status" value={selectedRequest.status} />
              <InfoRow label="Email" value={selectedRequest.email} />
              <InfoRow label="Phone" value={selectedRequest.phoneNumber} />
              <InfoRow label="Location" value={selectedRequest.location} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
