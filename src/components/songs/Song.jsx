import React, { forwardRef } from 'react';
import './Song.css';  // Importa el archivo CSS

const Song = forwardRef(({ song, role }, ref) => {
    return (
        <div ref={ref} className="song-container">
            <h2 className="song-title">{song.title}</h2>
            <p className="song-artist">Artist: {song.artistsNames.join(', ')}</p>
            <p className="song-album">Album: {song.albumTitle || 'Unknown Album'}</p>
            <p className="song-duration">Duration: {song.duration}</p>
            <p className="song-genre">Genre: {song.genre}</p>
            <p className="song-likes">Likes: {song.likes}</p>
            <p className="song-timesPlayed">Times Played: {song.timesPlayed}</p>
            <p className="song-releaseDate">Release Date: {song.releaseDate}</p>
            {song.coverImage && <img src={song.coverImage} alt={`${song.title} cover`} className="song-coverImage" />}
            {role === 'ROLE_ADMIN' && (
                <div>
                    <button>Editar Canción</button>
                    <button>Eliminar Canción</button>
                </div>
            )}
        </div>
    );
});

export default Song;
