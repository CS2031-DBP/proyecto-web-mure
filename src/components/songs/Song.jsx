import React, { forwardRef } from "react";
import { deleteSong } from "../../services/songs/deleteSong";
import Headphones from "@mui/icons-material/Headphones";
import { useNavigate } from "react-router-dom";

// Componente Song que recibe props: song, role, onDelete y ref
const Song = forwardRef(({ song, role, onDelete }, ref) => {
  const navigate = useNavigate(); // Hook de navegación para redirigir a otras páginas

  // Función para manejar la eliminación de una canción
  const handleDelete = async (id) => {
    try {
      const res = await deleteSong(id); // Llama a la API para eliminar la canción
      if (res.status === 204) {
        // Si la eliminación es exitosa
        onDelete(id); // Llama a la función onDelete pasada por props
      }
    } catch (error) {
      console.error(`Failed to delete song ${id}`, error); // Manejo de errores
    }
  };

  // Función para manejar la creación de un post basado en la canción
  const handleCreatePost = () => {
    navigate("/post/create", { state: { songId: song.id } }); // Redirige a la página de creación de posts
  };

  return (
    <div
      ref={ref}
      className="border rounded-2xl shadow-lg bg-white text-black w-80 flex flex-col justify-between min-h-[450px]"
    >
      <div className="relative">
        <div className="flex justify-between items-center px-4 pt-4">
          <h2 className="text-xl font-bold flex items-center">
            {song.title}
            {song.link && (
              <a
                href={song.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 ml-2"
              >
                <Headphones className="inline-block" />{" "}
                {/* Enlace a la canción en una plataforma externa */}
              </a>
            )}
          </h2>
          <button
            onClick={handleCreatePost}
            className="bg-green-500 text-white px-3 py-1 rounded-full"
          >
            Post
          </button>
        </div>
        <div className="px-5">
          <p className="mb-1">
            <span className="font-semibold">Artista:</span>{" "}
            {song.artistsNames.join(", ")}
          </p>
          {song.albumTitle && (
            <p className="mb-1">
              <span className="font-semibold">Album:</span> {song.albumTitle}
            </p>
          )}
          <p className="mb-1">
            <span className="font-semibold">Duración:</span> {song.duration}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Género:</span> {song.genre}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Likes:</span> {song.likes}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Número de reproducciones:</span>{" "}
            {song.timesPlayed}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Fecha de Lanzamiento:</span>{" "}
            {song.releaseDate}
          </p>
        </div>
      </div>
      {song.coverImage ? (
        <img
          src={song.coverImage}
          alt={`${song.title} cover`}
          className="w-full h-64 object-cover rounded-lg mb-2 px-5 pt-5"
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg mb-2 text-red-500">
          No se encontró la imagen :(
        </div>
      )}
      {role === "ROLE_ADMIN" && (
        <div className="flex justify-between mt-2 space-x-2 pb-5 px-5">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">
            Cambiar Imagen
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-full"
            onClick={() => handleDelete(song.id)}
          >
            Eliminar Canción
          </button>
        </div>
      )}
    </div>
  );
});

export default Song;
