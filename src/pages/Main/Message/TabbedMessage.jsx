import { Tabs } from "antd";
import Message from "./Message";

export default function TabbedMessage() {
  const items = [
    {
      key: "1",
      label: <span className="font-bold text-xl">Chats</span>,
      children: <Message type="individual" />,
    },
    {
      key: "2",
      label: <span className="font-bold text-xl">Announcement</span>,
      children: <Message type="group" />,
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
}
