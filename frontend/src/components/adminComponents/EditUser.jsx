import React, { useEffect, useState } from "react";
import { useUpdateUserDetailsMutation } from "../../slices/adminSlice/adminApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/adminSlice/adminAuthSlice";

const EditUser = ({ userData, isOpen, onClose }) => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const [updateProfile, { isLoading }] = useUpdateUserDetailsMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setImage(userData.profileImage);
    setUsername(userData.name);
    setEmail(userData.email);
  }, []);

  const handleImageChange = (e) => {
    const files = e.target.files[0];
    setSelectedImage(files);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Define validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

    // Initialize error object
    let errors = {};

    // Validate username
    if (!nameRegex.test(username) || username.trim() === "") {
      errors.name =
        "Username must be 3-16 characters long and contain no spaces or special characters other than _ or -";
    }

    // Validate email
    if (!emailRegex.test(email) || email.trim() === "") {
      errors.email = "Please enter a valid email address";
    }

    // Conditionally validate passwords only if they are provided
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
      formData.append("_id", userData._id);
      formData.append("name", username);
      formData.append("email", email);

      // Append password fields only if they are provided
      if (newPassword) {
        formData.append("password", newPassword);
      }

      formData.append("image", selectedImage);

      const res = await updateProfile(formData).unwrap();
      toast.success("Profile updated");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err.message);
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
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          {/* Form */}
          <form>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image
              </label>
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  className="h-28 w-28 rounded-full"
                  alt="Selected"
                />
              ) : (
                <img src={image} alt="" className="h-28 w-28 rounded-full" />
              )}
              <input
                type="file"
                id="image"
                name="image"
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

export default EditUser;
