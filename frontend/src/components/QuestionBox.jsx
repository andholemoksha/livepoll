import React from "react";

function QuestionBox({ id, value, maxLength, setQuestionParent }) {
    const handleChange = (event) => {
        if (event.target.value.length <= maxLength) {
            setQuestionParent(event.target.value);
        }
    };

    return (
        <div className="relative w-full">
            <textarea
                id={id}
                className="w-full min-h-[120px] p-4 text-lg border-none rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-800"
                placeholder="Enter your question here..."
                value={value}
                onChange={handleChange}
                maxLength={maxLength}
            ></textarea>
            <div className="absolute bottom-6 right-4 text-xs text-black">
                {value.length}/{maxLength}
            </div>
        </div>
    );
}

export default QuestionBox;