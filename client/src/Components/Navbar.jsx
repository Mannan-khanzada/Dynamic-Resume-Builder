import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'

const Navbar = () => {
  const { user } = useSelector(state => state.auth)
const dispatch = useDispatch()

  const navigate = useNavigate()

  const userLogout = () => {
    navigate('/')
    dispatch(logout())
  }

  return (
    <div className=''>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5
      text-slate-800 transition-all'>
        <Link to='/'>
          {/* <img src="/logo.svg" alt="logo" className='h-11 w-auto' /> */}
          <h1> Mannan. Resume Builder</h1>
        </Link>

        <div className='flex items-center gap-4 text-sm'>
          <p className='max-sm:hidden'> Hi, {user?.name} </p>
          <button onClick={userLogout} className='bg-white hover:bg-brand-green-500 
          px-7 py-1.5 rounded-full active:scale-95 transaction-all'> Logout </button>
        </div>
      </nav>


    </div>
  )
}

export default Navbar
