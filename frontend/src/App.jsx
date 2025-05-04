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
import { Loader } from 'lucide-react'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth}=useAuthStore();
  useEffect(()=>{checkAuth()},[checkAuth])
  console.log('AUTH USER IS : ',authUser)

  if(isCheckingAuth && !authUser)return (
<div className="flex items-center justify-center h-screen">
<Loader className='size-10 animate-spin'/>
</div>
  )
  return (
    <div>
   <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <LogInPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LogInPage/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
      </Routes>
  
    </div>
  )
}
export default App
