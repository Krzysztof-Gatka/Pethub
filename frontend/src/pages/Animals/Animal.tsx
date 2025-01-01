import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AnimalModel } from '../../components/shared/AnimalCard'
import { useParams } from 'react-router-dom'
import ShelterLayout from '../../layouts/ShelterLayout'
import { Button } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

const Animal = () => {
    const {user, isLoggedIn, loading, logout} = useAuth()

    const params = useParams()
    const [animal, setAnimal] = useState<null | AnimalModel>(null)

    const handleWalk = () => {
        console.log('handling walk button');
        console.log(user);
    }

    const handleFollow = () => {
        console.log('handling follow buton');
    }

    const handleAdopt = () => {
        console.log('handling adopt button');
    }

    useEffect( () => {
        const fetchAnimal =  async () => {
          try {
            const response = await axios.get(`http://localhost:3000/api/animals/${params.id}`)
            console.log(response)
            setAnimal(response.data)
          } catch (err:unknown) {
            console.log(err)
          }
        }
    
        fetchAnimal();
      }, [])


  return (
    <ShelterLayout>
        <li>{animal?.id}</li>
        <li>{animal?.name}</li>
        <li>{animal?.description}</li>
        <li>{animal?.shelter_id}</li>
        <Button disabled={!isLoggedIn} onClick={handleFollow}>Follow</Button>
        <br></br>
        <Button disabled={!isLoggedIn} onClick={handleWalk}>Walk</Button>
        <br></br>
        <Button disabled={!isLoggedIn} onClick={handleAdopt}>Adopt</Button>
    </ShelterLayout>
      
  )
}

export default Animal
