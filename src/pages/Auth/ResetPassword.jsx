import { Button, Form, Input } from "antd";
import { FaKey } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";
import { useResetPasswordMutation } from "../../redux/features/auth/authApi";
import { ErrorSwal, SuccessSwal } from "../../utils/allSwalFire";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const { email } = useParams();
  console.log(email);
  const navigate = useNavigate();
  const [mutation, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (values) => {
    console.log("Password reset attempted with:", values);

    const password = values.password;

    try {
      const payload = {
        email,
        newPassword: password,
      };
      const response = await mutation(payload).unwrap();

      SuccessSwal({
        title: "Success",
        text: response.message || "Password reset successfully!",
      });

      navigate("/auth");
    } catch (error) {
      const err = error;
      ErrorSwal({
        title: "Login Failed!",
        text: err?.data?.message || err?.message || "Something went wrong!!",
      });
    }
  };

  return (
    <>
      <div className={"w-full"}>
        <div className="text-center space-y-2.5 sm:space-y-5 pb-2 sm:pb-4">
          <h3 className="text-2xl xl:text-3xl mb-3 font-medium text-center">
            {/* Custom components commented out */}
            {/* <ClientButton>
              <ArrowLeftIcon className="w-5 xl:w-6" />
            </ClientButton>{" "} */}
            Reset Password
          </h3>
          <p className="text-brand/60 px-2 lg:px-6">
            Enter your new secure password below to complete the reset process.
          </p>
        </div>

        <Form
          form={form}
          name={"normal_reset_password"}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="w-full"
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject("Password is required!");
                  }
                  const pattern =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
                  if (!pattern.test(value)) {
                    return Promise.reject(
                      "Include uppercase, lowercase, number, special character!"
                    );
                  }
                  if (value.length < 8) {
                    return Promise.reject("Must be at least 8 characters!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="**********"
              prefix={<FaKey className="w-5 mr-0.5" />}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Re-Enter the password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The password that you entered do not match!")
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="**********"
              prefix={<FaKey className="w-5 mr-0.5" />}
            />
          </Form.Item>
          <div className="w-full flex justify-center pt-2">
            <Button
              loading={isLoading}
              type="primary"
              size="large"
              htmlType="submit"
              className="px-2 w-full"
            >
              Reset Password
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ResetPassword;
