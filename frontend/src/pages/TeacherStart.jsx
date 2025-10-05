import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Assuming these custom components are in the specified path
import QuestionBox from "../components/QuestionBox";
import Badge from "../components/Badge";
import Button from "../components/Button";
import OptionBox from "../components/OptionBox";
import TimerSelect from "../components/TimerSelect";
import { useSocket } from "../server/useSocket";

function TeacherStart() {
    const navigate = useNavigate();
    const socket = useSocket();

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { id: 1, text: "Option 1", isCorrect: false },
        { id: 2, text: "Option 2", isCorrect: false },
    ]);
    const [timer, setTimer] = useState(60);

    const addOption = () => {
        const newId = options.length > 0 ? Math.max(...options.map((o) => o.id)) + 1 : 1;
        setOptions([...options, { id: newId, text: "", isCorrect: false }]);
    };

    const updateOption = (id, newText) => {
        setOptions(
            options.map((opt) => (opt.id === id ? { ...opt, text: newText } : opt))
        );
    };

    const toggleCorrect = (id, value) => {
        if (value === true) {
            // If an option is marked as correct...
            setOptions(
                options.map((opt) => ({
                    ...opt,
                    // ...set its 'isCorrect' to true, and all others to false.
                    isCorrect: opt.id === id,
                }))
            );
        } else {
            // If an option is marked as incorrect ("No")...
            setOptions(
                options.map((opt) =>
                    opt.id === id ? { ...opt, isCorrect: false } : opt
                )
            );
        }
    };

    const handleAskQuestion = () => {
        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }
        if (options.some((opt) => !opt.text.trim())) {
            alert("Please ensure all options have text.");
            return;
        }
        if (!options.some((opt) => opt.isCorrect)) {
            alert("Please mark one option as correct.");
            return;
        }

        console.log("Submitting poll:", { question, options, timer });
        socket.emit("add-question", { question, options, timer });
        navigate("/teacher/poll");
    };

    return (
        <div className="py-16 px-20 space-y-6 lg:max-w-5xl pb-28">
            <div>
                <Badge>Intervue Poll</Badge>
                <h1 className="text-3xl font-bold mt-2 text-gray-800">
                    Let's Get Started
                </h1>
                <p className="text-gray-500 mt-1">
                    You’ll have the ability to create and manage polls, ask questions,
                    and monitor your students' responses in real-time.
                </p>
            </div>

            <div className="flex items-center justify-between">
                <label className="text-gray-800 font-semibold" htmlFor="question-box">
                    Enter your question
                </label>
                <TimerSelect value={timer} onChange={setTimer} />
            </div>

            <QuestionBox
                id="question-box"
                value={question}
                maxLength={100}
                setQuestionParent={setQuestion}
            />

            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-black text-base">Edit Options</h2>
                <h2 className="font-semibold text-black text-base w-40 text-center">Is it Correct?</h2>
            </div>

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
                className="text-purple-600 border border-purple-300 px-4 py-2 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
            >
                + Add More option
            </button>

            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200">
                <div className="p-4 flex justify-end">
                    <Button text="Ask Question" onClick={handleAskQuestion} className="mt-0" />
                </div>
            </div>
        </div>
    );
}

export default TeacherStart;