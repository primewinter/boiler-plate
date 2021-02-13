import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { createRoom } from '../../../_actions/room_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Title, setTitle] = useState("");
    const [Admin, setAdmin] = useState("");
    
    const onTitleHandler = (event) => {
        setTitle(event.currentTarget.value);
    }

    const onAdminHandler = (event) => {
        setAdmin(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        var admin = [];
        admin.push(Admin);
        let body = {
            title: Title,
            admin: admin,
            members: admin,
            created_at: new Date()
        }

       dispatch(createRoom(body))
        .then(response=> {
            if(response.payload.success) {
                alert('개설 성공');
                props.history.push('/list');
            } else {
                alert('개설 실패');
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
                <label>방제목</label>
                <input type="text" value={Title} onChange={onTitleHandler}/>
                <label>방장 ID</label>
                <input type="text" value={Admin} onChange={onAdminHandler}/>

                <br/>
                <button>
                    개설
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
