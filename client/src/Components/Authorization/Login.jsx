import React, { useState } from 'react'
import './authorization.css'
import Input from '../../utils/input/Input'
import { login } from '../../actions/user'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { store } from '../../reducers/index'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    let navigate = useNavigate();


    async function loginHandler() {
        if (!email) {
            alert('Enter (login) email...')
        }
        else {
            await dispatch(login(email, password))
            let isAuth = await store.getState().user.isAuth
            if (await isAuth) {
                navigate("/", { replace: true })
            }
        }
    }


    return (

        <div className='authorization'>
            <div className="authorization__header">Авторизация</div>
            <Input value={email} setValue={setEmail} type="text" placeholder="Введите (login) email..." />
            <Input value={password} setValue={setPassword} type="password" placeholder="Введите пароль..." />
            <button className="authorization__btn" onClick={() => loginHandler()}>Войти</button>
        </div>
    )
}

export default Login