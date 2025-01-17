import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import { Container } from '@mui/material'
import Animals from './pages/Animals/Animals'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import ShelterLayout from './layouts/ShelterLayout'
import Animal from './pages/Animals/Animal'
import AnimalAdd from './pages/Animals/AnimalAdd'
import AnimalEdit from './pages/Animals/AnimalEdit'
import AccountTypeSelector from './components/shared/AccountTypeSelector'
import RegistrationMethodSelector from './components/shared/RegistrationMethodSelector'
import Followed from './pages/Followed/Followed'
import { UserProfileForm, ShelterProfileForm } from './components/shared/ProfileForm';
import Walks from './pages/Walks/Walks'
import NotificationList from './pages/Notifications/NotificationList'
import SignUpForm from './components/shared/SignUpForm';
import SignInForm from './components/shared/SignInForm';
import AdoptionForm from './pages/Adoptions/AdoptionForm';
import Shelters from './pages/Shelters/Shelters';
import Shelter from './pages/Shelters/Shelter';
import ShelterAnimals from './pages/Animals/ShelterAnimals';
import ShelterAnimal from './pages/Animals/ShelterAnimal';
import AdoptionCard from './components/shared/AdoptionCard';
import Adoptions from './pages/Adoptions/adoptions';
import ShelterWalks from './pages/Walks/ShelterWalks';
import ShelterAdoptions from './pages/Adoptions/ShelterAdoptions';
import AdoptionResponses from './pages/Adoptions/AdoptionResponses';
import ShelterProfilePage from './components/ShelterProfilePage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* guest routes */}
        <Route path="/" element={<Home/>}/>
        <Route path="/signinform" element={<SignInForm/>}/>
        <Route path="/signin" element={<Login/>}/>
        <Route path="/shelters" element={<Shelters/>}/>
        <Route path="/animals/:id" element={<Animal/>} />
        <Route path="/animals" element={<Animals/>} />
        <Route path="/signupform/:role" element={<SignUpForm/>}/>
        <Route path="/adoptions" element={<Adoptions/>}/>
        <Route path="/adoption/:id" element={<AdoptionCard/>}/>

        {/* guest and user routes */}
        <Route path="/shelters/:id" element={<Shelter />} />
        
        {/* registration routes */}
        <Route path="/signup" element={<AccountTypeSelector />} />
        <Route path="/signup/:type" element={<RegistrationMethodSelector />} />
        <Route path="/userProfileForm" element={<UserProfileForm />} />
        <Route path="/shelterProfileForm" element={<ShelterProfileForm />} />

        {/* routes shared between users and shelters */}
        <Route path="/notifications" element={<NotificationList/>} />
        <Route path="/appointments" element={<Home/>}/>
        <Route path="/adoptions" element={<Home/>}/>
        
        {/* user routes */}
        <Route path="/followed" element={<Followed/>}/>
        <Route path="/walks" element={<Walks/>}/>
        <Route path="/adopt" element={<AdoptionForm />} />
        <Route path="/adopt/:animalId" element={<AdoptionForm />} />
        

        {/* shelter routes */}
        <Route path="/shelter/animals" element={<ShelterAnimals/>} />
        <Route path="/shelter/animals/:id/edit" element={<AnimalEdit/>} />
        <Route path="/shelter/animals/:id" element={<ShelterAnimal/>} />
        <Route path="/shelter/animals/add" element={<AnimalAdd/>} />
        <Route path="/shelter/animals/:id/edit" element={<Animals/>} />
        <Route path="/shelter/animals/:id/delete" element={<Animals/>} />
        <Route path="/animals/:id" element={<Animals/>} />

        <Route path="/shelter/profile" element={<ShelterProfilePage />} />



        <Route path="/shelter/animal/:id" element={<ShelterAnimal />} />
        <Route path="/shelter/walks" element={<ShelterWalks />} />


        <Route path="/shelter/adoptions" element={<ShelterAdoptions />} />
        <Route path="/adoption/:adoptionId/responses" element={<AdoptionResponses />} />


      </Routes>
    </AuthProvider>
  )
}
export default App