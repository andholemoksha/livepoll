// export default function PollOption({ number, text, percentage }){
//     return (
//     <div className="flex items-center justify-between bg-gray-100 rounded mb-2 p-2">
//       {/* Option text with number */}
//       <div className="flex items-center gap-2">
//         <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">{number}</span>
//         <span className="text-gray-800">{text}</span>
//       </div>

//       {/* Percentage bar */}
//       <div className="flex items-center gap-2 w-24">
//         <div className="flex-1 bg-purple-500 h-4 rounded" style={{ width: `${percentage}%` }}></div>
//         <span className="text-gray-700 text-sm">{percentage}%</span>
//       </div>
//     </div>
//   );
// }

export default function PollOption({
  number,
  text,
  percentage,
  selected,
  onClick,
  readOnly = false,
}) {
  return (
    <div
      onClick={!readOnly ? onClick : undefined}
      className={`border rounded-xl p-4 w-full mb-3 transition-all duration-200 flex items-center justify-between
        ${
          selected
            ? "border-2 border-purple-600 bg-purple-50 shadow-md"
            : "border border-gray-300 bg-white"
        }
        ${!readOnly ? "cursor-pointer hover:border-purple-400 hover:bg-gray-50" : "cursor-default opacity-90"}
      `}
    >
      {/* Option text */}
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold
            ${
              selected
                ? "bg-purple-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
        >
          {number}
        </span>
        <span
          className={`text-gray-800 text-base ${
            selected ? "font-semibold text-purple-700" : ""
          }`}
        >
          {text}
        </span>
      </div>

      {/* Conditionally render percentage bar */}
      {percentage !== undefined && (
        <div className="flex items-center gap-2 w-28">
          <div
            className="flex-1 bg-purple-500 h-3 rounded"
            style={{ width: `${percentage}%` }}
          ></div>
          <span className="text-gray-700 text-sm font-medium">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}
