import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ShelterLayout from '../../layouts/ShelterLayout'
import { useAuth } from '../../hooks/useAuth';
import AnimalCard from '../../components/shared/AnimalCard';

const Animals = () => {
  const [animals, setAnimals] = useState([])

  useEffect( () => {
    const fetchAnimals =  async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/animals')
        setAnimals(response.data)
      } catch (err:unknown) {
        console.log(err)
      }
    }

    fetchAnimals();
  }, [])
  

  return (
    <ShelterLayout>
      Welcome to Animals page
      <ul>
        {/* {animals.map(animal => <li key={animal.id}>{animal.name} {animal.age} {animal.description}</li>)} */}
        {animals.map(animal => <AnimalCard {...animal} key={animal.id}/>)}
      </ul>
    </ShelterLayout>
  )
}

export default Animals
