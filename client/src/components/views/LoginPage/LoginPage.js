import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';
import KakaoButton from './KakaoButton';

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Id, setId] = useState("");
    const [Password, setPassword] = useState("");

    const onIdHandler = (event) => {
        setId(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            id: Id,
            password: Password
        }

       dispatch(loginUser(body))
        .then(response=> {
            if(response.payload.loginSuccess) {
                props.history.push('/list');
            } else {
                alert('일치하는 회원이 없습니다.');
            }
        })

    }
    const onRegisterHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.history.push('/register');
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.async = true;

        document.body.appendChild(script);
        console.log('appendChild');
        return () => {
            document.body.removeChild(script);
            console.log('removeChild');
        }
    }, [])

    return (
        <div style={{
            display:'flex', justifyContent:'center', alignItems:'center'
            , width:'100%', height:'100vh'
        }}>
            <div className="layout">
                <KakaoButton/>
            </div>
            <form style={{display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>ID</label>
                <input type="text" value={Id} onChange={onIdHandler}/>
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <br/>
                <br/>
                <button>
                    로그인
                </button>
                <button onClick={onRegisterHandler}>
                    회원가입
                </button>
                {/* <script src="https://developers.kakao.com/sdk/js/kakao.js"></script> */}
            </form>
        </div>
    )
}

export default withRouter(LoginPage)