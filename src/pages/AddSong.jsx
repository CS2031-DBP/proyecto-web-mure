import React, { useState } from 'react';
import { createSong } from '../services/songs/createSong';
import { searchArtist } from '../services/artist/getArtistByName';
import ArtistSearchInput from '../components/artist/ArtistSearchInput';
import ArtistSearchResults from '../components/artist/ArtistSearchResults';

const AddSong = () => {
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

    const handleSearch = async () => {
        setError('');
        setSuccess('');

        try {
            const results = await searchArtist(artistSearchTerm);
            if (results.status === 200) {
                setArtistSearchResults([results.data]);
            } else if (results.response && results.response.status === 404) {
                setError('No se han encontrado artistas con ese nombre :(');
                setArtistSearchResults([]);
            } else {
                setError('Error al buscar artistas.');
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
        console.log('Form data:', data);  // Print form data for debugging
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
            } else {
                setError('Error al crear la canción.');
            }
        } catch (error) {
            setError('Error al crear la canción.');
        }
    };

    return (
        <div>
            <h1>Add Song</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <button onClick={() => console.log(data)}>Print form data</button>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={data.title} onChange={handleChange} />
                <label htmlFor="releaseDate">Release Date</label>
                <input type="date" id="releaseDate" name="releaseDate" value={data.releaseDate} onChange={handleChange} />
                <label htmlFor="genre">Genre</label>
                <input type="text" id="genre" name="genre" value={data.genre} onChange={handleChange} />
                <label htmlFor="duration">Duration</label>
                <input type="text" id="duration" name="duration" value={data.duration} onChange={handleChange} />
                <label htmlFor="coverImage">Cover Image</label>
                <input type="text" id="coverImage" name="coverImage" value={data.coverImage} onChange={handleChange} />
                
                <ArtistSearchInput
                    searchTerm={artistSearchTerm}
                    handleSearchTermChange={handleArtistSearchTermChange}
                    handleSearch={handleSearch}
                />
                <ArtistSearchResults
                    results={artistSearchResults}
                    handleAdd={handleAdd}
                />

                <button type="submit">Add Song</button>
            </form>
        </div>
    );
};

export default AddSong;
