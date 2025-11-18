import { BookOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Spin,
  Typography,
} from "antd";
import { useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { DeleteConfirmationModal } from "../../../components/DeleteConfirmationModal";
import {
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useGetAllSubjectQuery,
} from "../../../redux/features/resourceApi/resourceApi";
import { ErrorSwal, SuccessSwal } from "../../../utils/allSwalFire";

const { Title } = Typography;

const PAGE_LIMIT = 10;

export default function Subjects() {
  const navigate = useNavigate();
  const { id } = useParams(); // Grade ID

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // --- NEW STATE FOR DELETE MODAL ---
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [subjectToRemove, setSubjectToRemove] = useState(null);
  // ------------------------------------

  const {
    data,
    isLoading: isSubjectsLoading,
    refetch,
  } = useGetAllSubjectQuery({
    page: currentPage,
    limit: PAGE_LIMIT,
    searchTerm: searchText,
    id: id,
  });

  const subjectsData = data?.data || [];
  const metaData = data?.meta || {
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    totalPage: 1,
  };

  const displaySubjects = subjectsData;

  const [addSubject, { isLoading: isAddingSubject }] =
    useCreateSubjectMutation();
  const [deleteSubject, { isLoading: isDeletingSubject }] =
    useDeleteSubjectMutation(); // Destructure loading state

  const showModal = () => setIsModalVisible(true);

  const onFinish = async (values) => {
    try {
      await addSubject({ id: id, data: values }).unwrap();

      SuccessSwal({
        title: "Subject Added Successfully",
        text: `"${values.name}" has been added.`,
      });

      refetch();
    } catch (error) {
      ErrorSwal({
        title: "Failed to add subject",
        text:
          error?.data?.message ||
          error?.message ||
          "Failed to add subject. Please try again.",
      });
    }

    form.resetFields();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/resources/materials/${subjectId}`);
  };

  // --- UPDATED DELETE HANDLERS ---
  const handleShowDeleteModal = (subjectId, name) => {
    setSubjectToRemove({ _id: subjectId, name });
    setIsRemoveModalVisible(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalVisible(false);
    setSubjectToRemove(null);
  };

  const confirmDelete = async () => {
    if (!subjectToRemove?._id) return;

    const subjectId = subjectToRemove._id;
    const subjectName = subjectToRemove.name;

    try {
      await deleteSubject(subjectId).unwrap(); // Execute the actual delete mutation

      SuccessSwal({
        title: "Deleted!",
        text: `Subject "${subjectName}" has been successfully deleted.`,
      });
      closeRemoveModal();
      refetch();

      // Optional: If on the last item of a page, navigate back
      if (displaySubjects.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      ErrorSwal({
        title: "Failed to delete subject",
        text:
          error?.data?.message ||
          error.error ||
          "An error occurred during deletion",
      });
      closeRemoveModal();
    }
  };
  // -------------------------------

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  return (
    <div className="flex justify-center p-2 md:p-4">
      <div className="w-full bg-white rounded-lg shadow-xl p-4 md:p-6">
        {/* Header, Back Button, and Search Section */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
            {/* Back button and Title */}
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer text-gray-700 hover:text-gray-900 transition"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft size={20} />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Subjects
              </h1>
            </div>

            {/* Add Button */}
            <button
              onClick={showModal}
              className="flex justify-center items-center gap-2 bg-primary/80 text-white px-4 py-2 rounded-full font-semibold cursor-pointer 
              transition duration-300 ease-in-out hover:scale-105 w-full sm:w-auto"
            >
              <FaPlus />
              Add Subject
            </button>
          </div>

          {/* Search Input */}
          <div className="flex justify-end w-full">
            <Input.Search
              placeholder="Search by subject name..."
              allowClear
              enterButton="Search"
              size="large"
              value={searchText}
              onChange={handleSearch}
              className="w-full max-w-xs sm:max-w-md"
            />
          </div>
        </div>

        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden min-h-[300px] relative">
          <Spin spinning={isSubjectsLoading} tip="Loading Subjects...">
            {displaySubjects.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {displaySubjects.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white hover:bg-gray-50 transition-colors duration-150 gap-2"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                      <BookOutlined className="text-xl text-primary shrink-0" />
                      <span className="text-base sm:text-lg font-medium text-gray-800 truncate">
                        {item.name}
                      </span>
                    </div>

                    {/* Buttons Section (Right) */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end sm:justify-start shrink-0">
                      <Button
                        type="default"
                        icon={<BookOutlined />}
                        onClick={() => handleSubjectClick(item._id)}
                        className="text-primary border-primary hover:text-white! hover:bg-primary/90! transition-all duration-200 w-1/2 sm:w-auto"
                      >
                        Details
                      </Button>
                      <Button
                        type="default"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() =>
                          handleShowDeleteModal(item._id, item.name)
                        }
                        className="hover:bg-red-500! hover:text-white! transition-all duration-200 w-1/2 sm:w-auto"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                description={
                  searchText
                    ? "No subjects found matching your search."
                    : "No subjects found. Please add subjects!"
                }
                className="py-12"
              />
            )}
          </Spin>
        </div>

        {/* Pagination */}
        {metaData.total > 0 && metaData.total > metaData.limit && (
          <div className="mt-6 flex justify-center md:justify-end">
            <Pagination
              current={metaData.page}
              pageSize={metaData.limit}
              total={metaData.total}
              onChange={handlePaginationChange}
              showSizeChanger={false}
              hideOnSinglePage={true}
              responsive={true}
            />
          </div>
        )}

        {/* Add Subject Modal */}
        <Modal
          title={
            <div className="flex justify-between items-center pr-1">
              <Title level={5} className="mb-0!">
                Add Subject
              </Title>
            </div>
          }
          centered
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={350}
          style={{ maxWidth: "90vw" }}
        >
          <Form
            form={form}
            name="add_subject_form"
            onFinish={onFinish}
            layout="vertical"
            className="p-2"
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Please input the subject name!" },
              ]}
              className="mb-4 [&_.ant-form-item-control-input-content]:mt-0"
              label={null}
            >
              <Input
                placeholder="Subject Name (e.g., Physics, Calculus)"
                className="rounded-lg border border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={isAddingSubject}
                type="primary"
                htmlType="submit"
                block
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* The separate Delete Confirmation Modal */}
        {subjectToRemove && (
          <DeleteConfirmationModal
            isVisible={isRemoveModalVisible}
            onClose={closeRemoveModal}
            subject={subjectToRemove}
            onConfirm={confirmDelete}
            isDeleting={isDeletingSubject}
          />
        )}
      </div>
    </div>
  );
}
