import { useState, useRef, useEffect } from "react";

// Define the available time options in seconds
const timeOptions = [30, 60, 90, 120];

function TimerSelect({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // This effect handles closing the dropdown if you click outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        // Add event listener when the dropdown is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        // Cleanup the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleOptionClick = (option) => {
        onChange(option); // Update the parent component's state
        setIsOpen(false); // Close the dropdown
    };

    return (
        <div className="relative w-40" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-2 text-sm font-normal text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#480FB3]"
            >
                <span>{value} seconds</span>

                <svg
                    className={`h-5 w-5 text-[#480FB3] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M5 8h10L10 14z" />
                </svg>

            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                    <ul className="py-1">
                        {timeOptions.map((option) => (
                            <li key={option}>
                                <button
                                    onClick={() => handleOptionClick(option)}
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 font-normal"
                                >
                                    {option} seconds
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default TimerSelect;