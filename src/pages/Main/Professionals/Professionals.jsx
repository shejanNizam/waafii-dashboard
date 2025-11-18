import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useGetAllProfessionalQuery } from "../../../redux/features/professionalApi/professionalApi";
import CustomLoading from "../../../utils/CustomLoading";
import { InfoRow, NameCell } from "../../../utils/utils";

const processProfessionalData = (apiData) => {
  if (!apiData || !apiData.data) return [];
  return apiData.data.result?.map((item, index) => ({
    key: item._id,
    _id: item._id,
    slNo: `#${(index + 1).toString().padStart(4, "0")}`,
    fullName: item.name,
    avatar: item.profileImage,
    email: item.email,
    phoneNumber: item.phoneNumber,
    subjects: item.subjects.join(", "),
    qualification: item.qualification,
    bio: item.bio,
    totalSessions: item.totalSessions || "N/A",
  }));
};

const generateColumns = (showDetails) => [
  {
    title: "SL No.",
    dataIndex: "slNo",
    key: "slNo",
    width: 100,
    render: (text) => <span className="text-gray-500 font-medium">{text}</span>,
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
    render: (_, record) => (
      <NameCell name={record.fullName} avatar={record.avatar} />
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
    title: "Subjects",
    dataIndex: "subjects",
    key: "subjects",
  },

  // with sorter
  {
    title: "Total Sessions",
    dataIndex: "totalSessions",
    key: "totalSessions",
    align: "center",
    sorter: (a, b) => a.totalSessions - b.totalSessions,
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

export default function ProfessionalsList() {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetAllProfessionalQuery({
    searchTerm: searchText,
    page: currentPage,
    limit: pageSize,
  });

  const totalProfessionals = apiResponse?.data?.meta?.total || 0;
  const professionalsData = processProfessionalData(apiResponse);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const showDetailsModal = (record) => {
    setSelectedProfessional(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProfessional(null);
  };

  const columns = generateColumns(showDetailsModal);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // const customFooter = (
  //   <div className="flex flex-col space-y-3 p-4">
  //     <Button
  //       danger
  //       type="default"
  //       className="h-12 border-red-500 text-white bg-red-600 hover:bg-red-700 font-bold text-base rounded-lg"
  //       onClick={() =>
  //         console.log("Removing professional", selectedProfessional.fullName)
  //       }
  //     >
  //       Remove
  //     </Button>
  //   </div>
  // );

  const modalTitle = (
    <div className="text-center">
      <h3 className="text-sm font-semibold tracking-widest uppercase text-blue-600">
        Professional's Information
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
          <h1 className="text-2xl font-bold flex items-baseline">
            Professionals ( {totalProfessionals} )
          </h1>

          <Input.Search
            placeholder="Search by name or subject..."
            allowClear
            enterButton="Search"
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-full max-w-sm sm:max-w-sm md:max-w-md"
          />
        </div>
        <div className="rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={professionalsData}
            loading={isLoading || isFetching}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalProfessionals,
              showSizeChanger: false,
              className: "ant-table-pagination-dark",
            }}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
            className="w-full professional-table"
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
        // footer={customFooter}
        footer={null}
        width={450}
        centered
        className="professional-profile-modal"
      >
        {selectedProfessional && (
          <div className="flex flex-col items-center py-4 text-gray-700 bg-white p-6 rounded-lg ">
            <Avatar
              size={80}
              src={selectedProfessional.avatar}
              icon={<UserOutlined />}
              className="shadow-xl ring-4 ring-blue-50/50"
            />
            <p className="mt-4 text-xs tracking-wide text-gray-500">
              See all details about
            </p>
            <h2 className="text-xl font-bold text-blue-600 mb-6">
              {selectedProfessional.fullName}
            </h2>
            <div className="w-full max-w-xs text-left text-base space-y-2">
              <InfoRow label="SL No." value={selectedProfessional.slNo} />
              <InfoRow
                label="Full name"
                value={selectedProfessional.fullName}
              />
              <InfoRow label="Email" value={selectedProfessional.email} />
              <InfoRow label="Phone" value={selectedProfessional.phoneNumber} />
              <InfoRow label="Subjects" value={selectedProfessional.subjects} />
              <InfoRow
                label="Qualification"
                value={selectedProfessional.qualification}
              />
              <InfoRow label="Bio" value={selectedProfessional.bio || "N/A"} />
              <InfoRow
                label="Sessions"
                value={selectedProfessional.totalSessions}
                valueClass="font-semibold text-blue-600"
              />
              {/* <InfoRow
                label="Location"
                value={selectedProfessional.location || "N/A"}
              /> */}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
