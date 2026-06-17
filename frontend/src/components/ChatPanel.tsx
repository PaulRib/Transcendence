import * as React from 'react';

function ChatPanel() {
  return (
    React.createElement(
      "PageContainer",
      { className: "chat-panel" },
      React.createElement("h2", null, "Chat"),
      React.createElement(
        "div",
        { className: "chat-messages" },
        React.createElement("p", null, "No messages yet.")
      ),
      React.createElement(
        "form",
        { className: "chat-form" },
        React.createElement("input", { type: "text", placeholder: "Write a message..." }),
        React.createElement("button", { type: "submit" }, "Send")
      )
    )
  );
}

export default ChatPanel;
/* Temp Chat de test*/