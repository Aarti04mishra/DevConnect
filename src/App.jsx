import { Route, Routes } from 'react-router-dom'
import Navbar from "./Components/Navbar"
import ActiveProjects from "./pages/ActiveProjects"
import Intro from "./pages/Intro"
import Login from "./pages/Login"
import MessagingPage from "./pages/MessagingPage"
import PublicUserProfile from "./pages/PublicUserProfile"
import Signup from "./pages/Signup"
import UserProfile from "./pages/UserProfile"
import Home from "./pages/Home"
import ProjectInvitationNotification from './Components/ProjectInvitationNotification'
import { ProtectedRoute, PublicRoute } from './Services/AuthGuard'

function App() {
  

  return (
    <>
   
    <Routes>
      <Route path='/' element={<Intro/>}/>
      <Route path='/login' element={ <PublicRoute>
              <Login />
            </PublicRoute>}/>
      <Route path='/register' element={  <PublicRoute>
              <Signup />
            </PublicRoute>}/>
      <Route path='/home' element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>}/>
      <Route path='/profile' element={<ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>}/>
      <Route path="/profile/:userId" element={<ProtectedRoute>
              <PublicUserProfile />
            </ProtectedRoute>} />
       <Route path='/messages' element={ <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>}/>
    </Routes>
 
    </>
  )
}

export default App
