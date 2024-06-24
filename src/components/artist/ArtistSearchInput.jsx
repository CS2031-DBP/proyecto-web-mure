import React from 'react';

const ArtistSearchInput = ({ searchTerm, handleSearchTermChange, handleSearch }) => {
    return (
        <div>
            <h2>Search Artist</h2>
            <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
            <button type="button" onClick={() => handleSearch('artist')}>Search Artist</button>
        </div>
    );
};

export default ArtistSearchInput;
