import React from 'react'

import Navbar from './componenets/Navbar'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LogInPage from './pages/LogInPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import {Routes,Route} from 'react-router-dom'

import {useAuthStore} from './store/useAuthStore'
import { useEffect } from 'react'
const App = () => {
  const {authUser,checkAuth}=useAuthStore();
  useEffect(()=>{checkAuth()},[checkAuth])
  console.log('AUTH USER IS : ',authUser)
  return (
    <div>
   <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LogInPage/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
      </Routes>
  
    </div>
  )
}
export default App
