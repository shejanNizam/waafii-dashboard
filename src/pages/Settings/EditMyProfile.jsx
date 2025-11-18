import { Button, Form, Input, message, Spin } from "antd";
import { useState } from "react";
import { PiCameraPlus } from "react-icons/pi";
import defaultImage from "../../assets/main_logo/main_logo_lms.svg";
import { useNavigate } from "react-router";
import {
  useGetUserByTokenQuery,
  useUpdateUserMutation,
} from "../../redux/features/user/userApi";
// const baseImageUrl = import.meta.env.VITE_IMAGE_URL;

const EditMyProfile = () => {
  const navigate = useNavigate();
  const [updateProfile, { isLoading: isUpdateLoading }] =
    useUpdateUserMutation();
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { data, isLoading, refetch } = useGetUserByTokenQuery();

  const profileData = data?.data || {};

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);

      if (profileImage) {
        formData.append("image", profileImage);
      }

      const response = await updateProfile(formData).unwrap();

      message.success(
        response?.data?.message ||
          response?.message ||
          "Profile updated successfully"
      );

      refetch();
      navigate("/settings/profile");
    } catch (error) {
      message.error(error?.data?.message || "Failed to update profile");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = handleImageChange;
    fileInput.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-[24px] min-h-[83vh] bg-white rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 px-4 sm:px-8 md:px-10 lg:px-14 pt-6">
        Edit Personal Information
      </h1>
      <div className="w-full">
        <Form
          name="basic"
          layout="vertical"
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-x-10 px-4 sm:px-8 md:px-10 lg:px-14 py-8"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            image: profileData.profileImage,
            name: profileData.name,
            email: profileData.email,
          }}
        >
          <div className="col-span-full md:col-span-4 lg:col-span-3 space-y-6 mb-8 md:mb-0">
            <div className="min-h-[365px] flex flex-col items-center justify-center p-8 rounded-lg border border-primary shadow-inner space-y-4">
              <div className="my-3 relative">
                <div
                  onClick={handleProfileImageClick}
                  className="h-full w-full absolute inset-0 bg-[#222222bb] rounded-full flex justify-center items-center text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                >
                  <PiCameraPlus size={34} />
                </div>
                <img
                  src={
                    previewImage
                      ? previewImage
                      : profileData.profileImage
                      ? profileData?.profileImage
                      : defaultImage
                  }
                  alt="Profile"
                  className="h-[144px] w-[144px] rounded-full object-cover"
                />
              </div>
              <h5 className="text-lg">{profileData.name}</h5>
              <h4 className="text-2xl">{"Admin"}</h4>
            </div>
          </div>
          <div className="col-span-full md:col-span-8 lg:col-span-9 space-y-[24px]">
            <Form.Item
              className="text-lg font-medium"
              label="Name"
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input size="large" className="h-[56px] rounded-lg mt-3" />
            </Form.Item>
            <Form.Item
              className="text-lg font-medium"
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input
                readOnly
                size="large"
                className="h-[56px] rounded-lg mt-3 bg-gray-100 cursor-not-allowed"
              />
            </Form.Item>
            <Form.Item className="flex justify-end pt-4">
              <Button
                size="large"
                type="primary"
                className="w-full sm:w-[250px] px-8"
                htmlType="submit"
                loading={isUpdateLoading}
              >
                Save Changes
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditMyProfile;
