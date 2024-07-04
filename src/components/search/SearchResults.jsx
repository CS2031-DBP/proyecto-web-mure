import React from "react";

// Componente SearchResults que muestra los resultados de búsqueda
const SearchResults = ({ results, handleAdd, type }) => {
  if (!results || results.length === 0) return null; // Si no hay resultados, no muestra nada

  // Función para renderizar los resultados de búsqueda
  const renderResults = () => {
    return results.map((result, index) => (
      <div key={index} className="bg-gray-700 text-white p-4 mb-4 rounded-lg">
        {type === "artist" ? (
          <>
            <p className="font-bold">Artista: {result.name}</p>
            <p>
              Algunas canciones:{" "}
              {result.songTitles
                ? result.songTitles.slice(0, 2).join(", ")
                : "No songs available"}
            </p>
            <p>Verificado?: {result.verified ? "Sí" : "No"}</p>
          </>
        ) : (
          <>
            <p className="font-bold">Título: {result.title}</p>
            <p>
              Artista:{" "}
              {type === "song"
                ? result.artistsNames.join(", ")
                : result.artistName}
            </p>
            {type === "song" ? (
              <p>Género: {result.genre}</p>
            ) : (
              <>
                <p>Fecha de Lanzamiento: {result.releaseDate}</p>
                <p>Canciones: {result.songsTitles.join(", ")}</p>
              </>
            )}
          </>
        )}
        <button
          type="button"
          onClick={() => handleAdd(result.id, type, result)}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Añadir +
        </button>
      </div>
    ));
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Resultados de Búsqueda</h3>
      {renderResults()}
    </div>
  );
};

export default SearchResults;
