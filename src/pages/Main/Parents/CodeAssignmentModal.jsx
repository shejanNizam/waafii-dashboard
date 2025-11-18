import { Button, Form, Input, Modal, Select } from "antd";

const { Option } = Select;

export default function CodeAssignmentModal({
  isVisible,
  onClose,
  professional,
  onSubmit,
  isLoadingAssignProf,
}) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const payload = {
      professional_id: professional._id,
      subject: values.subject,
      code: values.code,
    };
    // console.log(payload);

    onSubmit(payload);
    onClose();
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`Assign Code to ${professional?.name || "Professional"}`}
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
    >
      <p className="mb-4 text-gray-600">
        Select subject & Enter a unique 6 digit code for{" "}
        <strong className="text-blue-600">{professional?.name}</strong>.
      </p>
      <Form
        form={form}
        name="code_assignment"
        onFinish={handleFinish}
        layout="vertical"
      >
        {/* New Select Field for Subject */}
        <Form.Item
          name="subject"
          label="Select Subject"
          rules={[{ required: true, message: "Please select a subject!" }]}
        >
          <Select
            placeholder="Select a subject for session"
            size="large"
            className="rounded-lg"
            allowClear
          >
            {/* Map professional.subjects to Select Options */}
            {professional?.subjects?.map((subject) => (
              <Option key={subject} value={subject}>
                {subject}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* End of New Select Field */}

        <Form.Item
          name="code"
          label="Assignment Code"
          rules={[
            { required: true, message: "Please input the assignment code!" },
            {
              pattern: /^\d{6}$/,
              message: "Code must be 6 digits.",
            },
          ]}
        >
          <Input
            placeholder="e.g., 123456"
            maxLength={6}
            type="number"
            className="rounded-lg"
            size="large"
          />
        </Form.Item>
        <Form.Item className="mt-6 mb-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold w-full"
            loading={isLoadingAssignProf}
          >
            Submit Assignment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
