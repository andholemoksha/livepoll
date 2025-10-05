export default function Button({text, onClick}){
    return(
        <button
            onClick={onClick}
            className="mt-8 px-8 py-2 text-white bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] rounded-full transition font-semibold"
        >
            {text}
        </button>
    )
}