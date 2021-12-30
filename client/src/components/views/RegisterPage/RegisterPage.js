import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import { registerUser} from '../../../_actions/user_action'
import { useNavigate} from 'react-router-dom'
import Axios from 'axios';

function RegisterPage(props){

    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    let navigate = useNavigate();

    const onEmailHandler = (event) =>{
        setEmail(event.currentTarget.value)
    }

    const onPwdHandler = (event) =>{
        setPassword(event.currentTarget.value)
    }

    const onNameHandler = (event) =>{
        setName(event.currentTarget.value)
    }

    const setCPwdHandler = (event) =>{
        setConfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) =>{
        event.preventDefault(); //페이지 새로고침 막아줌 버튼눌릴때마다
        console.log("등록")

        if(Password !== ConfirmPassword){
            return alert('비밀번호를 확인해 주세요.');
        }

        let body = {
            email: Email,
            password: Password,
            name: Name
        }

        dispatch(registerUser(body))
        .then(response => {
            if(response.payload.success){
                navigate('/login')
            }else{
                alert('Failed to Register')
            }
        })

    }

    return(
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems :'center', width: '100%', height: '100vh'
        }}>
            <form style={{display : 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPwdHandler}/>

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={setCPwdHandler}/>
                <br/>
                <button type = "submit">
                    Register
                </button>
            </form>
        </div>
    )
}

export default RegisterPage