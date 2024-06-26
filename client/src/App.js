import './App.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './components/home/Home';
import {Routes, Route, Navigate} from 'react-router-dom';
import Login from 'components/login/Login';
import Signup from 'components/signup/Signup';
import Upload from 'components/upload/Upload';
import React from 'react';
import ProfileDetail from 'components/profileDetail/ProfileDetail';
import PostDetail from 'components/postDetail/PostDetail';
import { useSelector } from 'react-redux';
import PostDetails from 'components/postDetail/PostDetail';

function App() {
  const {user} = useSelector((state) => state.auth)
 
   return (
     <div>
       <Navbar />
       <Routes>
         <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
         <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
         <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
         <Route path='/upload' element={user ? <Upload /> : <Navigate to='/login' />} />
         <Route path='/profileDetail/:id' element={user ? <ProfileDetail /> : <Navigate to='/login' />} />
         <Route path='/postDetail/:id' element={user ? <PostDetails /> : <Navigate to='/login' />} />
       </Routes>
       <Footer />
     </div>
   );
 }

export default App;
