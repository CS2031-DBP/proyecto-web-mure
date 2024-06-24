import React from 'react';

const SearchResults = ({ results, handleAdd, type }) => {
    if (results.length === 0) return null;

    return (
        <div>
            <h2>{type === 'song' ? 'Song' : 'Album'} Search Results</h2>
            {results.map((result, index) => (
                <div key={index}>
                    <p>Title: {result.title}</p>
                    <p>Artist: {type === 'song' ? result.artistsNames.join(', ') : result.artistName}</p>
                    {type === 'song' ? (
                        <p>Genre: {result.genre}</p>
                    ) : (
                        <>
                            <p>Release Date: {result.releaseDate}</p>
                            <p>Songs Count: {result.songsCount}</p>
                            <p>Songs: {result.songsTitles.join(', ')}</p>
                        </>
                    )}
                    <button type="button" onClick={() => handleAdd(result.id, type)}>Add +</button>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;
