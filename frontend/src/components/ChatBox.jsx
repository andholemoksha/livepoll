import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useSocket } from "../server/useSocket";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useSocket();

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage= {
      user: "You",
      text: input,
      side: "right",
    };

    // Add message locally
    setMessages((prev) => [...prev, newMessage]);

    // Call parent callback (e.g., emit to socket)
    socket.emit("chat-message",{message:newMessage.text});
    
    // Clear input
    setInput("");
  };
  useEffect(()=>{
    socket.on("chat-message",handleMessage);
  },[])
  const handleMessage = ({message,sender,senderId})=>{
    if(senderId !== socket.id){
      setMessages((prev)=>[...prev, {text:message,user:sender,side:"left"}])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-72 bg-white">
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
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

      {/* Input section */}
      <div className="border-t border-gray-200 flex items-center p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
