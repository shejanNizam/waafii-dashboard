import {
  DeleteOutlined,
  FolderOutlined,
  RightOutlined,
} from "@ant-design/icons";
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
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import { DeleteConfirmationModal } from "../../../components/DeleteConfirmationModal";
import {
  useCreateGradeMutation,
  useDeleteGradeMutation,
  useGetAllGradeQuery,
} from "../../../redux/features/resourceApi/resourceApi";
import { ErrorSwal, SuccessSwal } from "../../../utils/allSwalFire";

const { Title } = Typography;

const PAGE_LIMIT = 10;

export default function Resources() {
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // --- NEW STATE FOR DELETE MODAL ---
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [gradeToRemove, setGradeToRemove] = useState(null);
  // ------------------------------------

  const {
    data,
    isLoading: isGradesLoading,
    refetch,
  } = useGetAllGradeQuery({
    page: currentPage,
    limit: PAGE_LIMIT,
    searchTerm: searchText,
  });

  const gradesData = data?.data || [];
  const metaData = data?.meta || {
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    totalPage: 1,
  };
  const displayGrades = gradesData;

  const [addGrade, { isLoading: isAddingGrade }] = useCreateGradeMutation();
  const [deleteGrade, { isLoading: isDeletingGrade }] =
    useDeleteGradeMutation();

  const showModal = () => setIsModalVisible(true);

  const onFinish = async (values) => {
    try {
      await addGrade({ name: values.name }).unwrap();
      SuccessSwal({
        title: "Grade Added Successfully",
        text: `"${values.name}" has been added.`,
      });
      refetch();
    } catch (error) {
      ErrorSwal({
        title: "Failed to add grade",
        text: error?.data?.message || error.error || "An error occurred",
      });
    }
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleGradeClick = (id) => {
    navigate(`/resources/subject/${id}`);
  };

  // --- UPDATED DELETE HANDLERS ---
  const handleShowDeleteModal = (id, name) => {
    setGradeToRemove({ _id: id, name });
    setIsRemoveModalVisible(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalVisible(false);
    setGradeToRemove(null);
  };

  const confirmDelete = async () => {
    if (!gradeToRemove?._id) return;

    const id = gradeToRemove._id;
    const name = gradeToRemove.name;

    try {
      await deleteGrade(id).unwrap();

      SuccessSwal({
        title: "Deleted!",
        text: `Grade "${name}" has been successfully deleted.`,
      });
      closeRemoveModal();
      refetch();

      if (displayGrades.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      ErrorSwal({
        title: "Failed to delete grade",
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
      <div className="w-full bg-white rounded-lg shadow-xl p-4 md:p-6 ">
        {/* Header and Search/Add Section */}
        <div className="mb-6 space-y-4">
          {/* Title and Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Resources
            </h1>
            <button
              onClick={showModal}
              className="flex justify-center items-center gap-2 bg-primary/80 text-white px-4 py-2 rounded-full font-semibold cursor-pointer 
              transition duration-300 ease-in-out hover:scale-105 w-full sm:w-auto"
            >
              <FaPlus />
              Add Grade
            </button>
          </div>

          {/* Search Input */}
          <div className="flex justify-end w-full">
            <Input.Search
              placeholder="Search by grade name..."
              allowClear
              enterButton="Search"
              size="large"
              value={searchText}
              onChange={handleSearch}
              className="w-full max-w-xs sm:max-w-md"
            />
          </div>
        </div>

        {/* Grades List */}
        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden min-h-[300px] relative">
          <Spin spinning={isGradesLoading} tip="Loading Grades...">
            {displayGrades.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {displayGrades.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white hover:bg-gray-50 transition-colors duration-150 gap-2"
                  >
                    {/* Grade Name Section (Left) */}
                    <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                      <FolderOutlined className="text-xl text-primary shrink-0" />
                      <span className="text-base sm:text-lg font-medium text-gray-800 truncate">
                        {item.name}
                      </span>
                    </div>

                    {/* Buttons Section (Right) */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end sm:justify-start shrink-0">
                      <Button
                        type="default"
                        icon={<RightOutlined />}
                        onClick={() => handleGradeClick(item._id)}
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
                    ? "No grades found matching your search."
                    : "No grades found. Please add resources!"
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

        {/* Add Grade Modal */}
        <Modal
          title={
            <div className="flex justify-between items-center pr-1">
              <Title level={5} className="mb-0!">
                Add Grade
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
            name="add_grade_form"
            onFinish={onFinish}
            layout="vertical"
            className="p-2"
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Please input the grade name!" },
              ]}
              className="mb-4 [&_.ant-form-item-control-input-content]:mt-0"
              label={null}
            >
              <Input
                placeholder="Grade Name (e.g., Grade 10, Standard V)"
                className="rounded-lg border border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={isAddingGrade}
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
        {gradeToRemove && (
          <DeleteConfirmationModal
            isVisible={isRemoveModalVisible}
            onClose={closeRemoveModal}
            grade={gradeToRemove}
            onConfirm={confirmDelete}
            isDeleting={isDeletingGrade}
          />
        )}
      </div>
    </div>
  );
}
