import React, {useEffect} from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

function LandingPage(props) {

    useEffect(()=>{
        axios.get('http://localhost:5000/api/hello')
        .then(response => console.log(response.data))
        .catch(err=> console.log('err:',err))
    }, []);

    const onClickHandler = () => {
        axios.get('http://localhost:5000/api/user/logout')
            .then(response =>{
                if(response.data) {
                    alert('로그아웃 되셨습니다.');
                    props.history.push('/login');
                } else {
                    alert('로그아웃 에러');
                }
            });
    }

    return (
        <div style={{
            display:'flex', justifyContent:'center', alignItems:'center'
            , width:'100%', height:'100vh'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>로그아웃</button>
        </div>
    )
}

export default withRouter(LandingPage)