
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

      <nav className="space-x-4 flex gap-1">
        {user ? (
          <>
            <p className="text-black justify-center items-center text-lg">{user.username}</p>
            <Link className='text-lg' to="/create-post">Create Post</Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline text-lg cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className='text-xl font-bold hover:underline' to="/login">Login</Link>
            <Link className='text-xl font-bold hover:underline' to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header