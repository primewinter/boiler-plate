import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Id, setId] = useState("");
    const [Nickname, setNickname] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPW, setConfirmPW] = useState("");

    const onIdHandler = (event) => {
        setId(event.currentTarget.value);
    }

    const onNicknamedHandler = (event) => {
        setNickname(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onConfirmPWHandler = (event) => {
        setConfirmPW(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        if(Password !== ConfirmPW) {
            return alert('비밀번호와 비밀번호 확인이 다릅니다.');
        }

        let body = {
            id: Id,
            nickname: Nickname,
            password: Password
        }

       dispatch(registerUser(body))
        .then(response=> {
            if(response.payload.success) {
                alert('회원가입 성공');
                props.history.push('/login');
            } else {
                alert('회원가입 실패');
            }
        })
    }

    return (
        <div style={{
            display:'flex', justifyContent:'center', alignItems:'center'
            , width:'100%', height:'100vh'
        }}>
            <form style={{display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>ID</label>
                <input type="text" value={Id} onChange={onIdHandler}/>
                <label>닉네임</label>
                <input type="text" value={Nickname} onChange={onNicknamedHandler}/>
                <label>비밀번호</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                <label>비밀번호 확인</label>
                <input type="password" value={ConfirmPW} onChange={onConfirmPWHandler}/>

                <br/>
                <button>
                    가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
