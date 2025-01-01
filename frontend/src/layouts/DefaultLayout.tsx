import { Box, Container } from '@mui/material'
import Navbar from '../components/Navbar'
import React from 'react'

const DefaultLayout = ({children}) => {
  return (
    <Container>
        <Navbar/>
        <Box>
            {children}
        </Box>
    </Container>
  )
}

export default DefaultLayout
