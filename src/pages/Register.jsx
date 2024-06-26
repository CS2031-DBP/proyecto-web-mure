import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth/auth';


const Register = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
        name: '',
        birthdate: ''
    });

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await register(data);
            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <button onClick={() => navigate('/auth/login')}>Logearse</button>
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo</label>
            <input type="email" id="email" name="email" placeholder="Email" onChange={handleChange} required />
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" placeholder="Password" onChange={handleChange} required />
            <label htmlFor="name">Usuario</label>
            <input type="text" id="name" name="name" placeholder="Name" onChange={handleChange} required />
            <label htmlFor="birthdate">Fecha de Cumpleaños</label>
            <input type="date" id="birthdate" name="birthdate" onChange={handleChange} required />
            <button type="submit">Registrarse</button>
        </form>
        </div>
    )
}

export default Register;
