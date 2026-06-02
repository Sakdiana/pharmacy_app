export default function LoadingSpinner({ label = "Загрузка..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="w-10 h-10 border-4 border-mainColor border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label={label}
      />
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}
