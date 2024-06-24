import React from 'react';

const ArtistSearchResults = ({ results, handleAdd }) => {
    if (!results || results.length === 0) return null;

    return (
        <div>
            <h2>Artist Search Results</h2>
            {results.map((result, index) => (
                <div key={index}>
                    <p>Name: {result.name}</p>
                    <p>Top Songs: {result.songTitles.slice(0, 4).join(', ')}</p>
                    <p>Verified: {result.verified ? 'Yes' : 'No'}</p>
                    <button type="button" onClick={() => handleAdd(result.id)}>Add +</button>
                </div>
            ))}
        </div>
    );
};

export default ArtistSearchResults;
