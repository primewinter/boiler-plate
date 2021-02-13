import Axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

export function loginUser(dataToSubmit) {
    const request = Axios.post('http://localhost:5000/api/user/login', dataToSubmit)
        .then(response => response.data);

    return{
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataToSubmit) {
    const request = Axios.post('http://localhost:5000/api/user/register', dataToSubmit)
        .then(response => response.data);

    return{
        type: REGISTER_USER,
        payload: request
    }
}

export function authUser() {
    const request = Axios.get('http://localhost:5000/api/user/auth')
        .then(response => response.data)
        .catch(error=>console.log(error))

    return{
        type: AUTH_USER,
        payload: request
    }
}