import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import Login from '../Authorization/Login'
import Registration from '../Authorization/Registration'
import Disk from '../Disk/Disk'
import Profile from '../profile/Profile'

const AppRouter = () => {

    const isAuth = useSelector(state => state.user.isAuth)

    return (

        !isAuth ?
            <div className="wrap">
                <Routes>
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path='/' element={<Login />}></Route>
                    <Route path='*' element={<Login />}></Route>
                </Routes >
            </div>
            :
            <Routes>
                <Route path='/' element={<Disk />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
                <Route path='*' element={<Disk />}></Route>
            </Routes>

        // <Routes>
        //     <Route path='/' element={<Zero />}></Route>
        //     {!isAuth && <Route path="/registration" element={<Registration />} />}
        //     {!isAuth && <Route path="/login" element={<Login />} />}
        // </Routes >
    )
}

export default AppRouter