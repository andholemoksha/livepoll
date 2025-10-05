export default function Button({text, onClick}){
    return(
        <button
            onClick={onClick}
            className="mt-8 px-8 py-2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-full transition"
        >
            {text}
        </button>
    )
}