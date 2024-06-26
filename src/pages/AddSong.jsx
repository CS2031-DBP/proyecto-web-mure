import React, { useState } from 'react';
import { createSong } from '../services/songs/createSong';
import { searchArtist } from '../services/artist/getArtistByName';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../components/search/SearchInput';
import SearchResults from '../components/search/SearchResults';

const AddSong = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        title: '',
        artistsIds: [],
        releaseDate: '',
        genre: '',
        duration: '',
        coverImage: '',
    });
    const [artistSearchTerm, setArtistSearchTerm] = useState('');
    const [artistSearchResults, setArtistSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleArtistSearchTermChange = (e) => {
        setArtistSearchTerm(e.target.value);
    };

    const handleSearch = async (type) => {
        setError('');
        setSuccess('');

        try {
            if (type === 'artist') {
                const results = await searchArtist(artistSearchTerm);
                if (results.status === 200) {
                    setArtistSearchResults([results.data]);
                } else if (results.response && results.response.status === 404) {
                    setError('No se han encontrado artistas con ese nombre :(');
                    setArtistSearchResults([]);
                } else {
                    setError('Error al buscar artistas.');
                }
            }
        } catch (error) {
            setError('Error al buscar.');
        }
    };

    const handleAdd = (id) => {
        setData((prevData) => ({
            ...prevData,
            artistsIds: [...prevData.artistsIds, id],
        }));
        setArtistSearchResults([]);
        setArtistSearchTerm('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const payload = [{
            title: data.title,
            artistsIds: data.artistsIds,
            releaseDate: data.releaseDate,
            genre: data.genre,
            duration: data.duration,
            coverImage: data.coverImage,
        }];

        try {
            const res = await createSong(payload);
            if (res.status === 201) {
                setSuccess('Canción creada con éxito.');
                navigate("/songs")
            } else {
                setError('Error al crear la canción.');
            }
        } catch (error) {
            setError('Error al crear la canción.');
        }
    };

    return (
        <div>
            <h1>Añadir Canción</h1>
            <button onClick={() => navigate('/songs')}>Canciones</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Titulo: </label>
                <input type="text" id="title" name="title" value={data.title} onChange={handleChange} required/>
                <label htmlFor="releaseDate">Fecha de Lanzamiento</label>
                <input type="date" id="releaseDate" name="releaseDate" value={data.releaseDate} onChange={handleChange} required />
                <label htmlFor="genre">Genero</label>
                <input type="text" id="genre" name="genre" value={data.genre} onChange={handleChange} required/>
                <label htmlFor="duration">Duración: </label>
                <input type="text" id="duration" name="duration" value={data.duration} onChange={handleChange} required/>
                <label htmlFor="coverImage">Cover Image</label>
                <input type="text" id="coverImage" name="coverImage" value={data.coverImage} onChange={handleChange} required/>
                
                <SearchInput
                    searchTerm={artistSearchTerm}
                    handleSearchTermChange={handleArtistSearchTermChange}
                    handleSearch={handleSearch}
                    type="artist"
                />
                <SearchResults
                    results={artistSearchResults}
                    handleAdd={handleAdd}
                    type="artist"
                />

                <button type="submit">Agregar Canción</button>
            </form>
        </div>
    );
};

export default AddSong;
