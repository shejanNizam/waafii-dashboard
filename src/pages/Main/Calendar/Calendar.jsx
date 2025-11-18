import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Calendar,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Spin,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { DeleteConfirmationModal } from "../../../components/DeleteConfirmationModal";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetAllEventsQuery,
} from "../../../redux/features/calendarApi/calendarApi";
import { ErrorSwal, SuccessSwal } from "../../../utils/allSwalFire";

const { TextArea, Title } = Input;
const STATUS_OPTIONS = [{ value: "Upcoming", label: "Upcoming" }];

const MAX_WORDS = 100;
const DEFAULT_LIMIT = 5;

const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const validateDescription = (_, value) => {
  if (value && countWords(value) > MAX_WORDS) {
    return Promise.reject(
      new Error(`Description must be ${MAX_WORDS} words or less.`)
    );
  }
  return Promise.resolve();
};

export default function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [wordCount, setWordCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_LIMIT);

  // Updated state structure to hold event details
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null); // { _id: string, name: string }

  const {
    data: allEventsData,
    isLoading: isEventsLoading,
    isError: isEventsError,
    refetch,
  } = useGetAllEventsQuery({
    eventDate: selectedDate.format("YYYY-MM-DD"),
    page: currentPage,
    limit: pageSize,
  });

  const [createEvent, { isLoading: isCreatingEvent }] =
    useCreateEventMutation();

  const [deleteEvent, { isLoading: isDeletingEvent }] =
    useDeleteEventMutation();

  const events = allEventsData?.data?.result || [];
  const totalEvents = allEventsData?.data?.meta?.total || 0;

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    form.setFieldsValue({
      date: selectedDate,
      // Default times to help user fill form quickly
      startTime: dayjs("09:00", "HH:mm"),
      endTime: dayjs("10:00", "HH:mm"),
    });
    setWordCount(0);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setWordCount(0);
  };

  // UPDATED: Capture both ID and Name
  const handleShowDeleteModal = (eventId, eventName) => {
    setEventToDelete({ _id: eventId, name: eventName });
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setEventToDelete(null);
  };

  const handleCreateEvent = async (values) => {
    const payload = {
      name: values.eventName,
      startTime: values.startTime.format("h:mm A"),
      endTime: values.endTime.format("h:mm A"),
      eventDate: values.date.format("YYYY-MM-DD"),
      description: values.description || "",
      status: values.status,
    };

    if (countWords(values.description) > MAX_WORDS) {
      console.error("Word count exceeds limit.");
      return;
    }

    try {
      const response = await createEvent(payload).unwrap();
      handleCancel();
      setCurrentPage(1);
      refetch();
      SuccessSwal({
        title: "",
        text:
          response?.data?.message || response?.message || "Static create event",
      });
      // message.success("Event created successfully! 🎉");
    } catch (err) {
      ErrorSwal({
        title: "",
        text: err?.data?.message || err?.message || "!",
      });
    }
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      const response = await deleteEvent(eventToDelete._id).unwrap();

      message.success(`Event "${eventToDelete.name}" deleted successfully!`);
      SuccessSwal({
        title: "",
        text:
          response?.data?.message || response?.message || "Static create event",
      });
      handleCancelDelete();

      refetch();

      // Logic to adjust page after deletion if the last item was deleted
      const newTotal = totalEvents - 1;
      const newTotalPages = Math.ceil(newTotal / pageSize);
      if (events.length === 1 && currentPage > 1) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      ErrorSwal({
        title: "",
        text: err?.data?.message || err?.message || "!",
      });
      handleCancelDelete();
    }
  };

  const handleCalendarChange = (date) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  // Content rendering based on loading/error/data state
  let eventsContent;
  if (isEventsLoading) {
    eventsContent = (
      <div className="text-center p-8">
        <Spin size="large" />
        <p className="mt-2 text-gray-500">Loading events...</p>
      </div>
    );
  } else if (isEventsError) {
    eventsContent = (
      <Alert
        message="Error"
        description="Failed to load events. Please try again."
        type="error"
        showIcon
      />
    );
  } else if (events.length === 0) {
    eventsContent = (
      <p className="text-gray-500 italic p-4 bg-white rounded-lg border border-gray-100">
        No events scheduled for this day. 🎉
      </p>
    );
  } else {
    eventsContent = (
      <div className="space-y-3">
        {events?.map((event) => (
          <div
            key={event._id}
            className={`border rounded-lg p-4 hover:shadow-sm transition-shadow ${
              event.status === "Upcoming"
                ? "bg-blue-50 border-blue-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900">{event.name}</div>
                <div className="text-sm text-gray-500 font-mono">
                  {event.startTime} - {event.endTime}
                </div>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-1 italic line-clamp-2 text-wrap">
                    {event.description}
                  </p>
                )}
              </div>
              <Button
                icon={<DeleteOutlined />}
                size="large"
                type="default"
                danger
                onClick={() => handleShowDeleteModal(event._id, event.name)}
                disabled={isDeletingEvent}
                aria-label={`Delete ${event.name}`}
                className="opacity-70 hover:!opacity-100 "
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 md:p-4">
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Event Calendar 📅</h1>

        <Calendar
          fullscreen={false}
          value={selectedDate}
          onChange={handleCalendarChange}
          className="bg-white rounded-lg shadow-sm w-full relative"
        />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Events on {selectedDate.format("MMMM DD, YYYY")}
            </h3>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Add New Event
            </Button>
          </div>

          {eventsContent}

          {totalEvents > 0 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalEvents}
                showSizeChanger={false}
                showQuickJumper
                onChange={onPaginationChange}
                responsive
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        closeIcon={<CloseOutlined />}
        width={450}
        centered
        title={
          <h2 className="text-xl font-semibold text-center">Add New Event</h2>
        }
      >
        <div className="py-4">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateEvent}
            requiredMark={true}
          >
            <Form.Item
              name="eventName"
              label="Event Name"
              rules={[{ required: true, message: "Please enter event name" }]}
            >
              <Input
                placeholder="Team Meeting, Deadline, etc."
                size="large"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="date"
              label="Event Date"
              rules={[{ required: true, message: "Please select date" }]}
              initialValue={selectedDate}
            >
              <DatePicker
                placeholder="Select Date"
                size="large"
                className="w-full rounded-md"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="startTime"
                label="Start Time"
                rules={[{ required: true, message: "Select start time" }]}
                initialValue={dayjs("09:00", "HH:mm")}
              >
                <TimePicker
                  use12Hours
                  format="h:mm A"
                  placeholder="Start time"
                  size="large"
                  className="w-full"
                  minuteStep={5}
                />
              </Form.Item>
              <Form.Item
                name="endTime"
                label="End Time"
                rules={[{ required: true, message: "Select end time" }]}
                initialValue={dayjs("10:00", "HH:mm")}
              >
                <TimePicker
                  use12Hours
                  format="h:mm A"
                  placeholder="End time"
                  size="large"
                  className="w-full"
                  minuteStep={5}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="status"
              label="Status"
              initialValue="Upcoming"
              rules={[
                { required: true, message: "Please select event status" },
              ]}
            >
              <Select
                placeholder="Select Status"
                size="large"
                options={STATUS_OPTIONS}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={`Description (Max ${MAX_WORDS} words)`}
              rules={[{ validator: validateDescription }]}
            >
              <TextArea
                placeholder="Set deadlines for deliverables, attendees, or other details."
                rows={4}
                showCount={false}
                onChange={(e) => {
                  const currentWordCount = countWords(e.target.value);
                  setWordCount(currentWordCount);

                  if (currentWordCount > MAX_WORDS) {
                    const words = e.target.value
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean);
                    const truncatedText = words.slice(0, MAX_WORDS).join(" ");
                    form.setFieldsValue({ description: truncatedText });
                    setWordCount(MAX_WORDS);
                  }
                }}
              />
            </Form.Item>

            <div
              className={`text-right text-sm -mt-2 ${
                wordCount > MAX_WORDS
                  ? "text-red-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {wordCount} / {MAX_WORDS} words
            </div>

            <Form.Item className="mb-0 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-blue-600 hover:!bg-blue-700 h-12 rounded-md font-medium"
                loading={isCreatingEvent}
              >
                {isCreatingEvent ? "Creating..." : "Create Event"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* The separate Delete Confirmation Modal (Enhanced) */}
      {eventToDelete && (
        <DeleteConfirmationModal
          isVisible={isDeleteModalVisible}
          onClose={handleCancelDelete}
          event={eventToDelete}
          onConfirm={confirmDeleteEvent}
          isDeleting={isDeletingEvent}
        />
      )}
    </div>
  );
}
