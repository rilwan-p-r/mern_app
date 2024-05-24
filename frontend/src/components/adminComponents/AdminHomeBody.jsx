import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const AdminHomeBody = () => {
  const {adminInfo}=useSelector((state)=>state.adminAuth)
  return (
    <>
      <div className="container mx-auto px-4 mt-48 flex justify-center">
        <div className="text-center bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl md:text-6xl mt-8 font-bold text-gray-800">Welcome <span className="text-blue-500">{adminInfo.name}</span>!</h1>
          <p className="text-lg mt-4 text-gray-600">Thank you for joining us.</p>
          <p className="text-lg mt-2 text-gray-600">Start managing now.</p>
          <Link to ='/admin/dashboard'>
          <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go to Dashboard
          </button>
          </Link>
        </div>
      </div>


    </>
  )
}

export default AdminHomeBody