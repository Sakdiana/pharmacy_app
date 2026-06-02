import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Назад" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-mainColor font-medium hover:underline mb-6"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}
