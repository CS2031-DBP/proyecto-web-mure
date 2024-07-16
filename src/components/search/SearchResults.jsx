import React from "react";
import { motion } from "framer-motion";

const SearchResults = ({ results = [], handleAdd, handleRemove, page, setPage, totalPages }) => {
  const renderResults = () => {
    return results.map((result, index) => (
      <motion.div
        key={index}
        className="bg-crema5 text-black p-4 mb-4 rounded-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <p className="font-bold">{result.type === "song" ? `Song: ${result.title}` : `Album: ${result.title}`}</p>
        {result.type === "song" ? (
          <>
            <p>Artist: {Array.isArray(result.artistsNames) ? result.artistsNames.join(", ") : result.artistsNames}</p>
            <p>Genre: {result.genre}</p>
          </>
        ) : (
          <>
            <p>Artist: {Array.isArray(result.artistsNames) ? result.artistsNames.join(", ") : result.artistName}</p>
            <p>Release Date: {result.releaseDate}</p>
          </>
        )}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleAdd(result.id, result)}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Add +
          </button>
          <button
            type="button"
            onClick={() => handleRemove(result.id)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Remove -
          </button>
        </div>
      </motion.div>
    ));
  };

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-2 text-buttonColor">Search Results</h3>
      {renderResults()}
      {totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            disabled={page === 0}
          >
            {"<"}
          </button>
          <button
            onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            disabled={page >= totalPages - 1}
          >
            {">"}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SearchResults;
