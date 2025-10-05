import { useState } from "react";
import Button from "../components/Button";
import Poll from "../model/Poll";
import { useSocket } from "../server/useSocket";

export default function StudentPoll() {
  const [selectedOption, setSelectedOption] = useState(null);
  const handleSubmit = () => {
    console.log("Submit answer");
    if (selectedOption === null) {
      alert("Please select an answer before submitting!");
      return;
    }
    socket.emit("vote", { optionIndex : selectedOption });
  };
  const [pollQuestion, setPollQuestion] = useState({
    question: "",
    options: null,
    timer: 60,
  });
  const socket = useSocket();
  socket.on("new-question", ({ question, options, timer }) => {
    console.log(
      "Received new question:",
      JSON.stringify({ question, options, timer })
    );
    setPollQuestion({ question, options, timer });
  });
  socket.on("vote-update", ({ options }) => {
    setPollQuestion((prev) => ({ ...prev, options }));
  });
  socket.on("question-ended", ({ question }) => {
    console.log("Question ended:", question);
    setPollQuestion({
      question: "",
      options: null,
      timer: 60,
    });
  });
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
      {/* Centered Poll */}
      {pollQuestion.options ? (
        <div>
          <Poll
            question={pollQuestion.question}
            options={pollQuestion.options}
            timer={pollQuestion.timer}
            setIndex = {setSelectedOption}
          />
          <Button text="Submit" onClick={handleSubmit}></Button>
        </div>
      ) : (
        <p>Waiting for question...</p>
      )}{" "}
    </div>
  );
}
