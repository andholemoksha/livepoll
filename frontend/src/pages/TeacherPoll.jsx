import { useState, useEffect } from "react";
import Poll from "../model/Poll";
import Button from "../components/Button";
import ChatBox from "../components/ChatBox";
import ParticipantsList from "../components/ParticipantsList";
import TabPanel from "../components/TabPanel";
import { MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../server/useSocket";

export default function TeacherPoll() {
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Chat");
  const [showChatPanel, setShowChatPanel] = useState(false);
  const handleKick = (id) => {
    console.log(`Kicked out ${id}`);
    socket.emit("kick-student", { studentId: id });
  };
  const [correctOption, setCorrectOption] = useState(null);

  const [pollQuestion, setPollQuestion] = useState({
    question: "Waiting for question...", // Shows a default message
    options: [],
    timer: 0,
  });

  const [active, setActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState(location.state?.messages || []);

  const handleNewQuestion = ({ question, options, timer }) => {
    console.log("🟢 Received new question:", { question, options, timer });
    setPollQuestion({ question, options, timer });
    setActive(true);
    setShowHistory(false);
    setCorrectOption(null);
    socket.emit("get-participants", {});
  };
  socket.on("new-question", handleNewQuestion);
  // ✅ Register all socket listeners safely inside one effect
  useEffect(() => {
    if (!socket) return; // wait until socket is ready

    const handleVoteUpdate = ({ options }) => {
      console.log("🗳️ Vote update:", options);
      setPollQuestion((prev) => ({ ...prev, options }));
    };
    const handleQuestionEnded = ({ option }) => {
      console.log("🔴 Correct option (voted):", option);
      setCorrectOption(option);
      setActive(false);
    };
    const handleHistory = (pollHistory) => {
      console.log("📜 Received poll history:", pollHistory);
      setHistory(pollHistory);
      setShowHistory(true);
    };

    const handleParticipants = ({ students }) => {
      console.log("Participant List:", students);
      setParticipants(students);
    };

    const handleMessage = ({ message, sender, senderId }) => {
      if (senderId !== socket.id) {
        setMessages((prev) => [
          ...prev,
          { text: message, user: sender, side: "left" },
        ]);
      }
    };

    // Register all events
    socket.on("chat-message", handleMessage);
    socket.on("new-question", handleNewQuestion);
    socket.on("vote-update", handleVoteUpdate);
    socket.on("question-ended-time", handleQuestionEnded);
    socket.on("question-ended-voted", handleQuestionEnded);
    socket.on("history", handleHistory);
    socket.on("participants", handleParticipants);

    // Cleanup when component unmounts or socket changes
    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("vote-update", handleVoteUpdate);
      socket.off("question-ended-time", handleQuestionEnded);
      socket.off("chat-message", handleMessage);
      socket.off("question-ended-voted", handleQuestionEnded);
      socket.off("history", handleHistory);
      socket.off("participants", handleParticipants);
    };
  }, [socket]);

  // Navigate to ask new question
  const askNewQuestion = () => {
    if (!active) navigate("/teacher", { state: { messages: messages } });
  };

  // Request history from server
  const fetchHistory = () => {
    if (socket) socket.emit("history", {});
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
      {/* View Poll History button */}
      <button
        className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-1"
        onClick={fetchHistory}
      >
        <span>👁️</span> View Poll History
      </button>

      {!showHistory ? (
        <div className="w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Question</h2>
          <Poll
            question={pollQuestion.question}
            options={pollQuestion.options}
            timer={pollQuestion.timer}
            readOnly={true}
            correctOption={correctOption}
          />
          <div className="mt-6 flex justify-end">
            <button
              onClick={askNewQuestion}
              disabled={active}
              className="px-6 py-2.5 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Ask a new question
            </button>
          </div>
        </div>
      ) : (
        // History View...
        <div className="w-full max-w-2xl mt-16 space-y-6">
          {history.length > 0 ? (
            history.map((poll, index) => (
              <Poll
                key={index}
                question={poll.question}
                options={poll.options}
                timer={poll.timer || 0}
                readOnly={true}
                correctOption={poll.correct}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">No past polls found.</p>
          )}

          <div className="flex justify-center mt-6">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setShowHistory(false)}
            >
              ⬅ Back to Current Poll
            </button>
          </div>
        </div>
      )}
      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatPanel(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105"
      >
        <MessageSquare size={22} />
      </button>
      {/* Chat/Participants Modal */}
      {showChatPanel && (
        <div className="z-50 fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 animate-slide-up">
          {/* Header Tabs */}
          <div className="flex justify-between items-center border-b border-gray-300">
            <TabPanel
              tabs={["Chat", "Participants"]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <button
              className="text-gray-500 text-lg px-3 hover:text-gray-800"
              onClick={() => setShowChatPanel(false)}
            >
              ✕
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "Chat" ? (
            <ChatBox messages={messages} setMessages={setMessages} />
          ) : (
            <ParticipantsList participants={participants} onKick={handleKick} />
          )}
        </div>
      )}
    </div>
  );
}
