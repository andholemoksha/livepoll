import { useState } from "react";
import Poll from "../model/Poll";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../server/useSocket";

export default function StudentPollSubmit() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [pollQuestion, setPollQuestion] = useState({
    question: "",
    options: [],
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
    console.log("Vote update received:", options);
    setPollQuestion((prev) => ({ ...prev, options }));
  });
  socket.on("question-ended", ({ question }) => {
    console.log("Question ended:", question);
    //setActive(false);
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">

      {/* Centered Poll */}
      
        <Poll
          question={pollQuestion.question}
          options={pollQuestion.options}
          timer={pollQuestion.timer}
          readOnly={true}  
        />
        <h2>Waiting for the teacher to ask new question.</h2>
    </div>
  );
}
