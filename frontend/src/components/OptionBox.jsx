import React from "react";

const OptionBox = ({ option, updateOption, toggleCorrect }) => {
  return (
    <div className="flex items-center space-x-4">
      <span className="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-500 rounded-full">
        {option.id}
      </span>
      <input
        type="text"
        value={option.text}
        onChange={(e) => updateOption(option.id, e.target.value)}
        placeholder="Option text"
        className="flex-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="flex items-center space-x-2">
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            checked={option.isCorrect === true}
            onChange={() => toggleCorrect(option.id, true)}
            className="accent-purple-500"
          />
          <span>Yes</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            checked={option.isCorrect === false}
            onChange={() => toggleCorrect(option.id, false)}
            className="accent-purple-500"
          />
          <span>No</span>
        </label>
      </div>
    </div>
  );
};

export default OptionBox;
