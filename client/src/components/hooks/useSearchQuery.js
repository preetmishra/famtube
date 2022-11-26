import { useLocation } from "react-router";

export default function useSearchQuery() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get("q");
}
