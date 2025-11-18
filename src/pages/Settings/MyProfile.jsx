import { Button, Form } from "antd";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router";
import defaultImage from "../../assets/main_logo/main_logo_lms.svg";
import PasswordChangeModalForm from "../../components/PasswordChangeModalForm";
import { useGetUserByTokenQuery } from "../../redux/features/user/userApi";
import CustomLoading from "../../utils/CustomLoading";

// const baseImageUrl = import.meta.env.VITE_IMAGE_URL;

const MyProfile = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetUserByTokenQuery();
  console.log(data);

  const profileData = data?.data || {};
  const avatarImage = profileData?.profileImage
    ? `${profileData?.profileImage}`
    : defaultImage;

  const handleEditProfile = () => {
    navigate("edit", { state: { profileData } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CustomLoading />
      </div>
    );
  }

  return (
    <div className="space-y-[24px] min-h-[83vh] bg-white rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 px-4 sm:px-8 md:px-10 lg:px-14 pt-6">
        Personal Information
      </h1>
      <div className="w-full">
        <div className="py-4 px-4 sm:px-8 md:px-10 lg:px-14 flex justify-end items-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            size="large"
            type="default"
            className="px-8 text-white bg-button font-semibold"
          >
            Change Password
          </Button>
        </div>
        <Form
          name="basic"
          layout="vertical"
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-x-10 px-4 sm:px-8 md:px-10 lg:px-14 py-8"
          autoComplete="off"
          initialValues={{
            image: profileData?.image,
            name: profileData?.name,
            email: profileData?.email,
          }}
        >
          <div className="col-span-full md:col-span-4 lg:col-span-3 space-y-6 mb-8 md:mb-0">
            <div className="min-h-[365px] flex flex-col items-center justify-center p-8 rounded-lg border border-primary shadow-inner space-y-4">
              <div className="my-3">
                <img
                  src={avatarImage}
                  alt="Profile"
                  className="h-[144px] w-[144px] rounded-full"
                />
              </div>
              <h5 className="text-lg text-[#222222]">{profileData?.name}</h5>
              <h4 className="text-2xl text-[#222222]">{"Admin"}</h4>
            </div>
            <Button
              onClick={handleEditProfile}
              size="large"
              type="primary"
              className="px-8 w-full"
            >
              <FiEdit /> Edit Profile
            </Button>
          </div>
          <div className="col-span-full md:col-span-8 lg:col-span-9 ">
            <div className="space-y-[24px]">
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-medium mb-1">Name</p>
                  <div className="h-[56px] rounded-lg bg-[#EFFAFF] flex items-center px-4 text-primary">
                    {profileData.name}
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium mb-1">Email</p>
                  <div className="h-[56px] rounded-lg bg-[#EFFAFF] flex items-center px-4 text-primary">
                    {profileData.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>

      {/* change pass */}
      <PasswordChangeModalForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default MyProfile;
