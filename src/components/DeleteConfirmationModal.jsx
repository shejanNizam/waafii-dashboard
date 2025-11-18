// --- DEDICATED DELETE MODAL COMPONENT ---
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

export function DeleteConfirmationModal({
  isVisible,
  onClose,
  material,
  onConfirm,
  isDeleting,
}) {
  const name = material?.title || "this material";

  return (
    <Modal
      centered
      title={
        <span className="text-xl font-bold text-red-600">
          <DeleteOutlined className="mr-2" /> Confirm Material Deletion
        </span>
      }
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} className="rounded-lg">
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          loading={isDeleting}
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
        >
          Yes, Delete
        </Button>,
      ]}
    >
      <div className="py-4">
        <p className="text-gray-700 text-lg">
          Are you sure you want to **permanently delete** the material: **{name}
          **?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This action will permanently remove the file and its record. This
          action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
// ----------------------------------------
