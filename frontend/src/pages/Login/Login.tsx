import React from 'react'
import { useNavigate } from 'react-router-dom'


const GOOGLE_LOGIN_URL = 'http://localhost:3000/auth/google/signin'


const Login = () => {

  const navigate = useNavigate();

  const handleEmailSignIn = () => {
    navigate('/signinform')
  }
  
  const handleGoogleSignIn = () => {
    window.location.href = (GOOGLE_LOGIN_URL)
  }


  return (
    <>
        <button onClick={handleEmailSignIn}>Zaloguje się emailem oraz hasłem</button>
        <br></br>
        <button onClick={handleGoogleSignIn}>Zaloguj się kontem Google</button>
    </>
  )
}

export default Login
