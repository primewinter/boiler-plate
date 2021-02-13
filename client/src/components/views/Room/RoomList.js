import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

function RoomList(props) {

    const [List, setList] = useState([]);

    useEffect(()=>{
        axios.get('http://localhost:5000/api/room/list')
            .then(response => {
                console.log(response.data);
                setList(response.data);
            })
            .catch(err => console.log(err))
    }, []);
    
    const dispatch = useDispatch();

    const onClickHandler = (event, id) => {
        event.preventDefault();
        console.log(id);
        props.history.push('/join', id);
        // dispatch(joinRoom(id))
        //     .then(response=>{
        //         if(response.payload.success) {
                    
        //         }
        //     })

    }

    const onButtonHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.history.push('/create');
    }

    return (
        <div style={{
            display:'grid', justifyContent:'center', alignItems:'center'
            , width:'100%', height:'100vh'
        }}>
            채팅방목록
            <ul>
                {List.map(el=>{return (
                    <li 
                        key={el._id}
                        onClick={(e)=>onClickHandler(e, el._id)}
                    >
                        {el.title}{el.admin}
                    </li>
                )})}
            </ul>
            <div
                style={{display:'flex', flexDirection:'column'}}
            >
                <button onClick={onButtonHandler}>채팅방 개설</button>
            </div>
        </div>
    )
}

export default withRouter(RoomList)