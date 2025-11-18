import { Button, Form } from "antd";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { useVerifyEmailMutation } from "../../redux/features/auth/authApi";
import { ErrorSwal, SuccessSwal } from "../../utils/allSwalFire";
// import { cn } from "../../utils/cn";

const VerifyEmail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { email } = useParams();
  console.log(email);

  const [mutation, { isLoading }] = useVerifyEmailMutation();
  // const [resendMutation, { isLoading: resendLoading }] = useResendOtpMutation();
  const [otp, setOtp] = useState("");

  const onFinish = async () => {
    if (!/^\d{6}$/.test(otp)) {
      return Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Please enter a valid 6-digit OTP.",
      });
    }

    try {
      const payload = {
        email,
        otp,
      };
      const response = await mutation(payload).unwrap();

      SuccessSwal({ title: "Success", text: response.message || "Success" });
      navigate(`/auth/reset-password/${response?.data?.email}`);
    } catch (error) {
      ErrorSwal({
        title: "Login Failed!",
        text:
          error?.data?.message || error?.message || "Something went wrong!!",
      });
    }
  };

  const handleResend = async () => {
    // try { // Dynamic: Resend API call and error handling block
    //   const response = await resendMutation({ email }).unwrap();
    //   // Cookies.set("token", response.data.token);
    //   // successAlert({...});
    // } catch (error) {
    //   // errorAlert({...});
    // }

    // Placeholder for static execution:
    console.log("Resend OTP attempted.");
  };

  return (
    <>
      {/* Replaced cn with fixed class string */}
      <div className={"w-full"}>
        {/* {contextHolder} */}
        <div className="text-center space-y-2.5 sm:space-y-5 pb-2 sm:pb-4">
          <h3 className="text-2xl xl:text-3xl mb-3 font-medium text-center">
            {/* Custom components commented out */}
            {/* <ClientButton>
              <ArrowLeftIcon className="w-5 xl:w-6" />
            </ClientButton>{" "} */}
            Email Verification
          </h3>
          <p className="text-brand/60 px-2 lg:px-6">
            A verification email has been sent to{" "}
            <span className="text-brand font-medium">{"[user email]"}</span>.
            Please verify your email address to verify your account.
          </p>
        </div>

        <Form
          form={form}
          name={"normal_verify_email"}
          layout="vertical"
          // initialValues={{ remember: true, }}
          onFinish={onFinish}
          // onValuesChange={onValuesChange}
          requiredMark={false}
          className="w-full text-center"
        >
          <Form.Item
          // name={"otp"} // Dynamic: Removed name if form validation is bypassed
          // rules={[{ required: true, message: "Verify otp is required!" }]} // Dynamic: Form validation rules
          >
            <div className="py-2 font-medium flex justify-center">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span> </span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="border border-gray-400 hover:border-[#09d4eb] focus:border-[#09d4eb] outline-none rounded-full w-full h-[50px] min-w-[40px] mx-[5px] text-[16px] md:h-[60px] md:min-w-[50px] md:mx-[8px] lg:h-[70px] md:text-lg xl:min-w-[70px] xl:mx-[10px] xl:text-2xl focus:ring-2 ring-[#00B05A]/20"
                  />
                )}
              />
            </div>
          </Form.Item>
          <div className="w-full flex justify-center pt-2">
            <Button
              loading={isLoading}
              type="primary"
              size="large"
              htmlType="submit"
              className="px-2 w-full"
            >
              Verify Account
            </Button>
          </div>
        </Form>
        <p className="text-brand/500 mt-2 lg:mt-4">
          Didn’t recieve any code!
          <Button
            onClick={handleResend}
            // loading={resendLoading}
            type="text"
            size="small"
          >
            Resend
          </Button>
        </p>
      </div>
    </>
  );
};

export default VerifyEmail;
