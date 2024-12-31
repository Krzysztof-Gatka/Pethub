import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SignUpGoogle from './pages/SignUpGoogle/SignUpGoogle'
import { Container } from '@mui/material'


function App() {

  
  return (
    <Container>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup/form" element={<SignUpGoogle/>} />
      </Routes>
    </Container>
  )
}

export default App
