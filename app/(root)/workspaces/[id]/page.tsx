import ChatView from "@/components/chat/Chat";
import React from "react";

const WorkspaceSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4">
      <ChatView />
      <section className="col-span-3"></section>
    </section>
  );
};

export default WorkspaceSection;
