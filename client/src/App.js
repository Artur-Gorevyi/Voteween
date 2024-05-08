import './App.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './components/home/Home';
import {Routes, Route} from 'react-router-dom';
import Login from 'components/login/Login';
import Signup from 'components/signup/Signup';
import Upload from 'components/upload/Upload';
import React from 'react';
import ProfileDetail from 'components/profileDetail/ProfileDetail';
import PostDetail from 'components/postDetail/PostDetail';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/profileDetail/:id' element={<ProfileDetail />} />
        <Route path='/postDetail/:id' element={<PostDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
