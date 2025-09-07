import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setErrors({})

        try {
            const res = await fetch('http://localhost:3000/register', {
                body: JSON.stringify({ username, email, password }),
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" }
            })

            const data = await res.json();

            if (!res.ok) {
                const formatedErrors = {};
                if (data.errors) {
                    console.log(data.errors)
                    data.errors.forEach((err) => {
                        formatedErrors[err.path] = err.msg
                    })
                    console.log(formatedErrors)
                    setErrors(formatedErrors);
                } else if (data.message) {
                    alert(data.message);
                } else {
                    alert(`Invalid inputs`)
                }
                return;
            }
            alert("Registration successful! Please log in.");
            navigate("/login")
        } catch (err) {
            alert("Registration failed,please try again")
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-200'>
            <form
                onSubmit={handleSubmit}
                className='bg-white  shadow-lg rounded-xl p-8 w-full max-w-md'
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Create Account
                </h2>
        
                <input
                    type="text"
                    name='username'
                    placeholder="Enter your username!"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 
                    ${errors.username ?
                            "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                />
                {errors.username && (
                    <p className="text-red-500 text-sm mb-2">{errors.username}</p>
                )}


                <input
                    type="email"
                    name='email'
                    placeholder="Enter your email!"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2
                    ${errors.email ?
                            "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                />
                {errors.email && (<p className="text-red-500 text-sm mb-2">{errors.email}</p>)}

                <input
                    type="password"
                    name='password'
                    placeholder="Enter your password!"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 
                         ${errors.password ?
                            "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                />
                {errors.password && (<p className="text-red-500 text-sm mb-2">{errors.password}</p>)}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >Register</button>


                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Register