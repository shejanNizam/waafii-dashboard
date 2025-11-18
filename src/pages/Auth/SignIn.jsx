import { Button, Form, Input } from "antd";
import { FaKey } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setLogin } from "../../redux/slices/authSlice";
import { ErrorSwal, SuccessSwal } from "../../utils/allSwalFire";

const SignIn = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mutation, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      const response = await mutation(values).unwrap();

      localStorage.setItem("token", response?.data?.accessToken);

      dispatch(
        setLogin({
          user: { ...response?.data, _id: response?.data?._id },
          token: response?.data?.accessToken,
        })
      );

      SuccessSwal({
        title: "Login Successful!",
        text: response?.data?.message || response?.message || "  ",
      });

      navigate("/");
    } catch (error) {
      ErrorSwal({
        title: "Login Failed!",
        text:
          error?.data?.message || error?.message || "Something went wrong!!",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center w-full">
        <h3 className="text-2xl xl:text-3xl mb-8 text-center font-semibold">
          Sign In
        </h3>
        <Form
          form={form}
          name={"normal_login"}
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          requiredMark={true}
          className="w-full"
        >
          <Form.Item
            label={"User Email"}
            name="email"
            rules={[
              {
                type: "email",
                message: "Input a valid email!",
              },
              {
                required: true,
                message: "Email is required!",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter Your Email"
              prefix={<MdOutlineAlternateEmail className="w-5 mr-0.5" />}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Password is required!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
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
          <div className="flex justify-between">
            <p></p>
            {/* <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item> */}
            <p
              onClick={() => navigate(`/auth/forgot-password`)}
              className="hover:text-primary text-black transition-all underline underline-offset-2 mb-4 cursor-pointer"
            >
              Forget password
            </p>
          </div>
          <div className="w-full flex justify-center ">
            <Button
              loading={isLoading}
              type="primary"
              size="large"
              htmlType="submit"
              className="px-2 w-full"
            >
              Signin
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default SignIn;
