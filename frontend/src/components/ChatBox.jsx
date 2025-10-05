import React from "react";

const ChatBox= ({ messages }) => {
  return (
    <div className="p-4 h-64 overflow-y-auto bg-white">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex mb-3 ${
            msg.side === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <div  
            className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
              msg.side === "right"
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <strong className="block text-xs mb-1">{msg.user}</strong>
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
