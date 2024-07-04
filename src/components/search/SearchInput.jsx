import React from 'react';

const SearchInput = ({ searchTerm, handleSearchTermChange, handleSearch, type }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Buscar {type === 'song' ? 'Canción' : type === 'album' ? 'Álbum' : 'Artista'}</label>
            <div className="flex">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    className="w-full px-3 py-2 border rounded-l-lg bg-gray-700 text-white"
                />
                <button
                    type="button" 
                    onClick={() => handleSearch(type)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg"
                >
                    Buscar
                </button>
            </div>
        </div>
    );
};

export default SearchInput;
