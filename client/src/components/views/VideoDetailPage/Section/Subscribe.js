import Axios from "axios";
import React, { useEffect, useState } from "react";

function Subscribe(props) {

    const [SubscribeNumer, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    const onClick = (event) => {
        event.preventDefault();
        
        const variables = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userId'),
            subscribed : Subscribed
        };

        Axios.post('/api/subscribe/subscribing', variables).then(response => {
            if(response.data.success){
                setSubscribed(!Subscribed);
                //setSubscribeNumber();
            }else{
                alert('구독자 정보를 받아오지 못하였습니다.');
            }  
        })
    }

    useEffect(() => {
        let variable = {userTo: props.userTo}
        Axios.post('/api/subscribe/subscribeNumber', variable).then(response => {
            if(response.data.success){
                setSubscribeNumber(response.data.subscribeNumber);
            }else{
                alert('구독자 정보를 받아오지 못하였습니다.');
            }
        }) 

        let subscribedVariable = {userTo: props.userTo, userFrom: localStorage.getItem('userId')}

        Axios.post('/api/subscribe/subscribed', subscribedVariable).then(response => {
            if(response.data.success){
                setSubscribed(response.data.subscribed);
            }else{
                alert('구독 정보를 받아오지 못하였습니다.');
            }
        })
    })

    return (
        <div>
            <button style={{backgroundColor: `${ Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                            color: 'white', padding: '10px 16px',
                            fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'}}
                            onClick = {onClick}>
            {SubscribeNumer} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe;