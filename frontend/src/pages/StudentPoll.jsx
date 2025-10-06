import { useState, useEffect } from "react";
import Button from "../components/Button";
import Poll from "../model/Poll";
import { useSocket } from "../server/useSocket";
import { useNavigate } from "react-router-dom";
import TabPanel from "../components/TabPanel";
import ChatBox from "../components/ChatBox";
import ParticipantsList from "../components/ParticipantsList";
import { MessageSquare } from "lucide-react";

export default function StudentPoll() {
  const socket = useSocket();

  const [activeTab, setActiveTab] = useState("Chat");
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [messages, setMessages] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [correctOption, setCorrectOption] = useState(null);
  const [participants, setParticipants] = useState([]);

  const [pollQuestion, setPollQuestion] = useState({
    question: "",
    options: null,
    timer: 60,
  });

  // ✅ Register all socket listeners in useEffect
  useEffect(() => {
    if (!socket) return;

    const handleNewQuestion = ({ question, options, timer }) => {
      console.log("🟢 Received new question:", { question, options, timer });
      setPollQuestion({ question, options, timer });
      setSubmitted(false);
      setActive(true);
      setSelectedOption(null);
      setCorrectOption(null);
    };

    const handleVoteUpdate = ({ options }) => {
      console.log("🗳️ Vote update:", options);
      setPollQuestion((prev) => ({ ...prev, options }));
    };

    const handleQuestionEndedTime = ({ option }) => {
      console.log("⏰ Correct option (time):", option);
      setCorrectOption(option);
      setActive(false);
    };

    const handleQuestionEndedVoted = ({ option }) => {
      console.log("🔴 Correct option (voted):", option);
      setCorrectOption(option);
      setActive(false);
    };
    const handleKicked = ({ message }) => {
      console.log("🔴 Kicked:", message);
      navigate("/student/kicked"); // Redirect to home or login page
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

    socket.on("chat-message", handleMessage);
    socket.on("new-question", handleNewQuestion);
    socket.on("vote-update", handleVoteUpdate);
    socket.on("question-ended-time", handleQuestionEndedTime);
    socket.on("question-ended-voted", handleQuestionEndedVoted);
    socket.on("kicked", handleKicked);
    socket.on("participants", handleParticipants);

    // Cleanup listeners on unmount
    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("chat-message", handleMessage);
      socket.off("vote-update", handleVoteUpdate);
      socket.off("question-ended-time", handleQuestionEndedTime);
      socket.off("question-ended-voted", handleQuestionEndedVoted);
      socket.off("kicked", handleKicked);
      socket.off("participants", handleParticipants);
    };
  }, [socket]);

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert("Please select an answer before submitting!");
      return;
    }
    console.log("🟣 Submitting answer:", selectedOption);
    socket.emit("vote", { optionIndex: selectedOption });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
      {/* Centered Poll */}
      {pollQuestion.options ? (
        <div>
          <Poll
            question={pollQuestion.question}
            options={
              submitted
                ? pollQuestion.options // show with vote counts
                : pollQuestion.options.map((opt) => ({
                    text: opt.text,
                    id: opt.id,
                  }))
            }
            timer={active ? pollQuestion.timer : null}
            setIndex={setSelectedOption}
            selectedIndex={selectedOption}
            readOnly={submitted}
            correctOption={correctOption}
          />

          {!submitted && <Button text="Submit" onClick={handleSubmit} />}
        </div>
      ) : (
        <h2 className="text-lg font-semibold text-gray-700">
          Waiting for the teacher to ask a question...
        </h2>
      )}

      {submitted && (
        <h2 className="text-lg text-gray-700 mt-4">
          Waiting for the teacher to ask a new question.
        </h2>
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
        <div className=" z-50 fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 animate-slide-up">
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
            <ParticipantsList participants={participants} role="student" />
          )}
        </div>
      )}
    </div>
  );
}
