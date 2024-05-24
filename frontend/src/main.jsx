import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import store from './store.js'
import { Provider } from 'react-redux'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// user components
import SignUp from './screens/userScreens/SignUp.jsx'
import Login from './screens/userScreens/Login.jsx'
import HomeScreen from './screens/userScreens/HomeScreen.jsx'
import Profile from './screens/userScreens/Profile.jsx'
import PrivateRoute from './components/userComponents/PrivateRoute.jsx'

// admin components
import AdminLogin from './screens/adminscreens/AdminLogin.jsx'
import AdminPrivateRoute from './components/adminComponents/AdminPrivateRoute.jsx'
import Admin from './screens/adminscreens/Admin.jsx'
import AdminHome from './screens/adminscreens/AdminHome.jsx'
import AdminDashboard from './screens/adminscreens/AdminDashboard.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '',
    element: <PrivateRoute />,
    children: [
      {
        path: '/profile', 
        element: <Profile />

      },
      {
        path: '/home',
        element: <HomeScreen />
      }
    ]
  },

  // Admin Side
  {
    path: '/admin',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <AdminPrivateRoute><Admin /></AdminPrivateRoute>,
    children: [
      {
        path: 'home',
        element: <AdminHome />
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <ToastContainer autoClose={1000} />
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)