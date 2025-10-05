import { useState, useEffect } from "react";
import Poll from "../model/Poll";
import Button from "../components/Button"
import { useNavigate } from "react-router-dom";
import { useSocket } from "../server/useSocket";
import ChatBox from "../components/ChatBox";
import ParticipantsList from "../components/ParticipantsList";
import TabPanel from "../components/TabPanel";
import { MessageSquare } from "lucide-react";


export default function TeacherPoll() {
    const [activeTab, setActiveTab] = useState("Chat");
    const [showChatPanel, setShowChatPanel] = useState(false);

    const messages = [
        { user: "User1", text: "Hey there, how can I help?", side: "left" },
        { user: "User2", text: "Nothing bro, just chill.", side: "right" },
    ];

    const handleKick = (id) => {
        console.log(`Kicked out ${id}`);
        socket.emit("kick-student", {studentId: id});
    };
    const socket = useSocket();
    
    const navigate = useNavigate();

    const [pollQuestion, setPollQuestion] = useState({
        question: "",
        options: [],
        timer: 60,
    });

    const [active, setActive] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [participants, setParticipants] = useState([]);

    const handleNewQuestion = ({ question, options, timer }) => {
        console.log("🟢 Received new question:", { question, options, timer });
        setPollQuestion({ question, options, timer });
        setActive(true);
        setShowHistory(false);
        socket.emit("get-participants", {});
    };
    socket.on("new-question", handleNewQuestion);
    // ✅ Register all socket listeners safely inside one effect
    useEffect(() => {
        if (!socket) return; // wait until socket is ready

        const handleVoteUpdate = ({ options }) => {
            console.log("🗳️ Vote update:", options);
            setPollQuestion((prev) => ({ ...prev, options }));
        };

        const handleQuestionEnded = ({ question }) => {
            console.log("🔴 Question ended:", question);
            setActive(false);
        };

        const handleHistory = (pollHistory) => {
            console.log("📜 Received poll history:", pollHistory);
            setHistory(pollHistory);
            setShowHistory(true);
        };

        const handleParticipants = ({students})=>{
            console.log("Participant List:", students);
            setParticipants(students);
        }

        // Register all events
        socket.on("vote-update", handleVoteUpdate);
        socket.on("question-ended-time", handleQuestionEnded);
        socket.on("question-ended-voted", handleQuestionEnded);
        socket.on("history", handleHistory);
        socket.on("participants", handleParticipants);

        // Cleanup when component unmounts or socket changes
        return () => {
            socket.off("new-question", handleNewQuestion);
            socket.off("vote-update", handleVoteUpdate);
            socket.off("question-ended-time", handleQuestionEnded);
            socket.off("question-ended-voted", handleQuestionEnded);
            socket.off("history", handleHistory);
            socket.off("participants", handleParticipants);
        };
    }, [socket]);

    // Navigate to ask new question
    const askNewQuestion = () => {
        if (!active) navigate("/teacher");
    };

    // Request history from server
    const fetchHistory = () => {
        if (socket) socket.emit("history", {});
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
            {/* View Poll History button */}
            <button
                className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-1"
                onClick={fetchHistory}
            >
                <span>👁️</span> View Poll History
            </button>

            {/* Conditional rendering: current poll vs history */}
            {!showHistory ? (
                <>
                    <Poll
                        question={pollQuestion.question}
                        options={pollQuestion.options}
                        timer={pollQuestion.timer}
                        readOnly={true}
                    />

                    <div className="w-full max-w-md flex justify-end mt-4">
                        <button
                            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                            onClick={askNewQuestion}
                            disabled={active} // disable while active poll running
                        >
                            + Ask a New Question
                        </button>
                    </div>
                </>
            ) : (
                <div className="w-full max-w-2xl mt-16 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                        📜 Poll History
                    </h2>

                    {history.length > 0 ? (
                        history.map((poll, index) => (
                            <Poll
                                key={index}
                                question={poll.question}
                                options={poll.options}
                                timer={poll.timer || 0}
                                readOnly={true}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No past polls found.</p>
                    )}

                    <div className="flex justify-center mt-6">
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            onClick={() => setShowHistory(false)}
                        >
                            ⬅ Back to Current Poll
                        </button>
                    </div>
                </div>
            )}
            {/* Floating Chat Button */}
            <button
                onClick={() => setShowChatPanel(true)}
                className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105"
            >
                <MessageSquare size={22} />
            </button>
            {/* Chat/Participants Modal */}
            {showChatPanel && (
                <div className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 animate-slide-up">
                    {/* Header Tabs */}
                    <div className="flex justify-between items-center border-b border-gray-300">
                        <TabPanel
                            tabs={["Chat", "Participants"]}
                            activeTab={activeTab}
                            onChange={setActiveTab}
                        />
                        <button
                            className="text-gray-500 text-lg px-3 hover:text-gray-800"
                            onClick={() => setShowChatPanel(false)}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "Chat" ? (
                        <ChatBox messages={messages} />
                    ) : (
                        
                        <ParticipantsList participants={participants} onKick={handleKick} />

                    )}
                </div>
            )}
        </div>
    );
}
