import React from 'react'


const USER_LOGIN_URL = 'http://localhost:3000/auth/google/signup?role=user'
const SHELTER_LOGIN_URL = 'http://localhost:3000/auth/google/signup?role=shelter'

const handleUserLogin = () => {
  window.location.href = (USER_LOGIN_URL);
}

const handleShelterLogin = () => {
  window.location.href = (SHELTER_LOGIN_URL)
}



const Login = () => {
  return (
    <>
        <div>
          Welcome to Sign Up page
        </div>
        <button onClick={() => handleUserLogin()}>Create User acoount</button>
        <br></br>
        <button onClick={() => handleShelterLogin()}>Create shelter account</button>
    </>
  )
}

export default Login
