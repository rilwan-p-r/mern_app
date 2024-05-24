import React, { useState } from "react";
import { useAddNewUserMutation } from "../../slices/adminSlice/adminApiSlice";
import { toast } from "react-toastify";

const AddUser = ({ isOpen, onClose }) => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const [addNewUser, { isloading }] = useAddNewUserMutation();
  const handleSave = async (e) => {
    e.preventDefault();

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (/\s/.test(username)) {
      toast.error("Username should not contain spaces");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (newPassword.length < 5) {
      toast.error("Password must be at least 5 characters");
      return;
    }

    if (/\s/.test(newPassword)) {
      toast.error("Password should not contain spaces");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", username);
      formData.append("email", email);
      formData.append("password", newPassword);
      formData.append("image", image);

      await addNewUser(formData).unwrap();
      toast.success("Added new user");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };
  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg p-8 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Add User</h2>
          {/* Form */}
          <form>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image
              </label>
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  className="h-28 w-28 rounded-full"
                  alt="Selected"
                />
              )}
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            {/* Save and Close buttons */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUser;
