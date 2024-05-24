import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserMutation } from "../../slices/userSlice/userApiSlices";
import { toast } from "react-toastify";
import { setCredentials } from "../../slices/userSlice/authSlice";
import Loader from "./Loader";

const EditProfile = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

    // Initialize error object
    let errors = {};

    // Validate username
    if (!nameRegex.test(name) || name.trim() === "") {
      errors.name =
        "Username must be 3-16 characters long and contain no spaces or special characters other than _ or -";
    }

    // Validate email
    if (!emailRegex.test(email) || email.trim() === "") {
      errors.email = "Please enter a valid email address";
    }

    if (newPassword || confirmPassword) {
      if (newPassword.length < 5 || /\s/.test(newPassword)) {
        errors.password =
          "Password must be at least 5 characters long and contain no spaces";
      }

      if (newPassword !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("_id", userInfo._id);
      formData.append("name", name);
      formData.append("email", email);

      // Append password fields only if they are provided
      if (newPassword) {
        formData.append("password", newPassword);
      }

      formData.append("image", selectedImage);

      const res = await updateProfile(formData).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-md p-8 w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
        <form>
          <div className="text-center mb-6">
            <label htmlFor="image" className="block">
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Upload"
                  className="w-24 h-24 rounded-full mt-3 mx-auto cursor-pointer hover:opacity-75 transition duration-300"
                />
              )}
              <span className="text-blue-500 font-semibold mt-2 block"></span>
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              id="image"
              name="image"
              className="mt-1 mb-2 block w-full shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-500"
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-500"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-500"
              type="password"
              name="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-500"
              id="ConfirmPassword"
              type="password"
              name="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {isLoading && <Loader />}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 mr-52 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Save
            </button>
            <button
              type="button"
              className="   text-gray-600 hover:text-gray-800 transition duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
