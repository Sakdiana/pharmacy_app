export default function EmptyState({ title, description, action }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-8 flex flex-col items-center justify-center text-center">
      <p className="text-[#144F24] text-lg font-medium">{title}</p>
      {description && (
        <p className="text-gray-500 text-sm mt-2 max-w-md">{description}</p>
      )}
      {action}
    </div>
  );
}
