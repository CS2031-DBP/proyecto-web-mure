import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth/auth';
import logo from '..//img/Logo_Fondo-removebg-preview.png';

const Login = () => {
    // Hook de navegación para redirigir a diferentes rutas
    const navigate = useNavigate();
    
    // Hook de estado para almacenar los datos del formulario de inicio de sesión
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    // Maneja los cambios en los campos del formulario y actualiza el estado
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página al enviar el formulario
        try {
            const res = await login(data); // Llama a la función de inicio de sesión
            if (res.status === 200) {
                // Si el inicio de sesión es exitoso, guarda el token en el almacenamiento local
                localStorage.setItem('token', res.data.token);
                // Redirige al usuario al dashboard
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error); // Manejo de errores
        }
    }

    return (
        <div className="bg-black p-8 rounded-lg shadow-lg w-full">
            {/* Logo de la aplicación */}
            <img src={logo} alt="Logo" className="mx-auto mb-4 w-20 h-20" />
            <div className="text-center mb-6 w-full max-w-md">
                <h1 className="text-3xl font-semibold text-white">Log in to Mure</h1>
            </div>
            {/* Formulario de inicio de sesión */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white text-left">Email</label>
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
                    <label htmlFor="password" className="block text-sm font-medium text-white text-left">Password</label>
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
                    <button
                        type="submit"
                        className="w-full bg-color3 text-white py-2 px-4 rounded-full font-semibold hover:bg-color4 focus:outline-none focus:ring-2 focus:ring-color4"
                    >
                        Log In
                    </button>
                </div>
            </form>
            <div className="mt-6 text-center text-sm text-white">
                <span>Don't have an account? </span>
                <a onClick={() => navigate('/auth/register')} className="font-medium hover:text-color2 text-white underline">
                    Sign up for Mure
                </a>
            </div>
        </div>
    );
}

export default Login;
