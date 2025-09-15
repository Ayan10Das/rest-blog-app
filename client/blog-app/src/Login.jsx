import React, { useContext, useState } from 'react'
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const { setUser } = useContext(AuthContext)
  const [errors, setErrors] = useState({})
  const navigate=useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({})

    try {
      const response= await fetch('http://localhost:3000/login', {
        body: JSON.stringify({ email, password }),
        credentials:'include',
        method:"POST",
        headers:{'Content-Type':"application/json"}
      }
      )

      const data= await response.json();

      if(!response.ok){
        const formatedErrors={};
        if(data.errors){
          data.errors.forEach((error)=>{
            formatedErrors[error.path]=err.msg
          })
          setErrors(formatedErrors)
        }else if(data.message){
          alert(data.message)
        }else{
          alert("Server error pleasse try again later!")
        }
        return;
      }

      setUser(data.user)
      alert(`${data.message}`)
      navigate('/')

    }
    catch (err) { 
      alert(err)
    }

  }



  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-300'>
      <form
        onSubmit={handleSubmit}
        className='bg-white  shadow-lg rounded-xl p-8 w-full max-w-md'>

        <label htmlFor="email" className='text-xl font-medium p-1 text-gray-500'>Email</label>
        <input
          type="email"
          name='email'
          placeholder="Enter your email!"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2
                    ${errors.email ?
              "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
            }`}
        />
        {errors.email && (<p className="text-red-500 text-sm mb-2">{errors.email}</p>)}

        <label htmlFor="password" className='text-xl font-medium p-1 text-gray-500'>Password</label>
        <input
          type="password"
          name='password'
          placeholder="Enter your password!"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 
                         ${errors.password ?
              "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
            }`}
        />
        {errors.password && (<p className="text-red-500 text-sm mb-2">{errors.password}</p>)}

        <button
          type="submit"
          className="w-full mb-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >Login</button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login