import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isPlaylistOwner } from '../../services/playlists/isOwner';
import { deleteSongFromPlaylist } from '../../services/playlists/deleteSongFromPlaylist';
import { deletePlaylist } from '../../services/playlists/deletePlaylist';
import { searchSong } from '../../services/songs/searchSong';

const Playlist = ({ playlist, edit, onUpdate }) => {
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await isPlaylistOwner(playlist.id);
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

    const handleEditClick = () => {
        navigate(`/playlist/edit/${playlist.id}`);
    };

    const handleDeleteClick = async (title) => {
       try {
        const res1 = await searchSong(title);
        const songId = res1.data.id;        
        await deleteSongFromPlaylist(playlist.id, songId);
        onUpdate();
       } catch (err) {
        console.error(err);
       }
    }

    const handleDeletePlaylist = async () => {
        try {
            await deletePlaylist(playlist.id);
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="playlist">
            <h2>{playlist.name}</h2>
            <p>Autor: {playlist.userName}</p>
            <h3>Canciones:</h3>
            {playlist.songsTitles.length === 0 ? (
                <p>No tienes canciones aún</p>
            ) : (
                <div>
                    {playlist.songsTitles.map((title, index) => (
                        <div key={index}>
                            {isOwner && edit && (
                                <button onClick={() => handleDeleteClick(title)}>Delete</button>
                            )}
                            {title}
                        </div>
                    ))}
                </div>
            )}
            {isOwner && !edit && (
                <div>
                    <button onClick={handleEditClick}>Añadir/Quitar Canciones</button>
                    <button onClick={handleDeletePlaylist}>Borrar Playlist</button>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Playlist;
