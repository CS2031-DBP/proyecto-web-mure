import React, { forwardRef } from 'react';
import { deleteSong } from '../../services/songs/deleteSong';
import './Song.css'; 

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

    console.log(song)

    return (
        <div ref={ref} className="song-container">
            <h2 className="song-title">{song.title}</h2>
            <p className="song-artist">Artista: {song.artistsNames.join(', ')}</p>
            <p className="song-album">Album: {song.albumTitle || 'Unknown Album'}</p>
            <p className="song-duration">Duración: {song.duration}</p>
            <p className="song-genre">Genero: {song.genre}</p>
            <p className="song-likes">Likes: {song.likes}</p>
            <p className="song-timesPlayed">Numero de reproducciones: {song.timesPlayed}</p>
            <p className="song-releaseDate">Fecha de Lanzamiento: {song.releaseDate}</p>
            {song.coverImage && <img src={song.coverImage} alt={`${song.title} cover`} className="song-coverImage" />}
            {role === 'ROLE_ADMIN' && (
                <div>
                    <button>Cambiar Imagen</button>
                    <button onClick={() => handleDelete(song.id)}>Eliminar Canción</button>
                </div>
            )}
        </div>
    );
});

export default Song;
