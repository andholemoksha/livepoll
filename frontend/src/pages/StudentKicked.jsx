import Badge from "../components/Badge";

export default function StudentKicked() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 w-full">
            {/* Top badge */}
            <Badge></Badge>

            {/* Heading */}
            <h1 className="text-2xl md:text-[40px] font-normal text-center">
                You’ve been Kicked out !
            </h1>
            <p className="mt-2 text-[#00000080] text-[19px] text-center max-w-3xl font-normal">
                Looks like the teacher had removed you from the poll system .Please
                Try again sometime.
            </p>
        </div>
    );
}