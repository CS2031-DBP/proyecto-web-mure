import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth/register";
import logo from "../img/Logo_Fondo-removebg-preview.png";
import { motion } from "framer-motion";

const Register = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    nickname: "",
    password: "",
    name: "",
    birthdate: "",
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setError("");
    setEmailError("");
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(data);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setEmailError("The email is already registered.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-inputBgColor min-h-screen">
      <div className="grid grid-cols-2 gap-6 max-w-4xl w-full p-4">
        <div className="col-span-1 flex items-center justify-center h-auto">
          <motion.img
            src={logo}
            alt="Logo"
            className="w-[400px] h-[350px]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="col-span-1 flex flex-col items-center justify-center h-auto">
          <motion.h1
            className="text-4xl text-fontColor font-poppins text-center pb-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Create your account and be part of{" "}
            <motion.span
              className="text-highlightColor font-oleo"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Mure
            </motion.span>
            !
          </motion.h1>
          <motion.div
            className="bg-bgColor p-6 rounded-xl w-full max-w-md pt-8 pb-8 px-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <label
                  htmlFor="email"
                  className="block text-md font-medium text-left text-textPrimary font-poppins"
                >
                  Email
                </label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <label
                  htmlFor="password"
                  className="block text-md font-medium text-left text-textPrimary font-poppins"
                >
                  Password
                </label>
                <motion.input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label
                  htmlFor="nickname"
                  className="block text-md font-medium text-left text-textPrimary font-poppins"
                >
                  Nickname
                </label>
                <motion.input
                  type="text"
                  id="nickname"
                  name="nickname"
                  placeholder="Nickname"
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label
                  htmlFor="name"
                  className="block text-md font-medium text-left text-textPrimary font-poppins"
                >
                  Username
                </label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label
                  htmlFor="birthdate"
                  className="block text-md font-medium text-left text-textPrimary font-poppins"
                >
                  Birthdate
                </label>
                <motion.input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  onChange={handleChange}
                  required
                  className="w-full p-2 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
              </motion.div>
              <motion.div
                className="flex justify-between pt-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                style={{ paddingTop: "10px" }}
              >
                <motion.button
                  type="submit"
                  className="w-full py-2 px-3 mr-2 rounded-full font-semibold transition duration-300 bg-buttonColor text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-buttonColor"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => navigate("/auth/login")}
                  className="w-full py-2 px-3 ml-2 rounded-full font-semibold transition duration-300 bg-buttonColor text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-buttonColor"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Already have an account? Log In
                </motion.button>
              </motion.div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
