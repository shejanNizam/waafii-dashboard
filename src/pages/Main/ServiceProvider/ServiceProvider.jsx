import { CalendarOutlined, MoreOutlined } from "@ant-design/icons";
import { DatePicker, Dropdown, Input, Menu, Table, Tag } from "antd";
import { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useNavigate } from "react-router";

const DUMMY_PROVIDER_DATA = [
  {
    _id: "p1",
    providerId: "12345678",
    providerName: "Henry",
    serviceName: "Construction & Renovation",
    location: "321/2A city house, District, Country",
    status: "Active",
    date: "2024-11-15",
  },
  {
    _id: "p2",
    providerId: "12345679",
    providerName: "Maria Garcia",
    serviceName: "Shopping Assistance",
    location: "321/2A city house, District, Country",
    status: "Suspended",
    date: "2024-11-10",
  },
  {
    _id: "p3",
    providerId: "12345680",
    providerName: "David Lee",
    serviceName: "Document Handling",
    location: "321/2A city house, District, Country",
    status: "Active",
    date: "2024-11-05",
  },
  {
    _id: "p4",
    providerId: "12345681",
    providerName: "Sarah Johnson",
    serviceName: "Home Cleaning",
    location: "321/2A city house, District, Country",
    status: "Active",
    date: "2024-10-28",
  },
  {
    _id: "p5",
    providerId: "12345682",
    providerName: "Michael Brown",
    serviceName: "Plumbing & Electrical",
    location: "321/2A city house, District, Country",
    status: "Active",
    date: "2024-10-20",
  },
  {
    _id: "p6",
    providerId: "12345683",
    providerName: "Henry",
    serviceName: "Construction & Renovation",
    location: "321/2A city house, District, Country",
    status: "Active",
    date: "2024-10-15",
  },
  {
    _id: "p7",
    providerId: "12345684",
    providerName: "Henry",
    serviceName: "Shopping Assistance",
    location: "321/2A city house, District, Country",
    status: "Active",
    date: "2024-10-01",
  },
  {
    _id: "p8",
    providerId: "12345685",
    providerName: "Maria Garcia",
    serviceName: "Document Handling",
    location: "321/2A city house, District, Country",
    status: "Suspended",
    date: "2024-09-25",
  },
  {
    _id: "p9",
    providerId: "12345686",
    providerName: "David Lee",
    serviceName: "Home Cleaning",
    location: "321/2A city house, District, Country",
    status: "Active",
    date: "2024-09-10",
  },
  {
    _id: "p10",
    providerId: "12345687",
    providerName: "Sarah Johnson",
    serviceName: "Plumbing & Electrical",
    location: "321/2A city house, District, Country",
    status: "Active",
    date: "2024-09-01",
  },
];

const generateColumns = (showDetails, handleStatusToggle) => [
  {
    title: "#Tr.ID",
    dataIndex: "providerId",
    key: "providerId",
    width: 120,
    render: (id) => <span className="font-semibold text-gray-700">{id}</span>,
  },
  {
    title: "Providers Name",
    dataIndex: "providerName",
    key: "providerName",
    render: (text) => <span className="font-medium text-gray-800">{text}</span>,
  },
  {
    title: "Service Name",
    dataIndex: "serviceName",
    key: "serviceName",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    width: 250,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let color = status === "Active" ? "green" : "volcano";
      return (
        <Tag color={color} key={status} className="font-semibold">
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Action",
    key: "action",
    width: 100,
    render: (_, record) => {
      const nextStatusAction =
        record.status === "Active" ? "Suspend" : "Activate";

      const actionMenu = (
        <Menu
          onClick={({ key }) => {
            if (key === "view") {
              showDetails(record);
            } else if (key === "toggle") {
              handleStatusToggle(record);
            }
          }}
          items={[
            {
              key: "view",
              label: "View Details",
              icon: <CiCircleInfo />,
            },
            {
              key: "toggle",
              label: `${nextStatusAction} Provider`,
              danger: record.status === "Active",
            },
          ]}
        />
      );

      return (
        <Dropdown overlay={actionMenu} trigger={["click"]}>
          <a
            className="ant-dropdown-link text-gray-600 hover:text-blue-500 transition-colors"
            onClick={(e) => e.preventDefault()}
            title="More Actions"
          >
            <MoreOutlined style={{ fontSize: "20px" }} />
          </a>
        </Dropdown>
      );
    },
  },
];

export default function ServiceProviderList() {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [providerData, setProviderData] = useState(DUMMY_PROVIDER_DATA);
  const isLoading = false;

  const navigate = useNavigate();

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    setCurrentPage(1);
  };

  const showDetailsPage = (record) => {
    navigate(`/service-providers/${record.providerId}`);
  };

  const handleStatusToggle = (record) => {
    const newStatus = record.status === "Active" ? "Suspended" : "Active";
    console.log(
      `--- API CALL SIMULATION ---
   Provider ID: ${record.providerId}
   New Status: ${newStatus}
   API Endpoint: /api/providers/${record._id}/status`
    );

    setProviderData((prevData) =>
      prevData.map((p) =>
        p._id === record._id ? { ...p, status: newStatus } : p
      )
    );
    alert(
      `Provider ${record.providerName} (${record.providerId}) status updated to ${newStatus} (simulated).`
    );
  };

  const filteredData = providerData.filter((provider) => {
    const searchLower = searchText.toLowerCase();

    const textMatch =
      provider.providerName.toLowerCase().includes(searchLower) ||
      provider.serviceName.toLowerCase().includes(searchLower) ||
      provider.location.toLowerCase().includes(searchLower) ||
      provider.providerId.includes(searchLower);

    const dateMatch = !selectedDate || provider.date === selectedDate;

    return textMatch && dateMatch;
  });

  const columns = generateColumns(showDetailsPage, handleStatusToggle);
  const totalItems = filteredData.length;

  return (
    <>
      <div className="p-2 md:p-4 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">
            All Service Providers List ( {totalItems} )
          </h1>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-sm md:max-w-lg gap-2">
            <DatePicker
              size="large"
              onChange={handleDateChange}
              placeholder="Select Date"
              className="shrink-0 w-full sm:w-auto"
              suffixIcon={<CalendarOutlined style={{ color: "#1890ff" }} />}
            />

            <Input.Search
              placeholder="User Name, ID, or Location"
              allowClear
              enterButton
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
            dataSource={filteredData}
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              onChange: (page, limit) => {
                setCurrentPage(page);
                setPageSize(limit);
              },
            }}
            scroll={{ x: "max-content" }}
            className="w-full"
            rowKey="_id"
          />
        </div>
      </div>
    </>
  );
}
