import React from "react";
import { motion } from "framer-motion";

const SearchResults = ({ results, handleAdd, type }) => {
  console.log(results);
  if (!results || results.length === 0) return null;

  const renderResults = () => {
    return results.map((result, index) => (
      <motion.div
        key={index}
        className="bg-crema5 text-black p-4 mb-4 rounded-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {type === "artist" ? (
          <>
            <p className="font-bold">Artist: {result.name}</p>
            <p>
              Some songs:{" "}
              {result.songTitles
                ? result.songTitles.slice(0, 2).join(", ")
                : "No songs available"}
            </p>
            <p>Verified?: {result.verified ? "Yes" : "No"}</p>
          </>
        ) : (
          <>
            <p className="font-bold">{result.title}</p>
            <p>
              Artist:{" "}
              {type === "song"
                ? result.artistsNames.join(", ")
                : result.artistName}
            </p>
            {type === "song" ? (
              <p>Genre: {result.genre}</p>
            ) : (
              <>
                <p>Release Date: {result.releaseDate}</p>
                <p>
                  Songs:{" "}
                  {result.songsTitles
                    ? result.songsTitles.slice(0, 3).join(", ")
                    : "No songs available"}
                </p>
              </>
            )}
          </>
        )}
        <button
          type="button"
          onClick={() => handleAdd(result.id, type, result)}
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
      <h3 className="text-lg font-semibold mb-2">Search Results</h3>
      {renderResults()}
    </motion.div>
  );
};

export default SearchResults;
