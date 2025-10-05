export default function RoleCard({ title, description, selected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer rounded-lg p-[2px] w-64 transition-all duration-200 border
        ${selected
                    ? "bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] border-transparent shadow-lg"
                    : "border-gray-300 hover:border-indigo-400 bg-transparent"
                }`}
        >
            <div className={`rounded-lg p-6 h-full ${selected ? "bg-white" : "bg-transparent"}`}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-gray-500 text-sm font-normal">{description}</p>
            </div>
        </div>
    );
}
