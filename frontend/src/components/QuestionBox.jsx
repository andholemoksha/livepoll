import React, { useState } from "react";

const QuestionBox = ({ maxLength ,setQuestionParent}) => {
  const [question, setQuestion] = useState("");

  return (
    <div>
      <textarea
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          setQuestionParent(e.target.value);
        }}
        maxLength={maxLength}
        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        rows={3}
      />
      <div className="text-right text-gray-400 text-sm">{question.length}/{maxLength}</div>
    </div>
  );
};

export default QuestionBox;
