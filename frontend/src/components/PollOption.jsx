export default function PollOption({ number, text, percentage }){
    return (
    <div className="flex items-center justify-between bg-gray-100 rounded mb-2 p-2">
      {/* Option text with number */}
      <div className="flex items-center gap-2">
        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">{number}</span>
        <span className="text-gray-800">{text}</span>
      </div>

      {/* Conditionally render percentage bar */}
      {percentage !== undefined && (
        <div className="flex items-center gap-2 w-24">
          <div className="flex-1 bg-purple-500 h-4 rounded" style={{ width: `${percentage}%` }}></div>
          <span className="text-gray-700 text-sm">{percentage}%</span>
        </div>
      )}
    </div>
  );
}