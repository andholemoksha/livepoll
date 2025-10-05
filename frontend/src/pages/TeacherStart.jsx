import React, { useState } from "react";
import QuestionBox from "../components/QuestionBox";
import Badge from "../components/Badge";
import Button from "../components/Button";
import OptionBox from "../components/OptionBox";
import { useNavigate } from "react-router-dom";


function TeacherStart() {
    const navigate = useNavigate();
    const socket = useSocket();
  
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
  ]);

  const addOption = () => {
    setOptions([...options, { id: options.length + 1, text: "", isCorrect: false }]);
  };

  const updateOption = (id, newText) => {
    setOptions(options.map(opt => (opt.id === id ? { ...opt, text: newText } : opt)));
  };

  const toggleCorrect = (id, value) => {
    setOptions(options.map(opt => (opt.id === id ? { ...opt, isCorrect: value } : opt)));
  };

  const handleAskQuestion = () => {
    console.log({ options });
    navigate("/teacher/poll");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8 space-y-6">
        <div>
          <Badge></Badge>
          <h1 className="text-2xl font-bold mt-2">Let's Get Started</h1>
          <p className="text-gray-500 mt-1">
            you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
          </p>
        </div>

        <div className="flex items-center justify-between w-full max-w-sm p-2">
        {/* Left text */}
        <span className="text-gray-800">Enter your question</span>

        {/* Right dropdown */}
        <select className="border border-gray-300 rounded px-2 py-1">
            <option value="option1">60 seconds</option>
            <option value="option2">30 seconds</option>
            <option value="option3">15 seconds</option>
        </select>
        </div>
        <QuestionBox maxLength={100} />

        <div className="space-y-4">
          {options.map((option) => (
            <OptionBox
              key={option.id}
              option={option}
              updateOption={updateOption}
              toggleCorrect={toggleCorrect}
            />
          ))}
        </div>

        <button
          onClick={addOption}
          className="text-purple-500 border border-purple-500 px-4 py-2 rounded hover:bg-purple-50"
        >
          + Add More option
        </button>

        <div className="flex justify-end">
            <Button
            text="Ask Question"
            onClick= {()=>handleAskQuestion()}
            ></Button>
        </div>
      </div>
    </div>
  );
}

export default TeacherStart;
