import React, { useEffect, useState } from 'react';
import { createPlaylist } from '../services/playlists/createPlayllist';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import { searchSong } from '../services/songs/searchSong';
import SearchInput from '../components/search/SearchInput';
import SearchResults from '../components/search/SearchResults';
import { useNavigate } from 'react-router-dom';



const CreatePlaylist = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        userId: '',
        name: '',
        songsIds: [],
    });
    const [songs, setSongs] = useState([]); // Array para almacenar los detalles de las canciones añadidas
    const [songSearchTerm, setSongSearchTerm] = useState('');
    const [songSearchResults, setSongSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSongSearchTermChange = (e) => {
        setSongSearchTerm(e.target.value);
    };

    const handleSearch = async () => {
        setError('');
        setSuccess('');
    
        try {
            const results = await searchSong(songSearchTerm);
            if (results.status === 200) {
                setSongSearchResults([results.data]);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('No se han encontrado canciones con ese título :(');
                setSongSearchResults([]);
            } else {
                setError('Error al buscar canciones.');
            }
        }
    };

    const handleAdd = (id, type, songDetails) => {
        if (type === 'song') {
            if (data.songsIds.includes(id)) {
                setError('La canción ya está añadida a la playlist.');
                return;
            }

            setData((prevData) => ({
                ...prevData,
                songsIds: [...prevData.songsIds, id],
            }));
            setSongs((prevSongs) => [...prevSongs, songDetails]);
            setSongSearchResults([]);
            setSongSearchTerm('');
        }
    };

    useEffect(() => {
        const getId = async () => {
            try {
                const id = await fetchCurrentUser();
                setData((prevData) => ({ ...prevData, userId: id.data.id }));
            } catch (error) {
                console.error('Error getting id:', error);
            }
        };
        getId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const payload = [{
            userId: data.userId,
            name: data.name,
            songsIds: data.songsIds,
        }];

        try {
            const res = await createPlaylist(payload);
            if (res.status === 201) {
                setSuccess('Playlist creada con éxito.');
                navigate("/playlists");
            } else {
                setError('Error al crear la playlist.');
            }
        } catch (error) {
            setError('Error al crear la playlist.');
        }
    };

    return (
        <div>
            <h1>Create Playlist</h1>
            <button onClick={() => {console.log(data)}}>Depurar</button>   
            <button onClick={() => navigate('/playlists')}>Playlists</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Playlist Name</label>
                <input type="text" id="name" name="name" value={data.name} onChange={handleChange} />

                <SearchInput
                    searchTerm={songSearchTerm}
                    handleSearchTermChange={handleSongSearchTermChange}
                    handleSearch={handleSearch}
                    type="song"
                />
                <SearchResults
                    results={songSearchResults}
                    handleAdd={(id, type) => handleAdd(id, type, songSearchResults.find(song => song.id === id))}
                    type="song"
                />

                <div>
                    <h2>Canciones añadidas a la playlist</h2>
                    {songs.length === 0 ? (
                        <p>No has añadido canciones aún.</p>
                    ) : (
                        songs.map((song, index) => (
                            <div key={index}>
                                <p>Title: {song.title}</p>
                                <p>Artist: {song.artistsNames.join(', ')}</p>
                            </div>
                        ))
                    )}
                </div>

                <button type="submit">Create Playlist</button>
            </form>
        </div>
    );
};

export default CreatePlaylist;
