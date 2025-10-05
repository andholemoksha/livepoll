function OptionBox({ option, updateOption, toggleCorrect }) {
    const radioGroupName = `isCorrect-${option.id}`;

    return (
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-purple-600 text-white rounded-full font-bold text-sm">
                {option.id}
            </div>

            <input
                type="text"
                className="flex-grow w-full p-3 text-base border-none rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                placeholder={`Option ${option.id}`}
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
            />

            <div className="flex items-center justify-center gap-x-6 flex-shrink-0 w-40">
                {/* Yes Option */}
                <label className="flex items-center gap-2 cursor-pointer text-base">
                    <input
                        type="radio"
                        name={radioGroupName}
                        checked={option.isCorrect === true}
                        onChange={() => toggleCorrect(option.id, true)}
                        className="hidden"
                    />
                    <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${option.isCorrect ? "border-purple-600" : "border-gray-300"
                        }`}
                    >
                        {option.isCorrect && (
                            <span className="h-2.5 w-2.5 rounded-full bg-purple-600"></span>
                        )}
                    </span>
                    Yes
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-base">
                    <input
                        type="radio"
                        name={radioGroupName}
                        checked={option.isCorrect === false}
                        onChange={() => toggleCorrect(option.id, false)}
                        className="hidden"
                    />
                    <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${!option.isCorrect ? "border-purple-600" : "border-gray-300"
                        }`}
                    >
                        {!option.isCorrect && (
                            <span className="h-2.5 w-2.5 rounded-full bg-purple-600"></span>
                        )}
                    </span>
                    No
                </label>
            </div>
        </div>
    );
}

export default OptionBox;