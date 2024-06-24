import React, { useEffect, useState } from 'react';
import { createPost } from '../services/posts/createPost';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import { searchSong } from '../services/songs/searchSong';
import { searchAlbum } from '../services/album/searchAlbum';
import { useNavigate } from 'react-router-dom';

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
    const [loading, setLoading] = useState(false);
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
    };

    const handleAlbumSearchTermChange = (e) => {
        setAlbumSearchTerm(e.target.value);
    };

    const handleSearch = async (type) => {
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            if (type === 'song') {
                const results = await searchSong(songSearchTerm);
                if (results.status === 200) {
                    setSongSearchResults([results.data]);
                } else {
                    setError('Error al buscar canciones.');
                }
            } else {
                const results = await searchAlbum(albumSearchTerm);
                if (results.status === 200) {
                    setAlbumSearchResults([results.data]);
                } else {
                    setError('Error al buscar álbumes.');
                }
            }
            setLoading(false);
        } catch (error) {
            setError('Error al buscar.');
            setLoading(false);
        }
    };

    const handleAdd = (id, type) => {
        if (type === 'song') {
            setData((prevData) => ({ ...prevData, songId: id }));
            setSongSearchResults([]);
            setSongSearchTerm('');
        } else {
            setData((prevData) => ({ ...prevData, albumId: id }));
            setAlbumSearchResults([]);
            setAlbumSearchTerm('');
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
        setLoading(true);
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
                setLoading(false);
                navigate('/dashboard');
            }
        } catch (error) {
            setError('Error al crear el post.');
            console.error('Error creating post:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Post</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>Song ID</label>
                <input type="text" name="songId" value={data.songId} onChange={handleChange} readOnly />
                <label>Album ID</label>
                <input type="text" name="albumId" value={data.albumId} onChange={handleChange} readOnly />
                <label>Description</label>
                <input type="text" name="description" value={data.description} onChange={handleChange} />
                <label>Image URL</label>
                <input type="text" name="imageUrl" value={data.imageUrl} onChange={handleChange} />
                <label>Audio URL</label>
                <input type="text" name="audioUrl" value={data.audioUrl} onChange={handleChange} />
                
                <div>
                    <h2>Search Song</h2>
                    <input type="text" value={songSearchTerm} onChange={handleSongSearchTermChange} />
                    <button type="button" onClick={() => handleSearch('song')}>Search Song</button>
                </div>
                <div>
                    {loading && <p>Loading...</p>}
                    {songSearchResults.length > 0 && (
                        <div>
                            <h2>Song Search Results</h2>
                            {songSearchResults.map((result, index) => (
                                <div key={index}>
                                    <p>Title: {result.title}</p>
                                    <p>Artist: {result.artistsNames.join(', ')}</p>
                                    <p>Genre: {result.genre}</p>
                                    <button type="button" onClick={() => handleAdd(result.id, 'song')}>Add +</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2>Search Album</h2>
                    <input type="text" value={albumSearchTerm} onChange={handleAlbumSearchTermChange} />
                    <button type="button" onClick={() => handleSearch('album')}>Search Album</button>
                </div>
                <div>
                    {loading && <p>Loading...</p>}
                    {albumSearchResults.length > 0 && (
                        <div>
                            <h2>Album Search Results</h2>
                            {albumSearchResults.map((result, index) => (
                                <div key={index}>
                                    <p>Title: {result.title}</p>
                                    <p>Artist: {result.artistName}</p>
                                    <p>Release Date: {result.releaseDate}</p>
                                    <p>Songs Count: {result.songsCount}</p>
                                    <p>Songs: {result.songsTitles.join(', ')}</p>
                                    <button type="button" onClick={() => handleAdd(result.id, 'album')}>Add +</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading}>Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
