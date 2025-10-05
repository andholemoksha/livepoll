import { useState } from "react";
import Button from "../components/Button";
import Poll from "../model/Poll";
import { useSocket } from "../server/useSocket";

export default function StudentPoll() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [active, setActive] = useState(false);

  const handleSubmit = () => {
    console.log("Submit answer");
    if (selectedOption === null) {
      alert("Please select an answer before submitting!");
      return;
    }
    socket.emit("vote", { optionIndex: selectedOption });
    setSubmitted(true);
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
    setSubmitted(false);
    setActive(true);
    setSelectedOption(null);
  });
  socket.on("vote-update", ({ options }) => {
    setPollQuestion((prev) => ({ ...prev, options }));
  });
  socket.on("question-ended-time", ({ question }) => {
    console.log("Question ended(time):", question);
    // setActive(false);
  });
  socket.on("question-ended-voted", ({ question }) => {
    console.log("Question ended(voted):", question);
    setActive(false);
  });
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
      {/* Centered Poll */}
      {pollQuestion.options ? (
        <div>
          <Poll
            question={pollQuestion.question}
            options={
              submitted
                ? pollQuestion.options
                : pollQuestion.options.map((opt) => ({
                    text: opt.text,
                    id: opt.id,
                  }))
            }
            timer={active ? pollQuestion.timer : null}
            setIndex={setSelectedOption}
            readOnly={submitted}
          />
          {!submitted && <Button text="Submit" onClick={handleSubmit}></Button>}
        </div>
      ) : (
        <h2>Waiting for the teacher to ask a question...</h2>
      )}
      {submitted && <h2>Waiting for the teacher to ask new question.</h2>}
    </div>
  );
}
