import React from "react";
import { motion } from 'framer-motion';

const SearchInputSel = ({
  searchTerm,
  handleSearchTermChange,
  handleSearch,
  searchType,
  setSearchType,
  options
}) => {
  return (
    <motion.div
      className="mb-4 flex items-center space-x-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Search by title/album/artist"
        className="w-full px-3 py-2 border rounded-lg bg-inputBgColor border-buttonColor text-gray-500 focus:input-focus focus:outline-none focus:ring-1 focus:ring-white"
      />
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="px-3 py-2 border rounded-lg bg-inputBgColor border-buttonColor text-gray-500 focus:input-focus focus:outline-none focus:ring-1 focus:ring-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        className="px-3 py-2 bg-buttonColor text-white rounded-lg hover:bg-buttonHover transition duration-300"
      >
        Search
      </button>
    </motion.div>
  );
};

export default SearchInputSel;
