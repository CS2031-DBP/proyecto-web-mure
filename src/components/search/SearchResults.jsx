import React from "react";
import { motion } from "framer-motion";

const SearchResults = ({ results, handleAdd, page, setPage }) => {
  const resultsPerPage = 2;
  const totalPages = Math.ceil(results.length / resultsPerPage);

  const paginatedResults = results.slice(
    page * resultsPerPage,
    (page + 1) * resultsPerPage
  );

  const renderResults = () => {
    return paginatedResults.map((result, index) => (
      <motion.div
        key={index}
        className="bg-crema5 text-black p-4 mb-4 rounded-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <p className="font-bold">{result.title}</p>
        {result.type === "song" ? (
          <>
            <p>Artist: {result.artistsNames.join(", ")}</p>
            <p>Genre: {result.genre}</p>
          </>
        ) : (
          <>
            <p>Artist: {result.artistName}</p>
            <p>Release Date: {result.releaseDate}</p>
          </>
        )}
        <button
          type="button"
          onClick={() => handleAdd(result.id, result)}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Add +
        </button>
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