import React, { useEffect, useState } from 'react'
import './navbar.css'
import Logo from '../../assets/img/logo.png'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../reducers/userReducer'
import { getFiles, searchFiles } from '../../actions/fileAction'
import { showLoader } from '../../reducers/appReducer'
import avatarLogo from '../../assets/img/avatar.svg'
import { API_URL } from '../../config'
import sizeFormat from '../../utils/sizeFormat'




const NavBar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const currentDir = useSelector(state => state.files.currentDir)
    const currentUser = useSelector(state => state.user.currentUser)
    const [searchName, setSearchName] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(false)
    const avatar = currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo

    const dispatch = useDispatch()

    function searchChangeHandler(e) {
        setSearchName(e.target.value)
        // dispatch(searchFiles(e.target.value))

        if (searchTimeout !== false) {
            clearTimeout(searchTimeout)
        }

        dispatch(showLoader())

        if (e.target.value !== '') {
            setSearchTimeout(setTimeout((value) => {
                dispatch(searchFiles(value));
            }, 500, e.target.value))
        } else {
            dispatch(getFiles(currentDir))
        }
    }

    return (
        <div className="navbar">
            <div className="container">
                <NavLink to='/'><img src={Logo} alt="" className="navbar__logo" /></NavLink>
                <div className="navbar__header">Files4Cloud</div>
                {isAuth && <input
                    value={searchName}
                    onChange={e => searchChangeHandler(e)}
                    className='navbar__search'
                    type="text"
                    placeholder="Название файла..." />}

                {!isAuth && <div className="navbar__login"> <NavLink to='/login'>Войти</NavLink> </div>}
                {!isAuth && <div className="navbar__registration"><NavLink to='/registration'>Регистрация</NavLink></div>}
                {isAuth && <div className="navbar__space">Space: {sizeFormat(currentUser.usedSpace)} / {sizeFormat(currentUser.diskSpace)}</div>}
                {isAuth && <div className="navbar__login" onClick={() => dispatch(logout())}>Выход</div>}
                {isAuth && <NavLink to='/profile'>
                    <img className="navbar__avatar" src={avatar} alt="navbar__avatar" />
                </NavLink>}

            </div>
        </div >
    )
}

export default NavBar


