import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminPrivateRoute = () => {
    const { adminInfo } = useSelector((state) => state.adminAuth)
    return adminInfo ? <Outlet /> : <Navigate to='/admin' replace />
}

export default AdminPrivateRoute