import React, {useState, useEffect} from 'react';
import io from "socket.io-client";
import {useDispatch} from 'react-redux';
import { joinRoom } from '../../../_actions/room_action';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

let socket;

function Room(props) {

    const [List, setList] = useState([]);
    const [RoomId, setRoomId] = useState("");
    const [InputChat, setInputChat] = useState("");

    useEffect(()=>{
        console.log(props.location.state);
        var id = props.location.state;
        axios.post('http://localhost:5000/api/room/join', {room_id: id})
            .then(response => {
                console.log(response.data);
                socket = io('localhost:5000', { transport : ['websocket'] });
                // socket 연결
                /*
                socket.emit('init', { name: 'test3' });
            
                socket.on('welcome', (msg) => {
                    console.log(msg);
                });
                */
                //setList(response.data);
            })
            .catch(err => console.log(err))
    }, []);
    
    const dispatch = useDispatch();

    const onClickHandler = (event, id) => {
        event.preventDefault();
        console.log(id);
        dispatch(joinRoom(id))
             .then(response=>{
                 if(response.payload.success) {
                    
                 }
             })

    }

    const onInputHandler = (e) => {
        setInputChat(e.currentTarget.value);
    }

    const sendChat = (e) => {
        e.preventDefault();
        socket.emit('send', {msg: InputChat});

        e.currentTarget.value = "";
    }

    const onButtonHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.history.push('/create');
    }

    const onBackHandler = () => {
        props.history.goBack();
    }

    return (
        <div style={{
            display:'grid', justifyContent:'center', alignItems:'center'
            , width:'100%', height:'100vh'
        }}>
            채팅방!
            <div style={{display:'flex', flexDirection:'column'}}>
                <form onSubmit={sendChat}>
                    <input type="text" value={InputChat} onChange={onInputHandler}></input>
                    <button>입력</button>
                </form>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
                <button onClick={onButtonHandler}>채팅방 개설</button>
                <button onClick={onBackHandler}>뒤로가기</button>
            </div>
        </div>
    )
}

export default withRouter(Room)