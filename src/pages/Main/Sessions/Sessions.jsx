import { Input, Table } from "antd";
import { useMemo, useState } from "react";
import { useGetAllSessionQuery } from "../../../redux/features/sessionApi/sessionApi";
import { NameCell } from "../../../utils/utils";

const getStatusStyles = (status) => {
  switch (status) {
    case "Upcoming":
      return {
        className: "bg-orange-200 text-orange-600",
        borderColor: "#FCD34D",
      };
    case "Completed":
      return {
        className: "bg-[#305CDE]/50 text-[#305CDE]",
        borderColor: "#305CDE",
      };
    case "Canceled":
      return {
        className: "bg-red-100 text-red-700",
        borderColor: "#FF0000",
      };
    default:
      return {
        className: "bg-gray-100 text-gray-700",
        borderColor: "#D1D5DB",
      };
  }
};

const columns = [
  {
    title: "Session ID",
    dataIndex: "code",
    key: "code",
    width: 120,
    render: (text) => (
      <span className="text-gray-500 font-medium">#{text}</span>
    ),
  },
  {
    title: "Professional Name",
    key: "professionalName",
    render: (_, record) => (
      <NameCell
        name={record?.professional?.name}
        avatar={record?.professional?.profileImage}
      />
    ),
  },
  {
    title: "Parent Name",
    key: "parentName",
    render: (_, record) => (
      <NameCell
        name={record?.parent?.name}
        avatar={record?.parent?.profileImage}
      />
    ),
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
    responsive: ["lg"],
  },
  {
    title: "Date & Time",
    dataIndex: "createdAt",
    key: "dateTime",
    render: (isoDate) => {
      if (!isoDate) return "N/A";
      const date = new Date(isoDate);
      return (
        date.toLocaleDateString() +
        " at " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const styles = getStatusStyles(status);

      return (
        <button
          disabled
          key={status}
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${styles.className} border w-32`}
          style={{
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: styles.borderColor,
            minWidth: "30px",
          }}
        >
          {status}
        </button>
      );
    },
  },
];

export default function Sessions() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetAllSessionQuery({
    searchTerm: searchText,
    page: currentPage,
    limit: pageSize,
  });

  const meta = data?.meta || {};
  const totalItems = meta?.total || 0;

  const tableDataSource = useMemo(() => {
    const sessionsData = data?.data || [];
    return sessionsData.map((item) => ({
      ...item,
      key: item?._id,
    }));
  }, [data]);

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page, limit) => {
    setCurrentPage(page);
    setPageSize(limit);
  };

  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>

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
        />
      </div>
    </div>
  );
}
