import React from 'react';

const SearchResults = ({ results, handleAdd, type }) => {
    if (!results || results.length === 0) return null;

    const renderResults = () => {
        return results.map((result, index) => (
            <div key={index}>
            {type === 'artist' ? (
                <>
                <p>Artista: {result.name}</p>
                <p>Algunas canciones: {result.songTitles ? result.songTitles.slice(0, 4).join(', ') : 'No songs available'}</p>
                <p>Verificado?: {result.verified ? 'Yes' : 'No'}</p>
                </>
            ) : (
                <>
                <p>Título: {result.title}</p>
                <p>Artista: {type === 'song' ? result.artistsNames.join(', ') : result.artistName}</p>
                {type === 'song' ? (
                    <p>Genero: {result.genre}</p>
                ) : (
                    <>
                    <p>Fecha de Lanzamiento: {result.releaseDate}</p>
                    <p>Canciones: {result.songsTitles.length > 1 ? result.songsTitles.join(', ') : result.songsTitles[0]}</p>
                    </>
                )}
                </>
            )}
            <button type="button" onClick={() => handleAdd(result.id, type)}>Añadir +</button>
            </div>
        ));
    };

    return (
        <div>
            <h2>Resultados de Busqueda</h2>
            {renderResults()}
        </div>
    );
};

export default SearchResults;
