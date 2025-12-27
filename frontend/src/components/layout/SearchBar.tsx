import { useState } from "react";
import { Search } from "lucide-react";
import { memo } from "react";

const SearchBar = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // TODO: navigate(`/search?q=${searchQuery}`)
    }
  };

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Desktop search */}
      <div className="hidden md:flex relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          placeholder="Tìm kiếm..."
          className="w-48 lg:w-64 rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-blue-600"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile expanded search */}
      {isExpanded && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsExpanded(false)}
          />
          <div className="md:hidden fixed left-1/2 -translate-x-1/2 top-20 w-[90vw] max-w-md bg-white shadow-xl rounded-lg p-4 z-50">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-6 h-6 text-blue-600" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";
export default SearchBar;
