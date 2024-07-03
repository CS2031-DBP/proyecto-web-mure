import React, { forwardRef } from 'react';
import { deleteSong } from '../../services/songs/deleteSong';
import Headphones from '@mui/icons-material/Headphones';

const Song = forwardRef(({ song, role, onDelete }, ref) => {
    const handleDelete = async (id) => {
        try {
            const res = await deleteSong(id);

            if (res.status === 204) {
                onDelete(id);
            }
        } catch (error) {
            console.error(`Failed to delete song ${id}`, error);
        }
    };

    return (
        <div ref={ref} className="border rounded-2xl shadow-lg bg-white text-black w-80 flex flex-col justify-between" style={{ minHeight: '450px' }}>
            <div>
                <h2 className="text-xl font-bold mb-2 flex flex-col items-center justify-center text-center pt-5">
                    {song.title}
                    {song.link && (
                        <a href={song.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            <Headphones className="inline-block" />
                        </a>
                    )}
                </h2>
                <p className="mb-1"><span className="font-semibold">Artista:</span> {song.artistsNames.join(', ')}</p>
                {song.albumTitle && <p className="mb-1"><span className="font-semibold">Album:</span> {song.albumTitle}</p>}
                <p className="mb-1"><span className="font-semibold">Duración:</span> {song.duration}</p>
                <p className="mb-1"><span className="font-semibold">Género:</span> {song.genre}</p>
                <p className="mb-1"><span className="font-semibold">Likes:</span> {song.likes}</p>
                <p className="mb-1"><span className="font-semibold">Número de reproducciones:</span> {song.timesPlayed}</p>
                <p className="mb-1"><span className="font-semibold">Fecha de Lanzamiento:</span> {song.releaseDate}</p>
            </div>
            {song.coverImage ? (
                <img src={song.coverImage} alt={`${song.title} cover`} className="w-full h-64 object-cover rounded-lg mb-2 px-5 pt-5" />
            ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg mb-2 text-red-500">
                    No se encontró la imagen :(
                </div>
            )}
            {role === 'ROLE_ADMIN' && (
                <div className="flex justify-between mt-2 space-x-2 pb-5 px-5">
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">Cambiar Imagen</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-full" onClick={() => handleDelete(song.id)}>Eliminar Canción</button>
                </div>
            )}
        </div>
    );
});

export default Song;
