import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { useCallback, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";
import {
  useAssignedProfessionalMutation,
  useGetParentProfessionalsQuery,
  useRemoveProfessionalMutation,
} from "../../../redux/features/parentsApi/parentsApi";
import { ErrorSwal, SuccessSwal } from "../../../utils/allSwalFire";
import CustomLoading from "../../../utils/CustomLoading";
import { NameCell } from "../../../utils/utils";
import CodeAssignmentModal from "./CodeAssignmentModal";
import ProfessionalSelectModal from "./ProfessionalSelectModal";

const PAGE_SIZE = 10;

function DeleteConfirmationModal({
  isVisible,
  onClose,
  professional,
  onConfirm,
  isDeleting,
}) {
  const name = professional?.name || "this professional";

  return (
    <Modal
      centered
      title={
        <span className="text-xl font-bold text-red-600">
          <ExclamationCircleOutlined className="mr-2" /> Confirm Removal
        </span>
      }
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} className="rounded-lg">
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          loading={isDeleting}
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
        >
          Yes, Remove
        </Button>,
      ]}
    >
      <div className="py-4">
        <p className="text-gray-700 text-lg">
          Are you sure you want to **permanently unassign** **{name}**?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}

export default function AssignedProfessional() {
  const { id: parentId } = useParams();
  const navigate = useNavigate();
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const [isCodeModalVisible, setIsCodeModalVisible] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [page, setPage] = useState(1);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [professionalToRemove, setProfessionalToRemove] = useState(null);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const { data: apiResponse, isLoading } = useGetParentProfessionalsQuery({
    id: parentId,
    page,
    limit: PAGE_SIZE,
  });

  const [deleteProfMutation, { isLoading: isDeleting }] =
    useRemoveProfessionalMutation();

  const handleRemoveProfessional = (record) => {
    setProfessionalToRemove(record);
    setIsRemoveModalVisible(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalVisible(false);
    setProfessionalToRemove(null);
  };

  const confirmRemove = async () => {
    if (!professionalToRemove?._id) return;

    const sessionId = professionalToRemove._id;
    const professionalName = professionalToRemove.name;

    try {
      await deleteProfMutation(sessionId).unwrap();

      SuccessSwal({
        title: "Removed!",
        text: `Professional ${professionalName} was successfully unassigned.`,
      });
      closeRemoveModal();
    } catch (error) {
      ErrorSwal({
        title: "Error",
        text:
          error?.data?.message ||
          error?.message ||
          `Failed to remove professional ${professionalName}.`,
      });
      closeRemoveModal();
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Code",
        dataIndex: "_id",
        key: "_id",
        width: 100,
        render: (idText) => {
          const code = idText ? idText.slice(-6) : "N/A";
          return (
            <span className="text-gray-500 font-medium">{`#${code}`}</span>
          );
        },
      },
      {
        title: "Full Name",
        dataIndex: "name",
        key: "fullName",
        render: (_, record) => (
          <NameCell name={record.name} avatar={record.profileImage} />
        ),
      },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
      {
        title: "Subjects",
        dataIndex: "subjects",
        key: "subjects",
        render: (subjects) => (
          <span className="text-gray-700">
            {Array.isArray(subjects) ? subjects.join(", ") : subjects}
          </span>
        ),
      },
      {
        title: "Action",
        key: "action",
        width: 150,
        render: (record) => (
          <Button
            danger
            type="primary"
            className="bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold shadow-md border-none"
            onClick={() => handleRemoveProfessional(record)}
          >
            Remove
          </Button>
        ),
      },
    ],
    []
  );

  const tableDataSource = useMemo(() => {
    const professionals = apiResponse?.data || [];
    return professionals.map((professional) => ({
      key: professional?._id,
      _id: professional?._id,
      name: professional.professional?.name,
      phoneNumber: professional.professional?.phoneNumber,
      profileImage: professional.professional?.profileImage,
      subjects: professional?.subject,
      email: professional.professional.user?.email,
    }));
  }, [apiResponse]);

  const [assignedProfMutation, { isLoading: isLoadingAssignProf }] =
    useAssignedProfessionalMutation();

  const handleAssignNew = useCallback(() => {
    setIsSelectModalVisible(true);
  }, []);

  const handleProfessionalSelect = useCallback((professional) => {
    setSelectedProfessional(professional);
    setIsSelectModalVisible(false);
    setIsCodeModalVisible(true);
  }, []);

  const handleSubmitAssignment = async (payload) => {
    const data = {
      subject: payload.subject,
      code: payload.code,
    };
    try {
      const response = await assignedProfMutation({
        parentId,
        professionalId: selectedProfessional?._id,
        data,
      }).unwrap();
      SuccessSwal({
        title: "Success",
        text:
          response?.data?.message ||
          response?.message ||
          "Professional assigned successfully!",
      });
    } catch (error) {
      ErrorSwal({
        title: "Error",
        text:
          error?.data?.message ||
          error?.message ||
          "Failed to assign professional!",
      });
    }

    setSelectedProfessional(null);
    setIsCodeModalVisible(false);
  };

  const totalCount = apiResponse?.meta?.total || apiResponse?.total || 0;

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CustomLoading />
      </div>
    );
  }

  return (
    <>
      <div className="p-2 md:p-4 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <button className="cursor-pointer" onClick={() => navigate(-1)}>
              <FaArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-baseline">
              View Assigned Professional
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto flex-grow">
          <Table
            columns={columns}
            dataSource={tableDataSource}
            loading={isLoading}
            scroll={{ x: "max-content" }}
            className="w-full"
            rowKey="key"
            rowClassName={() =>
              "hover:bg-blue-50/50 transition duration-150 ease-in-out cursor-pointer"
            }
            pagination={{
              current: page,
              pageSize: PAGE_SIZE,
              total: totalCount,
              showSizeChanger: false,
              onChange: handlePageChange,
            }}
          />
        </div>
        <div className="mt-8 text-center">
          <Button
            type="primary"
            size="large"
            className="bg-primary hover:bg-primary/60 text-white font-bold text-lg rounded-xl shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-[1.005]"
            onClick={handleAssignNew}
          >
            Assign New Professional
          </Button>
        </div>
      </div>

      <ProfessionalSelectModal
        isVisible={isSelectModalVisible}
        onClose={() => setIsSelectModalVisible(false)}
        onProfessionalSelect={handleProfessionalSelect}
      />

      {selectedProfessional && (
        <CodeAssignmentModal
          isLoadingAssignProf={isLoadingAssignProf}
          isVisible={isCodeModalVisible}
          onClose={() => {
            setIsCodeModalVisible(false);
            setSelectedProfessional(null);
          }}
          professional={selectedProfessional}
          onSubmit={handleSubmitAssignment}
        />
      )}

      {professionalToRemove && (
        <DeleteConfirmationModal
          isVisible={isRemoveModalVisible}
          onClose={closeRemoveModal}
          professional={professionalToRemove}
          onConfirm={confirmRemove}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
