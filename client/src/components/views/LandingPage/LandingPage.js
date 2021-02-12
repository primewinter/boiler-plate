import React, {useEffect} from 'react';
import axios from 'axios';

function LandingPage() {

    useEffect(()=>{
        axios.get('http://localhost:5000/api/hello')
        .then(response => console.log(response.data))
        .catch(err=> console.log('err:',err))
    }, []);

    return (
        <div>
            LandingPage ???
        </div>
    )
}

export default LandingPage