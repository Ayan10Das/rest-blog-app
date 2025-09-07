
import {AuthContext} from './context/AuthContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

function Header() {
    const {user,setUser} = useContext(AuthContext)

    async function handleLogout(){
        try{
            await fetch('http://localhost:3000/logout',{
                method:"POST",
                credentials:"include"
            })
            setUser(null)
        }catch(err){
            console.log(err)
            alert("Logout failed!")
        }
    }

  return (
        <header className="p-8 shadow-md bg-gray-300 flex justify-around items-center">
      <Link to="/" className="text-2xl font-bold">
        MyBlog
      </Link>

      <nav className="space-x-4">
        {user ? (
          <>
            <Link className='text-xl' to="/create">Create Post</Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className='text-xl font-bold hover:underline' to="/login">Login</Link>
            <Link className='text-xl font-bold' to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header