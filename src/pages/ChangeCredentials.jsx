import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyPassword } from "../services/auth/checkPassword";
import { editProfile } from "../services/profile/editProfile";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { motion } from 'framer-motion';

const ChangeCredentials = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    oldPassword: "",
    newPassword: ""
  });
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const user = await fetchCurrentUser();
        setUserId(user.data.id);
        setData((prevData) => ({
          ...prevData,
          email: user.data.email
        }));
      } catch (error) {
        setError("Error fetching user data.");
        console.error(error);
      }
    };

    getCurrentUserId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verify old password only if new password is provided
      if (data.newPassword) {
        const valid = {
          userId: userId,
          password: data.oldPassword
        };

        const isValid = await verifyPassword(valid);
        if (!isValid.data) {
          setError("Invalid old password.");
          return;
        }
      }

      const formData = new FormData();
      formData.append('userId', userId);
      if (data.email) {
        formData.append('email', data.email);
      }
      if (data.newPassword) {
        formData.append('password', data.newPassword);
      }

      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      const res = await editProfile(formData);
      console.log(res)
      setSuccess("Credentials updated successfully.");
      localStorage.removeItem("token");
      navigate("/auth/login");

    } catch (error) {
      setError("Error updating credentials.");
      console.error(error);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-b from-spotify-black via-spotify-gray to-spotify-black p-7 rounded-lg shadow-lg w-80 max-w-4xl">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="col-span-1 relative">
            <label htmlFor="email" className="block text-sm font-light mb-1 text-left labelLine">
              New Email
            </label>
            <motion.input
              type="email"
              id="email"
              name="email"
              placeholder="New Email"
              value={data.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
          <div className="col-span-1 relative">
            <label htmlFor="oldPassword" className="block text-sm font-light mb-1 text-left labelLine">
              Old Password
            </label>
            <motion.input
              type="password"
              id="oldPassword"
              name="oldPassword"
              placeholder="Old Password"
              value={data.oldPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <div className="col-span-1 relative">
            <label htmlFor="newPassword" className="block text-sm font-light mb-1 text-left labelLine">
              New Password
            </label>
            <motion.input
              type="password"
              id="newPassword"a
              placeholder="New Password"
              value={data.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </div>
          <div className="col-span-1">
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-ver text-white rounded-lg transition duration-300 bg-color4 hover:bg-color3"
            >
              Save Changes
            </button>
          </div>
        </form>
        <div className="mt-4">
          <button
            onClick={() => navigate("/user")}
            className="w-full py-2 bg-ver text-white rounded-lg transition duration-300 bg-color4 hover:bg-color3"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangeCredentials;
