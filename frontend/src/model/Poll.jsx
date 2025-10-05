import { useEffect, useState } from "react";
import PollOption from "../components/PollOption";
import { useSocket } from "./useSocket";

export default function Poll({ question, options }) {
  const socket = useSocket();
  const { optionState, setOptionsState } = useState(options);

  useEffect(() => {
    socket.on("vote-update", (pollResults) => {
      console.log("New poll results:", pollResults);
      setOptionsState(pollResults);
    });

    return () => {
      socket.off("vote-update");
    };
  }, [socket, optionsState]);

  
  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <div className="bg-gray-700 text-white px-3 py-2 rounded-t">
        {question}
      </div>

      <div className="mt-4">
        {optionState.map((option, index) => (
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
