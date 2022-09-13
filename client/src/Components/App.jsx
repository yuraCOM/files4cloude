import React, { useEffect } from 'react';
import './App.css';
import Navbar from './Navbar/NavBar'
import { BrowserRouter } from "react-router-dom";
import AppRouter from './AppRouter/AppRouter';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../actions/user';


function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(auth())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar></Navbar>
        <AppRouter />
      </div>
    </BrowserRouter>

  );
}

export default App;

