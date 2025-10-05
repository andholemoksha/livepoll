import { useEffect, useState } from "react";
import PollOption from "../components/PollOption";
import { useSocket } from "../server/useSocket";

export default function Poll({
  question,
  options,
  timer,
  readOnly = false,
  setIndex,
  selectedIndex,
}) {
  const socket = useSocket();
  const [selectedOption, setSelectedOption] = useState(selectedIndex);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [active, setActive] = useState(true);
  useEffect(() => {
    setSelectedOption(null);
  }, [timer, question]);

  useEffect(() => {
    const handleTimeLeft = ({ timeLeft }) => {
      console.log("⏱️ Time left update:", timeLeft);
      setTimeLeft(timeLeft);
    };
    const handleQuestionEndedVoted = ({ question }) => {
      console.log("🔴 Question ended (voted):", question);
      setActive(false);
    };
    socket.on("time-left", handleTimeLeft);
    socket.on("question-ended-voted", handleQuestionEndedVoted);
  }, []);

  useEffect(() => {
    if (!readOnly) setIndex(selectedOption);
  }, [selectedOption]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow bg-white">
      {active &&
        (timeLeft > 0 ? (
          <span className="text-sm bg-purple-600 text-white px-2 py-1 rounded">
            ⏱ {timeLeft}s
          </span>
        ) : (
          <span className="text-sm bg-red-600 text-white px-2 py-1 rounded">
            ⏳ Time’s up
          </span>
        ))}
      <div className="bg-gray-700 text-white px-3 py-2 rounded-t mt-3">
        {question}
      </div>

      <div className="mt-4">
        {options.map((option, index) => (
          <PollOption
            key={index}
            number={index + 1}
            text={option.text}
            percentage={option.percentage ?? 0}
            selected={selectedOption === index}
            onClick={() => {
              if (!readOnly) setSelectedOption(index);
            }}
            readOnly={readOnly} // disable in teacher mode
          />
        ))}
      </div>
    </div>
  );
}
