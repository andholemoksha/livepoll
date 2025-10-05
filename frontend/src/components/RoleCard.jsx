export default function RoleCard({ title, description, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border rounded-lg p-6 w-64 transition 
        ${selected ? "border-indigo-500 shadow-lg" : "border-gray-300 hover:border-indigo-400"}
      `}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-gray-500 text-sm">{description}</p>
    </div>
  );
}
