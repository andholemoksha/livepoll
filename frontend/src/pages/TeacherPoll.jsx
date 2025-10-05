import { useState } from "react";
import Poll from "../model/Poll";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../server/useSocket";

export default function TeacherPoll() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [pollQuestion, setPollQuestion] = useState({
    question: "",
    options: null,
    timer: 60,
  });

  const [active, setActive] = useState(false);

  socket.on("new-question", ({ question, options, timer }) => {
    console.log(
      "Received new question:",
      JSON.stringify({ question, options, timer })
    );
    setPollQuestion({ question, options, timer });
    setActive(true);
  });
  socket.on("vote-update", ({ options }) => {
    setPollQuestion((prev) => ({ ...prev, options }));
  });
  socket.on("question-ended", ({ question }) => {
    console.log("Question ended:", question);
    setActive(false);
  });

  const askNewQuestion = () => {
    !active && navigate("/teacher");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
      {/* View Poll History button at top-right */}
      <button className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-1">
        <span>👁️</span> View Poll History
      </button>

      {/* Centered Poll */}
      {active ? (
        <Poll question={pollQuestion.question} options={pollQuestion.options} timer={pollQuestion.timer} />
      ) : (
        <p>Waiting for question...</p>
      )}

      {/* Add New Question button just below poll, aligned right */}
      <div className="w-full max-w-md flex justify-end mt-4">
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          onClick={askNewQuestion}
        >
          + Ask a New Question
        </button>
      </div>
    </div>
  );
}
