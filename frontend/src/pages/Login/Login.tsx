import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { CookiesProvider, useCookies } from 'react-cookie';


const handlelogin = () => {
  window.location.href = ('http://localhost:3000/auth/google');
}


const Login = () => {
  

  return (
    <>
      <CookiesProvider>
        <div>
          Welcome to Login page
        </div>
        <button onClick={() => handlelogin()}>Sign in with google</button>
      </CookiesProvider>
    </>
  )
}

export default Login
