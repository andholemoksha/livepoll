function PollOption({ number, text, percentage, onClick, readOnly }) {
    return (
        <button
            onClick={onClick}
            disabled={readOnly}
            className="relative w-full text-left border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-default text-[#4A4A68]"
        >
            <div className="relative z-10 flex items-center justify-between w-full p-2">
                <div className="flex items-center gap-4">
                    <div
                        className="relative flex-shrink-0 h-8 w-8 flex items-center justify-center bg-white text-[#6766D5] border rounded-full font-bold"
                    >
                        {number}
                    </div>
                    <span className="font-semibold">{text}</span>
                </div>
                <div className="flex-shrink-0 px-4 py-1">
                    <span className="font-bold">{percentage}%</span>
                </div>
            </div>

            <div
                className="absolute top-0 left-0 h-full rounded-md overflow-hidden transition-all duration-500 ease-out bg-[#6766D5]"   
                style={{ width: `${percentage}%` }}
            >
                <div className="relative z-20 flex items-center justify-between w-full p-2">
                    <div className="flex items-center gap-4">
                        <div
                            className="relative flex-shrink-0 h-8 w-8 flex items-center justify-center bg-white text-[#6766D5] border rounded-full font-bold"
                        >
                            {number}
                        </div>
                        <span className="font-semibold text-white">{text}</span>
                    </div>
                </div>
            </div>
        </button>
    );
}

export default PollOption;