import React from 'react';
import {assets}  from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

  const navigate = useNavigate();

  return (
    <div className='w-full flex flex-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <img src={assets.logo} alt="Logo" className='w-28 sm:w-32' />
        <button 
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
            Login
            <img src={assets.arrow_icon} />
        </button>
    </div>
  )
}

export default NavBar