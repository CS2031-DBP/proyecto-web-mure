import React from "react";
import { motion } from 'framer-motion';

// SearchInput component for search input
const SearchInput = ({
  searchTerm,
  handleSearchTermChange,
  handleSearch,
  type,
  searchType,
  setSearchType,
  options
}) => {
  const renderSearchTypeSelector = () => {
    if (options && options.length > 0) {
      return (
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-3 py-2 border rounded-l-lg bg-crema5 text-gray-800"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="mb-4 flex"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderSearchTypeSelector()}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder={`Search by ${searchType || (type === "song" ? "Song" : type === "album" ? "Album" : "Artist")}`}
        className={`w-full px-3 py-2 border ${options ? '' : 'rounded-l-lg'} bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white`}
      />
      <button
        type="button"
        onClick={() => handleSearch(type)}
        className="px-4 py-2 rounded-r-lg text-white transition duration-300 bg-color4 hover:bg-color3"
      >
        Search
      </button>
    </motion.div>
  );
};

export default SearchInput;
