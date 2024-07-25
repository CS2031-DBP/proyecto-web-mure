import React from "react";
import { motion } from "framer-motion";

const SearchInput = ({ searchTerm, handleSearchTermChange }) => {
  return (
    <motion.div
      className="mb-4 flex"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Search by title/album"
        className="w-full px-3 py-2 border rounded-lg bg-inputBgColor  border-buttonColor text-gray-500 focus:input-focus focus:outline-none focus:ring-1 focus:ring-white"
      />
    </motion.div>
  );
};

export default SearchInput;
