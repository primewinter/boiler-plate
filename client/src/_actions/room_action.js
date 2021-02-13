import Axios from 'axios';
import {
    LIST_ROOM
    ,CREATE_ROOM
    ,JOIN_ROOM
} from './types';

export function getRoomList() {
    const request = Axios.get('http://localhost:5000/api/room/list')
        .then(response => response.data);

    return{
        type: LIST_ROOM,
        payload: request
    }
}

export function createRoom(dataToSubmit) {
    const request = Axios.post('http://localhost:5000/api/room/create', dataToSubmit)
        .then(response => response.data);

    return{
        type: CREATE_ROOM,
        payload: request
    }
}

export function joinRoom(dataToSubmit) {
    const request = Axios.post('http://localhost:5000/api/room/join', dataToSubmit)
        .then(response => response.data);

    return{
        type: JOIN_ROOM,
        payload: request
    }
}
