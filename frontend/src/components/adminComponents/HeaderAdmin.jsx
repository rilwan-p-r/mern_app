import React from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminLogoutMutation } from '../../slices/adminSlice/adminApiSlice'
import { adminLogout } from '../../slices/adminSlice/adminAuthSlice'

const HeaderAdmin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [logout] = useAdminLogoutMutation()
    const handleLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(adminLogout());
            navigate('/admin');

        } catch (error) {
            console.log(error);

        }
    }
    return (
        <>
            <header className="bg-blue-500 p-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <svg className="w-8 h-8 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a7 7 0 110 14 7 7 0 010-14zm-1.596 12.404c-.472.472-1.23.472-1.702 0-.472-.472-.472-1.23 0-1.702L8.297 10 6.702 8.404c-.472-.472-.472-1.23 0-1.702.472-.472 1.23-.472 1.702 0L10 8.297l1.596-1.596c.472-.472 1.23-.472 1.702 0 .472.472.472 1.23 0 1.702L11.703 10l1.595 1.596c.472.472.472 1.23 0 1.702-.472.472-1.23.472-1.703 0L10 11.703z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-white text-xl font-bold">Mearn Auth</span>
                </div>

                {/* Profile and Logout buttons */}
                <div className="hidden lg:flex items-center">
                    <Link to ='/admin/dashboard'>
                    <button className="mr-4 flex items-center bg-white text-blue-500 px-3 py-1 rounded-md focus:outline-none">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16M4 12h16m-7 8h7"></path>
                        </svg>
                        <span>Dashboard</span>
                    </button>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center bg-white text-blue-500 px-3 py-1 rounded-md focus:outline-none">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </header>
        </>
    )
}

export default HeaderAdmin