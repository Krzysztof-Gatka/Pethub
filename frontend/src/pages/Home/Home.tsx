import React from 'react'
import Navbar from '../../components/Navbar'
import axios from 'axios'
axios.defaults.withCredentials = true;
const Home = () => {
  
  const handleGetUserInfo = async () => {
    const userInfo = await axios.get('http://localhost:3000/test/user')
    console.log(userInfo)
  }

  return (
    <>
        <Navbar/>
        <button onClick={handleGetUserInfo}>Get user info</button>
    </>
  )
}

export default Home
