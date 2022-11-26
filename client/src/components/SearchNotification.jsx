import { useNavigate } from "react-router";
import useSearchQuery from "./hooks/useSearchQuery";

const CancelIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function SearchNotification() {
  const navigate = useNavigate();
  const query = useSearchQuery();

  if (!query) {
    return;
  }

  return (
    <div className="flex w-full items-center justify-between space-x-4 px-8 py-4 bg-fam-black-mid rounded-full">
      <p className="bg-fam-black-mid text-xl">
        Showing results for{" "}
        <span className="text-fam-yellow-light">{query}</span>
      </p>
      <button
        onClick={() => {
          navigate("/");
          window.location.reload();
        }}
      >
        <CancelIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}
