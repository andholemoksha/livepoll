import PollOption from "../components/PollOption";

export default function Poll({ question, options }){
    useEffect(() => {
      socket.on("vote-update", (msg) => {
        console.log("New message:", msg);
      });
  
      return () => {
        socket.off("message");
      };
    }, [socket]);
  const sendMessage = () => {
      socket.emit("message", { user: "Moksha", text: "Hello there!" });
    };
    return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <div className="bg-gray-700 text-white px-3 py-2 rounded-t">{question}</div>

      <div className="mt-4">
        {options.map((option, index) => (
          <PollOption
            key={index}
            number={index + 1}
            text={option.text}
            percentage={option.percentage}
          />
        ))}
      </div>
    </div>
  );
}