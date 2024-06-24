import React from 'react';

const SearchInput = ({ searchTerm, handleSearchTermChange, handleSearch, type }) => {
    return (
        <div>
            <h2>Search {type === 'song' ? 'Song' : 'Album'}</h2>
            <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
            <button type="button" onClick={() => handleSearch(type)}>Search {type === 'song' ? 'Song' : 'Album'}</button>
        </div>
    );
};

export default SearchInput;
