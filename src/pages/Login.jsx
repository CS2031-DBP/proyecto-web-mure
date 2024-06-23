import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../serivces/auth/auth';


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
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email" onChange={handleChange} required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
            <button onClick={() => navigate('/auth/register')}>Register</button>
        </form>
    )
}

export default Login;
