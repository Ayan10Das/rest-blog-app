
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Profile from './Profile'
import ProtectedRoute from './context/ProtectedRoute'
import CratePost from './CratePost'
import EditPost from './EditPost'
import SinglePage from './singlePage/SinglePage'


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/create-post" element={
              <ProtectedRoute>
                <CratePost />
              </ProtectedRoute>
            } />

            <Route path="/single-post/:postId" element={
              <ProtectedRoute>
                <SinglePage />
              </ProtectedRoute>
            } />
          </Route>

          <Route path='single-post/edit/:postId' element={<EditPost />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
