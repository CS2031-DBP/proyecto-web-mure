import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { fetchRegister } from '../serivces/api';


const Register = () => {
    const navigate = useNavigate();
    const [data, setdata] = useState({
        email: '',
        password: '',
        name: '',
        birthdate: ''
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
            const res = await fetchRegister(data);
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
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Name" onChange={handleChange} required/>
        <label htmlFor="birthdate">Birthdate</label>
        <input type="date" id="birthdate" name="birthdate" onChange={handleChange} required/>
        <button type="submit">Register</button>
    </form>
    
  )
}

export default Register