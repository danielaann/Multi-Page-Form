import React from 'react'
import NavBar from '../components/NavBar'
import Headrer from '../components/Headrer'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <NavBar />  
      <Headrer />
    </div>
  )
}

export default Home