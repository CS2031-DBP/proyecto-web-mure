import React, { useEffect, useState } from 'react';
import { isPlaylistOwner } from '../../services/playlists/isOwner';

const Playlist = ({ playlist }) => {
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await isPlaylistOwner(playlist.id);
                console.log(response)
                if (response.status === 200) {
                    setIsOwner(response.data);
                } else {
                    setError('Error al verificar la propiedad de la playlist.');
                }
            } catch (err) {
                setError('Error al verificar la propiedad de la playlist.');
            }
        };
        checkOwnership();
    }, [playlist.id]);

    return (
        <div className="playlist">
            <h2>{playlist.name}</h2>
            <p>Creado por: {playlist.userName}</p>
            <h3>Canciones:</h3>
            <ul>
                {playlist.songsTitles.map((title, index) => (
                    <div key={index}>{title}</div>
                ))}
            </ul>
            {isOwner && (
                <div>
                    <button>Edit Playlist</button>
                    <button>Delete Playlist</button>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Playlist;
