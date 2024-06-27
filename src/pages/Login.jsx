import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth/auth';

const Login = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: ''
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
            const res = await login(data);
            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <>
            <div className='bg-gray-600 
            rounded-lg
             min-w-full 
             p-4 '>

            
            <div className='bg-gray-600 '>
            Inicia sesión en Mure  
            </div>
            
            
                <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
                    <div className='py-4'>
                    <label htmlFor="email" className='block '>Email</label>
                    <input type="email" id="email" name="email" placeholder="Email" onChange={handleChange} required 
                    className=''
                    />

            
                    <label htmlFor="password" className='block'>Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" onChange={handleChange} required 
                    className=''
                    />
                    </div>
                    
                    <button type="submit"
                    
                    >Logeate!</button>
                    <button onClick={() => navigate('/auth/register')}>Registrarse</button>
                </form>

            </div>
        </>
    )
}

export default Login;
