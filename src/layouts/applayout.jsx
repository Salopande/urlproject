import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const AppLayout = () => {
  return (
    <div>
      <main className='min-h-screen p-2 mx-3'>
         <Header/>
         <Outlet/>
      </main>
      <div className='p-10 text-center bg-gray-800 mt-10'>
         Made with Roadsider
      </div>
    </div>
  )
}

export default AppLayout