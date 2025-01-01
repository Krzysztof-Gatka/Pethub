import React from 'react'
import Navbar from '../../components/Navbar'
import axios from 'axios'
import { useAuth } from '../../hooks/useAuth';
import ShelterLayout from '../../layouts/ShelterLayout';
import GuestLayout from '../../layouts/GuestLayout';
import DefaultLayout from '../../layouts/DefaultLayout';
axios.defaults.withCredentials = true;
const Home = () => {

  const {user, isLoggedIn, loading, logout } = useAuth();
  const handleGetUserInfo = () => {
    console.log(user)
    console.log(isLoggedIn)
  }

  return (
    <>
      {
        !isLoggedIn && 
        <DefaultLayout>
          <h1>Guest</h1>
        </DefaultLayout>
      }

      {
        user! && user.role == 'shelter' &&
        <ShelterLayout>
          <h1>Shelter</h1>
          <button onClick={handleGetUserInfo}>Get user info</button>
        </ShelterLayout>
      }

{
        user! && user.role == 'user' &&
        <DefaultLayout>
          <h1>User</h1>
          <button onClick={handleGetUserInfo}>Get user info</button>
        </DefaultLayout>
      }
      

    </>
  )
}

export default Home
