import React, { useEffect, useState } from 'react';
import { createPost } from '../services/posts/createPost';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import { searchSong } from '../services/songs/searchSong';
import { searchAlbum } from '../services/album/searchAlbum';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../components/post/SearchInput';
import SearchResults from '../components/post/SearchResults';

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
        console.log('Form data:', data);  
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
        <div>
            <h1>Create Post</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <button onClick={() => { console.log(data) }}>Depurar</button>

            <button onClick={() => navigate('/dashboard')}>Dashboard</button>

            <form onSubmit={handleSubmit}>
                <label>En que estas pensando?</label>
                <input type="text" name="description" value={data.description} onChange={handleChange} />
                <label>Image URL</label>
                <input type="text" name="imageUrl" value={data.imageUrl} onChange={handleChange} />
                <label>Audio URL</label>
                <input type="text" name="audioUrl" value={data.audioUrl} onChange={handleChange} />
                
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

                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
