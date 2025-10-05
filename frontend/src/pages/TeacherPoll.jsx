import { useEffect, useState } from "react";
import Poll from "../model/Poll";
import { useSocket } from "../server/useSocket";

export default function App() {
    const socket = useSocket();
    const [samplePoll, setSamplePoll] = useState({});
    useEffect(()=>{
        socket.on("new-question",({question, options, timer})=>{
            setSamplePoll({question, options, timer})
        })
        socket.on("vote-update", ({options})=>{
            setSamplePoll((initial)=>{initial.question, options })
        })
    },[])

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
        {/* View Poll History button at top-right */}
        <button className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-1">
            <span>👁️</span> View Poll History
        </button>

        {/* Centered Poll */}
        {samplePoll.options ?? <Poll question={samplePoll.question} options={samplePoll.options} />}

        {/* Add New Question button just below poll, aligned right */}
        <div className="w-full max-w-md flex justify-end mt-4">
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            + Ask a New Question
            </button>
        </div>
        </div>
    );
}