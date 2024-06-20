import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { fetchLogin } from '../serivces/api';

const Login = () => {
    const navigate = useNavigate();
    const [data, setdata] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setdata({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchLogin(data);
            if(res.status === 200){
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    
  return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Email" onChange={handleChange} required/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Password" onChange={handleChange} required/>
        <button type="submit">Login</button>
        <button onClick={() => navigate('/auth/register')}>Registrate</button>
    </form>
  )
}

export default Login