import { Button, Form } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router";
import CustomEditor from "../../components/CustomEditor";
import PageHeading from "../../components/PageHeading";
import {
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
} from "../../redux/features/setting/settingApi";
import { ErrorSwal, SuccessSwal } from "../../utils/allSwalFire";

const EditPrivacyPolicy = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const editorRef = useRef(null);

  const { data } = useGetPrivacyQuery({});
  const [updatePrivacy, { isLoading }] = useUpdatePrivacyMutation();

  const onFinish = async (values) => {
    const payload = {
      ...values,
    };
    const id = data?.data[0]?._id;

    // Override `value` with editor content if available
    if (
      editorRef.current &&
      typeof editorRef.current.getContent() === "string"
    ) {
      payload.content = editorRef.current.getContent();
    }

    try {
      await updatePrivacy({ data: payload, id }).unwrap();
      SuccessSwal({
        title: "Success",
        text: "Privacy Policy updated successfully",
      });
      navigate(`/settings/privacy`);
    } catch (error) {
      ErrorSwal({
        title: "Error",
        text: error?.data?.message || "Failed to update Privacy Policy",
      });
    }
  };

  return (
    <>
      <div className="space-y-5">
        <PageHeading
          title={"Edit Privacy Policy"}
          disbaledBackBtn={false}
          backPath={-1}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="w-full"
        >
          <div className="min-h-[calc(100vh-220px)] flex flex-col justify-between">
            <Form.Item
              name="content"
              rules={[
                {
                  validator() {
                    if (
                      !(
                        editorRef.current &&
                        typeof editorRef.current.getContent() === "string" &&
                        editorRef.current.getContent().length > 0
                      )
                    ) {
                      return Promise.reject("Privacy is required!");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <CustomEditor
                ref={editorRef}
                defaultValue={data?.data[0]?.content}
                init={{ statusbar: true }}
              />
            </Form.Item>

            <div className="flex justify-end pt-10">
              <Button
                loading={isLoading}
                size="large"
                htmlType="submit"
                type="primary"
                className="w-full max-w-[250px]"
              >
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default EditPrivacyPolicy;
