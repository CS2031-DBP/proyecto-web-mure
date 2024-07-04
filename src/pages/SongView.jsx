import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchSongs } from "../services/songs/getAllSongs";
import Song from "../components/songs/Song";
import { getRoleBasedOnToken } from "../services/auth/getRoleToken";
import { useNavigate } from "react-router-dom";

const SongView = () => {
  const [songs, setSongs] = useState([]); // Estado para almacenar la lista de canciones
  const [page, setPage] = useState(0); // Estado para manejar la paginación
  const [size, setSize] = useState(10); // Estado para definir el tamaño de la página
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el estado de carga
  const [hasMore, setHasMore] = useState(true); // Estado para indicar si hay más canciones por cargar
  const [role, setRole] = useState(null); // Estado para almacenar el rol del usuario
  const observer = useRef(); // Referencia para el observador de intersección
  const navigate = useNavigate();

  // Función para cargar las canciones desde el servidor
  const loadSongs = async () => {
    if (isLoading || !hasMore) return; // Previene cargas adicionales si ya se está cargando o no hay más canciones
    setIsLoading(true);
    try {
      const res = await fetchSongs(page, size); // Llamada a la API para obtener las canciones
      if (res.status === 200) {
        setSongs((prevSongs) => [...prevSongs, ...res.data.content]); // Agrega las nuevas canciones al estado
        setPage((prevPage) => prevPage + 1); // Incrementa el número de página
        if (res.data.content.length === 0) {
          setHasMore(false); // Si no hay más canciones, actualiza el estado
        }
      }
    } catch (error) {
      console.error(error); // Manejo de errores
    }
    setIsLoading(false);
  };

  // useEffect para cargar las canciones y obtener el rol del usuario al montar el componente
  useEffect(() => {
    loadSongs();
    const role = getRoleBasedOnToken();
    setRole(role);
  }, []);

  // Callback para manejar la observación del último elemento
  const lastSongElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadSongs();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // useEffect para limpiar el observador cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  // Maneja la eliminación de una canción de la lista
  const handleDeleteSong = (id) => {
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
  };

  // Navega a la página para agregar una nueva canción
  const handleAddSongClick = () => {
    navigate("/addsong");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Songs</h1>
      <div className="flex justify-center mb-4">
        {role === "ROLE_ADMIN" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded ml-2"
            onClick={handleAddSongClick}
          >
            Agregar Canción
          </button>
        )}
      </div>
      <div className="hide-scrollbar overflow-auto w-full max-w-5xl h-[calc(100vh-150px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {songs.map((song, index) => {
            if (songs.length === index + 1) {
              // Asigna la referencia al último elemento para la carga infinita
              return (
                <Song
                  ref={lastSongElementRef}
                  key={song.id}
                  song={song}
                  role={role}
                  onDelete={handleDeleteSong}
                />
              );
            } else {
              // Renderiza los demás elementos
              return (
                <Song
                  key={song.id}
                  song={song}
                  role={role}
                  onDelete={handleDeleteSong}
                />
              );
            }
          })}
        </div>
      </div>
      {isLoading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && <p className="text-center mt-4">No more songs</p>}
    </div>
  );
};

export default SongView;
