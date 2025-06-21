import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter , Route , Routes } from 'react-router-dom'
import CheckAuth from './components/checkAuth.jsx'
import TicketDetailsPage from './pages/TicketDetailsPage.jsx'
import Tickets from './pages/Tickets.jsx'
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import AdminPanel from './pages/Admin.jsx'
import MainPage from './pages/MainPage.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* <Route path='/' element={
          <MainPage/>
        }/> */}
        <Route path='/tickets' element={
          <CheckAuth protected={true}>
            <Tickets/>
          </CheckAuth>
        }/>
        <Route path='/tickets/:id' element={
          <CheckAuth protected={true}>
            <TicketDetailsPage/>
          </CheckAuth>
        }/>
        
        <Route path='/login' element={
          <CheckAuth protected={false}>
            <Login/>
          </CheckAuth>
        }/>
        <Route path='/signup' element={
          <CheckAuth protected={false}>
            <Signup/>
          </CheckAuth>
        }/>
        <Route path='/admin' element={
          <CheckAuth protected={true} isAdmin={true}>
            <AdminPanel/>
          </CheckAuth>
        }/>

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
