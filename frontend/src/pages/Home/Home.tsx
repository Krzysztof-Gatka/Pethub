import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { Cookies, CookiesProvider, useCookies } from 'react-cookie';

const Home = () => {
  const [cookies, setCookie] = useCookies(['jwt'])
  const getUserInfo = () => {
    const jwt_token = cookies.get('jwt')
    console.log(jwt_token)
    const decoded_jwt =  jwtDecode(jwt_token)
    console.log(decoded_jwt)
  }


  return (
    <CookiesProvider>
      <div>
        Welcome home 
      </div>
      <button onClick={() => getUserInfo()}>getUserInfo</button>
    </CookiesProvider>
  )
}

export default Home
