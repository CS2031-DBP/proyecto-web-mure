import React, { useState } from 'react';
import { editProfile } from '../services/profile/editProfile';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        password: '',
        email: '',
        profileImage: ''
    });

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Crear un objeto con solo los campos modificados
        const updateData = {};
        for (let key in data) {
            if (data[key]) {
                updateData[key] = data[key];
            }
        }
        try {
            const res = await editProfile(updateData);
            if (res.status === 204) {
                if (updateData.email || updateData.password) {
                    localStorage.removeItem('token'); // Limpia el token
                    navigate('/auth/login'); // Redirige al login
                } else {
                    navigate('/profile'); // Redirige al perfil
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Editar Perfil</h1>
            <button onClick={() => navigate('/profile')}>Mi Perfil</button>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" name="name" value={data.name} onChange={handleChange} />
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" value={data.password} onChange={handleChange} />
                <label htmlFor="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" value={data.email} onChange={handleChange} />
                <label htmlFor="profileImage">Imagen de Perfil</label>
                <input type="text" id="profileImage" name="profileImage" value={data.profileImage} onChange={handleChange} />
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    )
}

export default Edit;
