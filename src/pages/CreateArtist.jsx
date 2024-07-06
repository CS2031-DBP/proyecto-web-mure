// CreateArtistPage.jsx
import React, { useState, useEffect } from 'react';
import { createArtists } from '../services/artist/artist';
import { useNavigate } from 'react-router-dom';

const CreateArtist = () => {
    const [artists, setArtists] = useState([]);
    const [artistDetails, setArtistDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const missingArtists = JSON.parse(localStorage.getItem('missingArtists'));
        if (missingArtists) {
            setArtists(missingArtists);
            setArtistDetails(missingArtists.map(name => ({ name, description: '', birthDate: '', verified: false })));
        }
    }, []);

    const handleDetailChange = (index, field, value) => {
        const updatedDetails = [...artistDetails];
        updatedDetails[index][field] = value;
        setArtistDetails(updatedDetails);
    };

    const handleCreateArtists = async () => {
        try {
            await createArtists(artistDetails);
            localStorage.removeItem('missingArtists');
            navigate('/addsong');
        } catch (error) {
            console.error('Error creating artists:', error);
        }
    };

    return (
        <div className="items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-6">Crear Artistas</h1>
            {artists.length === 0 ? (
                <p>No hay artistas para crear.</p>
            ) : (
                <ul className="mb-6">
                    {artistDetails.map((artist, index) => (
                        <li key={index} className="bg-gray-700 text-white p-4 mb-4 rounded-lg">
                            <p className="font-bold">{artist.name}</p>
                            <input
                                type="text"
                                value={artist.description}
                                onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                                placeholder="Descripción"
                                className="w-full px-3 py-2 mt-2 border rounded-lg bg-gray-800 text-white"
                            />
                            <input
                                type="date"
                                value={artist.birthDate}
                                onChange={(e) => handleDetailChange(index, 'birthDate', e.target.value)}
                                placeholder="Fecha de nacimiento"
                                className="w-full px-3 py-2 mt-2 border rounded-lg bg-gray-800 text-white"
                            />
                            <label className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={artist.verified}
                                    onChange={(e) => handleDetailChange(index, 'verified', e.target.checked)}
                                    className="mr-2"
                                />
                                Verificado
                            </label>
                        </li>
                    ))}
                </ul>
            )}
            {artists.length > 0 && (
                <button
                    onClick={handleCreateArtists}
                    className="w-full py-2 mt-4 bg-green-600 text-white rounded-lg transition duration-300"
                >
                    Crear Artistas
                </button>
            )}
        </div>
    );
};

export default CreateArtist;
