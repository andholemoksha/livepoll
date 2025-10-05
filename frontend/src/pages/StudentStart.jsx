import { useState } from "react";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function StudentStart() {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const handleContinue = ()=>{
        console.log(name);
        navigate("/student/poll");
    };

  return (
    <div className="flex flex-col items-center justify-center bg-white px-4 w-full">
      {/* Top badge */}
      <Badge></Badge>

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-semibold text-center">
        Let's <span className="font-bold">Get Started</span>
      </h1>
      <p className="mt-2 text-gray-500 text-center max-w-md">
        If you're a student, you'll be able to <span className="font-bold">submit your answers</span>, participate in live polls, and see how your responses compare with your classmates
      </p>

      <label htmlFor="name">Enter your Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="flex-1 border border-gray-300 rounded p-2"
      />

      {/* Continue Button */}
      <Button
      text = "Continue"
      onClick = {()=>handleContinue()}
      ></Button>
    </div>
  );
}
