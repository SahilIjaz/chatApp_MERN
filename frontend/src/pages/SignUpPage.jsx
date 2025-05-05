import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
const SignUpPage = () => {
 const [showPassword,setShowPassword]=useState(false);
 const [formData,setFormData]=useState({
  fullName:"",email:"",password:""
 })
  


const {signup,isSigningUp}=useAuthStore();

const validateForm=()=>{}

return <>SignUpPage</>
}

export default SignUpPage
