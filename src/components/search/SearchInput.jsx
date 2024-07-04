import React from "react";
import { motion } from 'framer-motion';

// Componente SearchInput para entrada de búsqueda
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
          className="px-3 py-2 border rounded-l-lg bg-gray-700 text-white"
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
        placeholder={`Buscar por ${searchType || (type === "song" ? "Canción" : type === "album" ? "Álbum" : "Artista")}`}
        className={`w-full px-3 py-2 border ${options ? '' : 'rounded-l-lg'} bg-gray-700 text-white`}
      />
      <button
        type="button"
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg"
      >
        Buscar
      </button>
    </motion.div>
  );
};

export default SearchInput;
