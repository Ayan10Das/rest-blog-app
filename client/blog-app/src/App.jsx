
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Profile from './Profile'
import Post from './Post'
import ProtectedRoute from './context/ProtectedRoute'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-post" element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
