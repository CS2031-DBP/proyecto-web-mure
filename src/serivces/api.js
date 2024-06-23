import axios from "axios";

const URL = "http://localhost:8080";

export const fetchLogin = async (data) => {
    try {
        const res = await axios.post(`${URL}/auth/login`, data);
        if(res.status === 200){
            localStorage.setItem('token', res.data.token)
        }
        return res;
    } catch (error) {
        return error;
    }
}

export const fetchRegister = async (data) => {
    try {
        const res = await axios.post(`${URL}/auth/signin`, data);
        if(res.status === 200){
            localStorage.setItem('token', res.data.token)
        }
        return res;
    } catch (error) {
        return error;
    }
}