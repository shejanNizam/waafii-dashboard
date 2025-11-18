import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetAllParentsQuery } from "../../../redux/features/parentsApi/parentsApi";
import CustomLoading from "../../../utils/CustomLoading";
import { InfoRow, NameCell } from "../../../utils/utils";

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
    title: "Full Name",
    dataIndex: "name",
    key: "fullName",
    render: (text, record) => (
      <NameCell name={record.name} avatar={record.profileImage} />
    ),
  },
  {
    title: "Child's Name",
    dataIndex: "childs_name",
    key: "childs_name",
  },
  {
    title: "Child's Grade",
    dataIndex: "childs_grade",
    key: "childs_grade",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Relationship",
    dataIndex: "relationship_with_child",
    key: "relationship_with_child",
    render: (relationship) => (
      <span className="font-semibold text-green-600">{relationship}</span>
    ),
  },
  {
    title: "Booked Sessions",
    dataIndex: "bookedSessions",
    key: "bookedSessions",
    align: "center",
    sorter: (a, b) => a.bookedSessions - b.bookedSessions,
    render: (sessions) => (
      <span className="font-semibold text-blue-600">{sessions}</span>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button
        type="primary"
        className="bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md"
        onClick={() => showDetails(record)}
      >
        View Profile
      </Button>
    ),
  },
];

export default function Parents() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetAllParentsQuery({
    searchTerm: searchText,
    page: currentPage,
    limit: pageSize,
  });

  console.log(data?.data);

  const parentData = data?.data?.result || [];
  const meta = data?.data?.meta || {};
  const totalItems = meta.total || 0;

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page, limit) => {
    setCurrentPage(page);
    setPageSize(limit);
  };

  const showDetailsModal = (record) => {
    setSelectedParent(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedParent(null);
  };

  const columns = generateColumns(showDetailsModal);

  const filteredData = parentData?.filter(
    (parent) =>
      parent.name.toLowerCase().includes(searchText.toLowerCase()) ||
      parent.phoneNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const tableDataSource = filteredData || [];

  const customFooter = (
    <div className="flex flex-col space-y-3 p-4">
      <Button
        type="primary"
        className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg"
        onClick={() => navigate(`assigned-professional/${selectedParent?._id}`)}
      >
        View Assigned Professional
      </Button>
      {/* <Button
        danger
        type="default"
        className="h-12 border-red-500 text-red-500 hover:border-red-600 hover:text-red-600 font-bold text-base rounded-lg"
        onClick={() => console.log("Removing parent", selectedParent.name)}
      >
        Remove
      </Button> */}
    </div>
  );

  const modalTitle = (
    <div className="text-center">
      <h3 className="text-sm font-semibold tracking-widest uppercase text-blue-600">
        Parent's Information
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
            Parents ( {totalItems} )
          </h1>

          <Input.Search
            placeholder="Search by name or phone number..."
            allowClear
            enterButton="Search"
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-full max-w-sm sm:max-w-sm md:max-w-md"
          />
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
        footer={customFooter}
        closeIcon={<CloseOutlined />}
        width={450}
        centered
        className="parent-profile-modal"
      >
        {selectedParent && (
          <div className="flex flex-col items-center py-4 text-gray-700">
            <Avatar
              size={80}
              src={selectedParent.profileImage}
              icon={<UserOutlined />}
              className="shadow-xl ring-4 ring-blue-50/50"
            />
            <p className="mt-4 text-xs tracking-wide text-gray-500">
              See all details about
            </p>
            <h2 className="text-xl font-bold text-primary mb-6">
              {selectedParent.name}
            </h2>

            <div className="w-full max-w-xs text-left text-base space-y-2">
              <InfoRow label="ID" value={selectedParent._id.slice(0, 8)} />
              <InfoRow label="Full name" value={selectedParent.name} />
              <InfoRow label="Phone" value={selectedParent.phoneNumber} />
              <InfoRow
                label="Child's Name"
                value={selectedParent.childs_name}
              />
              <InfoRow
                label="Child's Grade"
                value={selectedParent.childs_grade}
              />
              <InfoRow
                label="Relationship"
                value={selectedParent.relationship_with_child}
              />
              <InfoRow
                label="B. Sessions"
                value={selectedParent.bookedSessions}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
