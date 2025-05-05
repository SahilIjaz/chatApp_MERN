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
const handleSubmit=(e)=>{e.preventDefault()}

return <div className='min-h-screen grid lg:grid-clos-2'>

<div className='flex flex-col justify-center items-center p-6 sm:p-12'>
<div className='w-full max-w-md space-y-8'>  

  
</div>


</div>


</div>
  
}

export default SignUpPage
