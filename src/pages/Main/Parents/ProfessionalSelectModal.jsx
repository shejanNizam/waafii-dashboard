import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, List, message, Modal, Pagination } from "antd";
import { useMemo, useState } from "react";
import { useGetAllProfessionalQuery } from "../../../redux/features/professionalApi/professionalApi";

export default function ProfessionalSelectModal({
  isVisible,
  onClose,
  onProfessionalSelect,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(null);

  const PAGE_LIMIT = 10;

  const { data, isFetching } = useGetAllProfessionalQuery({
    page: currentPage,
    limit: PAGE_LIMIT,
    searchTerm,
  });

  console.log(data);

  const professionals = useMemo(() => data?.data?.result || [], [data]);
  const totalProfessionals = data?.meta?.total || 0;
  console.log(professionals);

  const formattedProfessionals = useMemo(() => {
    return professionals?.map((prof) => ({
      key: prof._id,
      id: prof._id,
      name: prof.name,
      subjects: prof.subjects || [],
      qualification: prof.qualification,
      profileImage: prof.profileImage,
    }));
  }, [professionals]);

  const handleAssignClick = () => {
    const selectedProf = professionals.find(
      (p) => p._id === selectedProfessionalId
    );

    if (selectedProf) {
      onProfessionalSelect({
        _id: selectedProf._id,
        name: selectedProf.name,
        subjects: selectedProf.subjects,
      });
      setSelectedProfessionalId(null);
      setSearchTerm("");
      setCurrentPage(1);
    } else {
      message.warning("Please select a professional first.");
    }
  };

  const handleCancel = () => {
    setSelectedProfessionalId(null);
    setSearchTerm("");
    setCurrentPage(1);
    onClose();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedProfessionalId(null);
  };

  return (
    <Modal
      title="Assign Professional"
      open={isVisible}
      onCancel={handleCancel}
      footer={
        <div className="flex justify-center p-4 pt-0">
          <Button
            type="primary"
            size="large"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold w-full max-w-sm"
            onClick={handleAssignClick}
            disabled={!selectedProfessionalId}
            loading={isFetching}
          >
            Assign
          </Button>
        </div>
      }
      maskClosable={false}
    >
      <div className="p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Available Professionals
        </div>
        <Input
          placeholder="Search by name"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-lg"
          size="large"
        />
      </div>

      <div className="max-h-80 overflow-y-auto">
        <List
          itemLayout="horizontal"
          loading={isFetching}
          dataSource={formattedProfessionals}
          locale={{ emptyText: "No professionals found" }}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer px-4 py-2 transition-all duration-150 ${
                selectedProfessionalId === item.id
                  ? "bg-blue-100 border-l-4 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedProfessionalId(item.id)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.profileImage}
                    icon={<UserOutlined />}
                    className="shrink-0"
                  />
                }
                title={
                  <span className="font-medium text-gray-800">{item.name}</span>
                }
                description={
                  <div className="text-gray-500 text-sm">
                    <p className="m-0">Subjects: {item.subjects.join(", ")}</p>
                    {/* <span className="m-0">ID: #{item.id.slice(-8)}</span> */}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>

      <div className="flex justify-center p-4 border-t border-gray-200">
        <Pagination
          current={currentPage}
          pageSize={PAGE_LIMIT}
          total={totalProfessionals}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </Modal>
  );
}
