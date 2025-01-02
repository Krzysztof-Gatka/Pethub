import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import { Container } from '@mui/material'
import Animals from './pages/Animals/Animals'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import ShelterLayout from './layouts/ShelterLayout'
import Animal from './pages/Animals/Animal'
import AnimalAdd from './pages/Animals/AnimalAdd'
import AccountTypeSelector from './components/shared/AccountTypeSelector'
import RegistrationMethodSelector from './components/shared/RegistrationMethodSelector'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* guest routes */}
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/shelters" element={<Login/>}/>
        <Route path="/animals/:id" element={<Animal/>} />
        <Route path="/animals" element={<Animals/>} />

        {/* registration routes - tylko podstawowe */}
        <Route path="/signup" element={<AccountTypeSelector />} />
        <Route path="/signup/:type" element={<RegistrationMethodSelector />} />

        {/* routes shared between users and shelters */}
        <Route path="/notifications" element={<Home/>} />
        <Route path="/appointments" element={<Home/>}/>
        <Route path="/adoptions" element={<Home/>}/>
        
        {/* user routes */}
        <Route path="/followed" element={<Home/>}/>

        {/* shelter routes */}
        <Route path="/shelter/animals" element={<Animals/>} />
        <Route path="/shelter/animals/add" element={<AnimalAdd/>} />
        <Route path="/shelter/animals/:id/edit" element={<Animals/>} />
        <Route path="/shelter/animals/:id/delete" element={<Animals/>} />
      </Routes>
    </AuthProvider>
  )
}

export default App