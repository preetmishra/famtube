import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 32"
    className={className}
  >
    <path
      fill="currentColor"
      d="M22.06 19.94a1.5 1.5 0 00-2.12 2.12l2.12-2.12zm6.88 11.12a1.5 1.5 0 002.12-2.12l-2.12 2.12zM13 25.5c6.904 0 12.5-5.596 12.5-12.5h-3a9.5 9.5 0 01-9.5 9.5v3zM25.5 13C25.5 6.096 19.904.5 13 .5v3a9.5 9.5 0 019.5 9.5h3zM13 .5C6.096.5.5 6.096.5 13h3A9.5 9.5 0 0113 3.5v-3zM.5 13c0 6.904 5.596 12.5 12.5 12.5v-3A9.5 9.5 0 013.5 13h-3zm19.44 9.06l9 9 2.12-2.12-9-9-2.12 2.12z"
    ></path>
  </svg>
);

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleOnKeyUp = useCallback(
    (event) => {
      if (event.key !== "Enter") {
        return;
      }

      if (!searchQuery) {
        return;
      }

      navigate(`/?q=${encodeURI(searchQuery)}`);
      setSearchQuery("");
      window.location.reload();
    },
    [navigate, searchQuery]
  );

  return (
    <div className="flex w-full items-center justify-start space-x-4 px-8 py-4 bg-fam-black-mid rounded-full">
      <label htmlFor="global-search-bar">
        <SearchIcon className="h-5 w-5 text-fam-black-light" />
      </label>
      <input
        type="text"
        className="focus:outline-none w-full border-0 font-serif font-medium bg-fam-black-mid text-xl"
        autoComplete="off"
        id="global-search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyUp={handleOnKeyUp}
        placeholder="Type something and press enter to search"
      />
    </div>
  );
}
