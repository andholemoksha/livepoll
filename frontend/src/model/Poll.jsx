import { useState } from "react";
import PollOption from "../components/PollOption";
import { useEffect } from "react";

export default function Poll({ question, options, timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);
  useEffect(() => {
    setRemainingTime(timer); // reset whenever new poll question arrives
  }, [timer, question]);

  useEffect(() => {
    if (!remainingTime || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      {remainingTime > 0 ? (
        <span className="text-sm bg-purple-600 px-2 py-1 rounded">
          ⏱ {remainingTime}s
        </span>
      ) : (
        <span className="text-sm bg-red-600 px-2 py-1 rounded">
          ⏳ Time’s up
        </span>
      )}
      <div className="bg-gray-700 text-white px-3 py-2 rounded-t">
        {question}
      </div>
      <div className="mt-4">
        {options.map((option, index) => (
          <PollOption
            key={index}
            number={index + 1}
            text={option.text}
            percentage={option.percentage}
          />
        ))}
      </div>
    </div>
  );
}
