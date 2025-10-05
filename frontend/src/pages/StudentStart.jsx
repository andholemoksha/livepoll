import { useState } from "react";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../server/useSocket";

export default function StudentStart() {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const socket = useSocket();

    const handleContinue = () => {
        if (!name.trim()) {
            alert("Please enter your name before continuing!");
            return;
        }
        socket.emit("join-poll", { name });
        socket.on("joined", ({ pollId }) => {
            console.log(pollId);
        });
        navigate("/student/poll");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            {/* Top Badge */}
            <div className="mb-6">
                <Badge />
            </div>

            {/* Heading */}
            <h1 className="text-2xl md:text-[32px] font-normal text-center text-black">
                Let’s <span className="font-semibold">Get Started</span>
            </h1>

            {/* Subtext */}
            <p className="mt-3 text-[#5C5B5B] text-center max-w-xl leading-relaxed">
                If you’re a student, you’ll be able to{" "}
                <span className="font-semibold text-black">submit your answers</span>,
                participate in live polls, and see how your responses compare with your
                classmates
            </p>

            {/* Input Section */}
            <div className="flex flex-col mt-6 w-[320px]">
                <label htmlFor="name" className="text-black mb-2 text-[15px] font-medium">
                    Enter your Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    autoComplete="off"
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 bg-[#F2F2F2] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gradient-to-r focus:ring-from-[#8F64E1] focus:ring-to-[#1D68BD]"
                    placeholder="Rahul Bajaj"
                    required
                />

            </div>

            {/* Continue Button */}
            <div className="mt-6">
                <Button text="Continue" onClick={handleContinue} />
            </div>
        </div>
    );
}
