import { useState } from "react";
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

    const participants = [
        { name: "Rahul Arora" },
        { name: "Pushpdeep Rawat" },
        { name: "Rajit Zuyani" },
        { name: "Nazdeen M" },
        { name: "Ashwin Sharma" },
    ];

    const handleKick = (name) => {
        alert(`Kicked out ${name}`);
    };

    const socket = useSocket();
    const navigate = useNavigate();
    const [pollQuestion, setPollQuestion] = useState({
        question: "",
        options: [],
        timer: 60,
    });

    const [active, setActive] = useState(false);

    socket.on("new-question", ({ question, options, timer }) => {
        console.log(
            "Received new question:",
            JSON.stringify({ question, options, timer })
        );
        setPollQuestion({ question, options, timer });
        setActive(true);
    });
    socket.on("vote-update", ({ options }) => {
        console.log("Vote update received:", options);
        setPollQuestion((prev) => ({ ...prev, options }));
    });
    socket.on("question-ended", ({ question }) => {
        console.log("Question ended:", question);
        setActive(false);
    });

    const askNewQuestion = () => {
        !active && navigate("/teacher");
    };

    const handleHistory  = ()=>{
        console.log("Hisory");
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
            {/* View Poll History button at top-right */}
            <div className="absolute top-4 right-4">
                <Button text = "View Poll History" onClick = {handleHistory}></Button>
            </div>

            {/* Centered Poll */}

            <Poll
                question={pollQuestion.question}
                options={pollQuestion.options}
                timer={pollQuestion.timer}
                readOnly={true}
            />

            {/* Add New Question button just below poll, aligned right */}
            <div className="w-full max-w-md flex justify-end mt-4">
                <button
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    onClick={askNewQuestion}
                >
                    + Ask a New Question
                </button>
            </div>
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
