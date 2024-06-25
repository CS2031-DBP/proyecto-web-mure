import React from 'react';

const SearchInput = ({ searchTerm, handleSearchTermChange, handleSearch, type }) => {
    const getLabel = (type) => {
        switch (type) {
            case 'artist':
                return 'Artist';
            case 'song':
                return 'Song';
            case 'album':
                return 'Album';
            default:
                return '';
        }
    };

    return (
        <div>
            <h2>Search {getLabel(type)}</h2>
            <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
            <button type="button" onClick={() => handleSearch(type)}>Search {getLabel(type)}</button>
        </div>
    );
};

export default SearchInput;
