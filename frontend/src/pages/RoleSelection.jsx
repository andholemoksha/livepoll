import { useState } from "react";
import RoleCard from "../components/RoleCard";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../server/useSocket";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();

  const handleContinue = () => {
    if (!selectedRole) {
      alert("Please select a role before continuing!");
      return;
    }
    console.log("Selected role:", selectedRole);
    if(selectedRole==="teacher"){
        socket.emit("create-poll", {});
          socket.on("joined", ({pollId})=>{
            console.log(pollId);
          }); 
        navigate("/teacher")
    }
    else if(selectedRole==="student"){
        navigate("/student")
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 w-full">
      {/* Top badge */}
      <Badge></Badge>

      {/* Heading */}
      <h1 className="text-2xl md:text-[40px] font-normal text-center">
        Welcome to the <span className="font-semibold">Live Polling System</span>
      </h1>
          <p className="mt-2 text-[#00000080] text-[19px] text-center max-w-3xl font-normal">
        Please select the role that best describes you to begin using the live polling system
      </p>

      {/* Role options */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <RoleCard
          title="I’m a Student"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
          selected={selectedRole === "student"}
          onClick={() => setSelectedRole("student")}
        />
        <RoleCard
          title="I’m a Teacher"
          description="Submit answers and view live poll results in real-time."
          selected={selectedRole === "teacher"}
          onClick={() => setSelectedRole("teacher")}
        />
      </div>

      {/* Continue Button */}
      <Button 
      text = "Continue"
      onClick = {()=>handleContinue()}
      ></Button>
    </div>
  );
}
