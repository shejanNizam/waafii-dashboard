import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Spin,
  Typography,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaPlus,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { DeleteConfirmationModal } from "../../../components/DeleteConfirmationModal";
import {
  useCreateMaterialsMutation,
  useDeleteMaterialMutation,
  useGetAllMaterialsQuery,
} from "../../../redux/features/resourceApi/resourceApi";
import { ErrorSwal, SuccessSwal } from "../../../utils/allSwalFire";

const { Title } = Typography;

export default function Materials() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [fileList, setFileList] = useState([]);

  // --- NEW STATE FOR DELETE MODAL ---
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [materialToRemove, setMaterialToRemove] = useState(null);
  // ------------------------------------

  console.log(materialToRemove);

  const {
    data,
    isLoading: isLoadingMaterials,
    refetch,
  } = useGetAllMaterialsQuery({
    page: 1,
    limit: 20,
    searchTerm: searchText,
    id: id,
  });

  const materialsData = data?.data || [];

  const [createMaterial, { isLoading: isCreatingMaterial }] =
    useCreateMaterialsMutation();

  const [deleteMaterial, { isLoading: isDeletingMaterial }] =
    useDeleteMaterialMutation(); // Destructure loading state

  const showModal = () => setIsModalVisible(true);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFileChange = ({ fileList }) => {
    const latestFile = fileList.slice(-1);
    setFileList(latestFile);
    form.setFieldsValue({
      file: latestFile.length > 0 ? latestFile : undefined,
    });
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFileList([]);
    form.resetFields(["file"]);
  };

  const onFinish = async (values) => {
    const file = fileList[0]?.originFileObj;

    if (!file) {
      message.error("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    const data = {
      title: values.titleName,
    };

    formData.append("data", JSON.stringify(data));
    formData.append("file", file);

    try {
      await createMaterial({ id: id, data: formData }).unwrap();

      SuccessSwal({
        title: "Material Added Successfully",
        text: `"${values.titleName}" has been added.`,
      });

      form.resetFields();
      setFileList([]);
      setIsModalVisible(false);

      refetch();
    } catch (error) {
      ErrorSwal({
        title: "Failed to add material",
        text: error?.data?.message || error?.message || "An error occurred",
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setIsModalVisible(false);
  };

  // --- UPDATED DELETE HANDLERS ---
  const handleShowDeleteModal = (id, title) => {
    setMaterialToRemove({ _id: id, title });
    setIsRemoveModalVisible(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalVisible(false);
    setMaterialToRemove(null);
  };

  const confirmDelete = async () => {
    if (!materialToRemove?._id) return;

    const materialId = materialToRemove._id;
    const materialTitle = materialToRemove.title;

    try {
      await deleteMaterial(materialId).unwrap(); // Execute the actual delete mutation

      SuccessSwal({
        title: "Deleted!",
        text: `Material "${materialTitle}" has been successfully deleted.`,
      });
      closeRemoveModal();
      refetch();
    } catch (error) {
      ErrorSwal({
        title: "Failed to delete material",
        text:
          error?.data?.message ||
          error.error ||
          "An error occurred during deletion",
      });
      closeRemoveModal();
    }
  };
  // -------------------------------

  const filteredMaterials = materialsData.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const fileName = fileList[0]?.name;

  return (
    <div className="flex justify-center p-2 md:p-4">
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        {/* Header, Back Button, and Search Section */}
        <div className=" mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center justify-between w-full">
            <div className=" flex items-center gap-2">
              <button
                className="cursor-pointer text-gray-700 hover:text-gray-900 transition"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Materials</h1>
            </div>

            <button
              onClick={showModal}
              className="flex justify-center items-center gap-2 bg-primary/80 text-white px-4 py-2 rounded-full font-semibold cursor-pointer 
              transition duration-300 ease-in-out hover:scale-105"
            >
              <FaPlus />
              Add Material
            </button>
          </div>

          <div className="flex items-center justify-end mt-4 space-x-4 w-full ">
            <Input.Search
              placeholder="Search by name or material..."
              allowClear
              enterButton="Search"
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full max-w-sm sm:max-w-sm md:max-w-md"
            />
          </div>
        </div>

        {/* Materials List */}
        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
          <Spin spinning={isLoadingMaterials} tip="Loading Materials...">
            {filteredMaterials.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredMaterials.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Material Title Section */}
                    <div className="flex items-center gap-3 min-w-0 grow">
                      <a href={item?.fileUrl}></a>
                      <span className="text-lg font-medium text-gray-800 truncate">
                        {item.title}
                      </span>
                    </div>

                    {/* Buttons Section */}
                    <div className="flex items-center space-x-2 shrink-0 ml-4">
                      <Button
                        type="default"
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all duration-200"
                      >
                        View File
                      </Button>
                      <Button
                        type="default"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() =>
                          handleShowDeleteModal(item._id, item.title)
                        }
                        className="hover:bg-red-500! hover:text-white! transition-all duration-200"
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
                    ? "No materials found matching your search."
                    : "No materials found. Please add materials!"
                }
                className="py-12"
              />
            )}
          </Spin>
        </div>

        {/* Add Material Modal */}
        <Modal
          title={
            <div className="flex justify-between items-center pr-1">
              <Title level={5} className="mb-0!">
                Add Material
              </Title>
            </div>
          }
          centered
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={350}
        >
          <Form
            form={form}
            name="add_material_form"
            onFinish={onFinish}
            layout="vertical"
            className="p-2"
          >
            {/* Title Name Input */}
            <Form.Item
              name="titleName"
              rules={[
                {
                  required: true,
                  message: "Please input the material title/name!",
                },
              ]}
              className="mb-4 [&_.ant-form-item-control-input-content]:mt-0"
              label={null}
            >
              <Input
                placeholder="Title Name"
                className="rounded-lg border border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            {/* Attach File Section */}
            <Title level={5} className="mb-2! text-sm! font-medium!">
              Attach file (PDF, DOCX, JPG, etc.)
            </Title>
            <Form.Item
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Please attach a file!" }]}
              className="mb-6"
            >
              {fileName ? (
                <div className="flex justify-between items-center w-full py-2 px-4 rounded-lg shadow-sm border border-gray-300 bg-gray-50">
                  <span className="truncate text-sm font-medium">
                    {fileName}
                  </span>
                  <Button
                    type="text"
                    icon={<FaTimesCircle size={14} className="text-red-500" />}
                    onClick={handleRemoveFile}
                    className="ml-2 p-0 h-auto"
                  />
                </div>
              ) : (
                <Upload
                  customRequest={dummyRequest}
                  maxCount={1}
                  fileList={fileList}
                  onChange={handleFileChange}
                  showUploadList={false}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav,.ppt,.pptx"
                >
                  <Button
                    className="flex justify-center items-center w-full py-6 rounded-lg shadow-sm border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                    icon={<FaCloudUploadAlt size={20} className="mr-2" />}
                  >
                    Select File
                  </Button>
                </Upload>
              )}
            </Form.Item>

            {/* Submit Button */}
            <Form.Item className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isCreatingMaterial}
                className="rounded-lg py-2 h-auto text-base font-semibold"
                style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* The separate Delete Confirmation Modal */}
        {materialToRemove && (
          <DeleteConfirmationModal
            isVisible={isRemoveModalVisible}
            onClose={closeRemoveModal}
            material={materialToRemove}
            onConfirm={confirmDelete}
            isDeleting={isDeletingMaterial}
          />
        )}
      </div>
    </div>
  );
}
