import Button from "../components/Button";
import Poll from "../model/Poll";

export default function StudentPoll() {
    const handleSubmit = ()=>{
        console.log("Submit answer");
    }
    const samplePoll = {
        question: "Which planet is known as the Red Planet?",
        options: [
        { text: "Mars"},
        { text: "Venus"},
        { text: "Jupiter"},
        { text: "Saturn"},
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
        {/* Centered Poll */}
        <Poll question={samplePoll.question} options={samplePoll.options} />
        <Button
        text="Submit"
        onClick={()=>handleSubmit}
        ></Button>
        </div>
    );
}