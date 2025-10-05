import React from "react";

export default function TimerSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value={60}>60 seconds</option>
      <option value={30}>30 seconds</option>
      <option value={15}>15 seconds</option>
    </select>
  );
}
