import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth/auth';
import logo from '../img/Logo_Fondo-removebg-preview.png';

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
        <div className="bg-black p-8 rounded-lg shadow-lg w-full">
            <div className="bg-black w-72 rounded-lg shadow-lg w-full max-w-md">
                <img src={logo} alt="Logo" className="mx-auto mb-4 w-20 h-20" />
                <div className="text-center mb-6 w-full max-w-md">
                    <h1 className="text-3xl font-semibold text-white">Sign Up for Mure</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white text-left">Correo</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                            className="w-full p-1 mt-1 border border-white bg-black text-white focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white text-left">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            className="w-full p-1 mt-1 border border-white bg-black text-white focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white text-left">Usuario</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            onChange={handleChange}
                            required
                            className="w-full p-1 mt-1 border border-white bg-black text-white focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="birthdate" className="block text-sm font-medium text-white text-left">Fecha de Cumpleaños</label>
                        <input
                            type="date"
                            id="birthdate"
                            name="birthdate"
                            onChange={handleChange}
                            required
                            className="w-full p-1 mt-1 border border-white bg-black text-white focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-color3 text-white py-2 px-4 rounded-full font-semibold hover:bg-color4 focus:outline-none focus:ring-2 focus:ring-color4"
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center text-sm text-white">
                    <span>Already have an account? </span>
                    <a onClick={() => navigate('/auth/login')} className="font-medium hover:text-color2 text-white underline">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Register;
