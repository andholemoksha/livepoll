import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../server/useSocket";
import Poll from "../../src/model/Poll";

export default function TeacherPoll() {
    const socket = useSocket();
    const navigate = useNavigate();

    const [pollQuestion, setPollQuestion] = useState({
        question: "Waiting for question...", // Shows a default message
        options: [],
        timer: 0,
    });

    const [active, setActive] = useState(false);
    const [, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // CRITICAL FIX: All socket event listeners MUST be inside a single useEffect
    // hook that depends on the `socket` object.
    useEffect(() => {
        // If the socket isn't ready, do nothing. This effect will run again when it is.
        if (!socket) return;
        console.log("✅ Socket connection established:", socket); // <-- ADD THIS LINE

        // Handler functions are defined inside the effect that uses them
        const handleNewQuestion = ({ question, options, timer }) => {
            console.log("🟢 Received new question:", { question, options, timer });
            setPollQuestion({ question, options, timer });
            setActive(true);
            setShowHistory(false);
        };

        const handleVoteUpdate = ({ options }) => {
            console.log("🗳️ Vote update:", options);
            setPollQuestion((prev) => ({ ...prev, options }));
        };

        const handleQuestionEnded = () => {
            console.log("🔴 Question ended");
            setActive(false);
        };

        const handleHistory = (pollHistory) => {
            console.log("📜 Received poll history:", pollHistory);
            setHistory(pollHistory);
            setShowHistory(true);
        };

        // Register all events
        socket.on("new-question", handleNewQuestion);
        socket.on("vote-update", handleVoteUpdate);
        socket.on("question-ended-time", handleQuestionEnded);
        socket.on("question-ended-voted", handleQuestionEnded);
        socket.on("history", handleHistory);

        // Cleanup function to remove listeners when the component unmounts
        return () => {
            socket.off("new-question", handleNewQuestion);
            socket.off("vote-update", handleVoteUpdate);
            socket.off("question-ended-time", handleQuestionEnded);
            socket.off("question-ended-voted", handleQuestionEnded);
            socket.off("history", handleHistory);
        };
    }, [socket]); // The dependency array MUST include `socket`

    const askNewQuestion = () => {
        if (!active) navigate("/teacher");
    };

    const fetchHistory = () => {
        if (socket) socket.emit("history", {});
    };

    // --- The JSX remains the same ---
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative">
            <button
                className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center gap-2 font-semibold"
                onClick={fetchHistory}
            >
                <span>👁️</span> View Poll History
            </button>

            {!showHistory ? (
                <div className="w-full max-w-xl">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Question</h2>
                    <Poll
                        question={pollQuestion.question}
                        options={pollQuestion.options}
                        timer={pollQuestion.timer}
                        readOnly={true}
                    />
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={askNewQuestion}
                            disabled={active}
                            className="px-6 py-2.5 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            + Ask a new question
                        </button>
                    </div>
                </div>
            ) : (
                // History View...
                <div className="w-full max-w-2xl mt-16 space-y-6">
                    {/* ... history JSX ... */}
                </div>
            )}
        </div>
    );
}