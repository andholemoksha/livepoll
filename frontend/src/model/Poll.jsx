import { useEffect, useState } from "react";
import PollOption from "../components/PollOption";

export default function Poll({ question, options, timer, readOnly = false , setIndex}) {
  const [remainingTime, setRemainingTime] = useState(timer);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setRemainingTime(timer);
    setSelectedOption(null);
  }, [timer, question]);

  useEffect(() => {
    if (!remainingTime || remainingTime <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingTime]);

  useEffect(()=>{
    if(!readOnly) setIndex(selectedOption);
  },[selectedOption])

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow bg-white">
      {remainingTime > 0 ? (
        <span className="text-sm bg-purple-600 text-white px-2 py-1 rounded">
          ⏱ {remainingTime}s
        </span>
      ) : (
        <span className="text-sm bg-red-600 text-white px-2 py-1 rounded">
          ⏳ Time’s up
        </span>
      )}
      <div className="bg-gray-700 text-white px-3 py-2 rounded-t mt-3">
        {question}
      </div>

      <div className="mt-4">
        {options.map((option, index) => (
          <PollOption
            key= {index}
            number={index+1}
            text={option.text}
            percentage={option.percentage}
            selected={selectedOption === index}
            onClick={() => !readOnly && setSelectedOption(index)}
            readOnly={readOnly} // disable in teacher mode
          />
        ))}
      </div>
    </div>
  );
}
