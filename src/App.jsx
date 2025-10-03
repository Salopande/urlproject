import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AppLayout from './layouts/applayout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import Link from './pages/Link'
import RedirectLink from './pages/RedirectLink'
import UrlProvider from './context'
import RequireAuth from './components/requireAuth'

function App() {
 
  const router = createBrowserRouter([
    {
      element:<AppLayout/>,
      children:[
        {
          path:'/',
          element:<LandingPage/>
        },
        {
          path:'/dashboard',
          element:<RequireAuth><Dashboard/></RequireAuth>
        },
        {
          path:'/auth',
          element:<Auth/>
        },
        {
          path:'/link/:id',
          element:<RequireAuth><Link/></RequireAuth>
        },
        {
          path:'/:id',
          element:<RedirectLink/>
        }
      ]
    }
  ])

  return (
    <>
     <UrlProvider>
      <RouterProvider router={router}/>
     </UrlProvider>
     
    </>
  )
}

export default App
