import React, { useEffect, useState } from 'react';
import { createPost } from '../services/posts/createPost';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import { searchSong } from '../services/songs/searchSong';
import { searchAlbum } from '../services/album/searchAlbum';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../components/search/SearchInput';
import SearchResults from '../components/search/SearchResults';

const CreatePost = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        userId: '',
        songId: '',
        albumId: '',
        description: '',
        imageUrl: '',
        audioUrl: '',
    });
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [songSearchTerm, setSongSearchTerm] = useState('');
    const [albumSearchTerm, setAlbumSearchTerm] = useState('');
    const [songSearchResults, setSongSearchResults] = useState([]);
    const [albumSearchResults, setAlbumSearchResults] = useState([]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSongSearchTermChange = (e) => {
        setSongSearchTerm(e.target.value);
        if (e.target.value) {
            setAlbumSearchTerm('');
            setAlbumSearchResults([]);
            setData((prevData) => ({ ...prevData, albumId: '' }));
        }
    };

    const handleAlbumSearchTermChange = (e) => {
        setAlbumSearchTerm(e.target.value);
        if (e.target.value) {
            setSongSearchTerm('');
            setSongSearchResults([]);
            setData((prevData) => ({ ...prevData, songId: '' }));
        }
    };

    const handleSearch = async (type) => {
        setError('');
        setSuccess('');
    
        try {
            if (type === 'song') {
                const results = await searchSong(songSearchTerm);
                if (results.status === 200) {
                    setSongSearchResults([results.data]);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('No se han encontrado canciones con ese título :(');
                setSongSearchResults([]);
            } else {
                setError('Error al buscar canciones.');
            }
        }
    
        try {
            if (type === 'album') {
                const results = await searchAlbum(albumSearchTerm);
                console.log(results);
                if (results.status === 200) {
                    setAlbumSearchResults([results.data]);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('No se han encontrado álbumes con ese título :(');
                setAlbumSearchResults([]);
            } else {
                setError('Error al buscar álbumes.');
            }
        }
    };

    const handleAdd = (id, type, item) => {
        if (type === 'song') {
            setData((prevData) => ({ ...prevData, songId: id }));
        } else {
            setData((prevData) => ({ ...prevData, albumId: id }));
        }
        setSelectedItem({ ...item, type });
        setSongSearchResults([]);
        setAlbumSearchResults([]);
        setSongSearchTerm('');
        setAlbumSearchTerm('');
    };

    const handleClearSelection = () => {
        setData((prevData) => ({ ...prevData, songId: '', albumId: '' }));
        setSelectedItem(null);
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

        const updateData = {};
        for (let key in data) {
            if (data[key]) {
                updateData[key] = data[key];
            }
        }

        const payload = [updateData];

        try {
            const res = await createPost(payload);
            if (res.status === 201) {
                setSuccess('Post creado con éxito.');
                navigate('/dashboard');
            }
        } catch (error) {
            setError('Error al crear el post.');
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="items-center justify-center ">
            <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">Create Post</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium mb-1">En que estas pensando?</label>
                        <textarea
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            className="w-full h-32 px-3 py-2 border rounded-lg bg-gray-700 text-white"
                        />
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Ingresar Imagen</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-between">
                        {selectedItem ? (
                            <div className="flex-grow bg-gray-700 text-white p-4 rounded-lg flex flex-col justify-between h-full">
                                <div className="flex-grow">
                                    {selectedItem.type === 'song' && (
                                        <>
                                            <img src={selectedItem.coverImage} alt={`${selectedItem.title} cover`} className="w-full h-64 object-cover rounded-lg mb-4" />
                                            <p className="font-bold text-lg">Título: {selectedItem.title}</p>
                                            <p>Artista: {selectedItem.artistsNames.join(', ')}</p>
                                            <p>Álbum: {selectedItem.albumTitle}</p>
                                            <p>Duración: {selectedItem.duration}</p>
                                            <p>Género: {selectedItem.genre}</p>
                                            <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">Escuchar en Spotify</a>
                                        </>
                                    )}
                                    {selectedItem.type === 'album' && (
                                        <>
                                            <p className="font-bold text-lg">Album: {selectedItem.title}</p>
                                            <img src={selectedItem.coverImage} alt={`${selectedItem.title} cover`} className="w-full h-64 object-cover rounded-lg mb-4" />
                                            <p>Artista: {selectedItem.artistName}</p>
                                            <p>Número de Canciones: {selectedItem.songsCount}</p>
                                            <p>Duración Total: {selectedItem.totalDuration}</p>
                                            <p>Canciones: {selectedItem.songsTitles.join(', ')}</p>
                                            <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">Escuchar en Spotify</a>
                                        </>
                                    )}
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleClearSelection} 
                                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg self-center"
                                >
                                    Cambiar de Contenido
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <SearchInput
                                    searchTerm={songSearchTerm}
                                    handleSearchTermChange={handleSongSearchTermChange}
                                    handleSearch={handleSearch}
                                    type="song"
                                />
                                <SearchResults
                                    results={songSearchResults}
                                    handleAdd={handleAdd}
                                    type="song"
                                />
                                <SearchInput
                                    searchTerm={albumSearchTerm}
                                    handleSearchTermChange={handleAlbumSearchTermChange}
                                    handleSearch={handleSearch}
                                    type="album"
                                />
                                <SearchResults
                                    results={albumSearchResults}
                                    handleAdd={handleAdd}
                                    type="album"
                                />
                            </div>
                        )}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <button type="submit" className="w-full py-2 mt-4 bg-green-600 text-white rounded-lg">Create Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost
