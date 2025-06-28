import { Route, Routes } from 'react-router-dom'
import Navbar from "./Components/Navbar"
import ActiveProjects from "./pages/ActiveProjects"
import Intro from "./pages/Intro"
import Login from "./pages/Login"
import MessagingPage from "./pages/MessagingPage"
import PublicUserProfile from "./pages/PublicUserProfile"
import Signup from "./pages/Signup"
import UserProfile from "./pages/UserProfile"

function App() {
  

  return (
    <>
    <Routes>
      <Route path='/' element={<Intro/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Signup/>}/>
      <Route path='/profile' element={<UserProfile/>}/>
      <Route path="/profile/:userId" element={<PublicUserProfile/>} />
       <Route path='/messages' element={<MessagingPage/>}/>
    </Routes>
    {/* <UserProfile/> */}
    {/* <PublicUserProfile/> */}
    {/* <MessagingPage/> */}
    {/* <ActiveProjects/> */}
    </>
  )
}

export default App
