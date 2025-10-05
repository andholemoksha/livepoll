import { useEffect, useState } from "react";
import PollOption from "../components/PollOption";

export default function Poll({
    question,
    options,
    timer,
    readOnly = false,
    setIndex,
}) {
    // --- All original logic is preserved ---
    const [remainingTime, setRemainingTime] = useState(timer);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        setRemainingTime(timer);
        setSelectedOption(null);
    }, [timer, question]);

    useEffect(() => {
        if (!remainingTime || remainingTime <= 0) return;
        const interval = setInterval(() => {
            setRemainingTime((prev) => (prev > 1 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [remainingTime]);

    useEffect(() => {
        if (!readOnly && setIndex) setIndex(selectedOption);
    }, [selectedOption, readOnly, setIndex]);

    // --- Final JSX with all UI corrections ---
    return (
        <div className="w-full max-w-xl mx-auto font-sans">
            {/* Wrapper div to create the outer colored border/box */}
            <div className="bg-purple-50 p-1.5 rounded-xl">
                {/* Main poll card with overflow-hidden */}
                <div className="rounded-lg overflow-hidden">
                    {/* Dark gray question header */}
                    <div className="bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white p-4">
                        <p className="font-semibold text-lg">{question}</p>
                        {timer >= 0 ? (
                            <div className="mt-2">
                                {remainingTime > 0 ? (
                                    <span className="text-sm bg-purple-600 text-white px-2 py-1 rounded">
                                        ⏱ {remainingTime}s remaining
                                    </span>
                                ) : (
                                    <span className="text-sm bg-red-600 text-white px-2 py-1 rounded">
                                        ⏳ Time’s up
                                    </span>
                                )}
                            </div>
                        )
                            : null}
                    </div>

                    {/* White container for the poll options */}
                    <div className="bg-white p-4 space-y-2">
                        {options.map((option, index) => (
                            <PollOption
                                key={index}
                                number={index + 1}
                                text={option.text}
                                percentage={option.percentage ?? 0}
                                onClick={() => {
                                    if (!readOnly) setSelectedOption(index);
                                }}
                                readOnly={readOnly}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}