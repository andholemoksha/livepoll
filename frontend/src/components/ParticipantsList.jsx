import React, { useEffect } from "react";
const ParticipantsList = ({
  participants,
  onKick,
}) => {
  return (
    <div className="p-4 bg-white h-64 overflow-y-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-300">
            <th className="pb-2">Name</th>
            <th className="pb-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, idx) => (
            <tr key={idx} className="border-b border-gray-100">
              <td className="py-2">{p.name}</td>
              <td
                className="py-2 text-right text-purple-600 cursor-pointer hover:underline"
                onClick={() => onKick(p.id)}
              >
                Kick out
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsList;
