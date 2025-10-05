import { useEffect, useState } from "react";
import PollOption from "../components/PollOption";
import { useSocket } from "../server/useSocket";

export default function Poll({ question, options }) {
 
  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
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
