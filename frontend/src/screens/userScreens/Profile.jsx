import React, { useState } from 'react';
import Header from '../../components/userComponents/Header';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EditProfile from '../../components/userComponents/EditProfile';

const Profile = () => {
  const [editProfileModal, setEditProfileModal] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const openEditProfileModal = () => {
    setEditProfileModal(true);
  };

  const closeEditProfileModal = () => {
    setEditProfileModal(false);
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white rounded-lg overflow-hidden shadow-md p-8 w-96">
          <div className="text-center mb-6">
            <img src={userInfo.profileImage} alt="Upload" className="w-24 h-24 rounded-full mt-3 mx-auto" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-500"
              id="username"
              type="text"
              placeholder="Username"
              readOnly
              value={userInfo.name}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-500"
              id="email"
              type="email"
              placeholder="Email"
              readOnly
              value={userInfo.email}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-500"
              id="password"
              type="password"
              placeholder="********"
              readOnly
            // Avoid displaying password in the placeholder
            />
          </div>
          <div className="flex justify-between">
            <Link to='/home'>
              <button className="text-gray-600 hover:text-gray-800 transition duration-300">
                <svg
                  className="h-6 w-6 mr-1 inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </Link>
            <button className="text-gray-600 hover:text-gray-800 transition duration-300" onClick={openEditProfileModal}>
              <svg
                className="h-6 w-6 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 14a6 6 0 01-6 6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7a4 4 0 016 0m-4 4a4 4 0 016 0" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
      {editProfileModal && (
        <EditProfile
          isOpen={editProfileModal}
          onClose={closeEditProfileModal}
        />
      )}
    </>
  );
};

export default Profile;