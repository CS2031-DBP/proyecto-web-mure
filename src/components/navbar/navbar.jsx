import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../img/Logo_Fondo-removebg-preview.png";
import {
  FaHome,
  FaMusic,
  FaPlusSquare,
  FaSignOutAlt,
  FaUser,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";

const navbarVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Navbar = ({ onToggleSearchBar, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/songs") {
      setShowSearchBar(false);
      onToggleSearchBar(false);
    }
  }, [location.pathname, onToggleSearchBar]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/auth/login");
  };

  const getButtonClass = (path) => {
    return location.pathname === path
      ? "bg-color2 shadow-inner"
      : "hover:bg-color2";
  };

  const handleToggleSearchBar = () => {
    const newShowSearchBar = !showSearchBar;
    setShowSearchBar(newShowSearchBar);
    onToggleSearchBar(newShowSearchBar);
  };

  if (localStorage.getItem("token") === null) {
    return <div></div>;
  } else {
    return (
      <div className="w-full">
        <motion.nav
          className="fixed top-0 left-0 right-0 bg-gradient-to-r from-textPrimary via-gradient1 to-textPrimary text-white shadow-lg z-50 rounded-b-3xl"
          variants={navbarVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="container mx-auto flex justify-between items-center px-4 py-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className={`focus:outline-none p-2 rounded ${getButtonClass(
                  "/dashboard"
                )} transition duration-300`}
                title="Dashboard"
              >
                <FaHome className="text-2xl" />
              </button>
              <button
                onClick={() => navigate("/songs")}
                className={`focus:outline-none p-2 rounded ${getButtonClass(
                  "/songs"
                )} transition duration-300`}
                title="Songs"
              >
                <FaMusic className="text-2xl" />
              </button>
              <button
                onClick={() => navigate("/post/create")}
                className={`focus:outline-none p-2 rounded ${getButtonClass(
                  "/post/create"
                )} transition duration-300`}
                title="Create Post"
              >
                <FaPlusSquare className="text-2xl" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Logo" className="w-16 h-16" />
              <div className="text-lg font-bold">Mure</div>
            </div>
            <div className="flex items-center space-x-4">
              {location.pathname === "/songs" && (
                <button
                  onClick={handleToggleSearchBar}
                  className="focus:outline-none p-2 rounded hover:bg-color2 transition duration-300"
                  title="Search"
                >
                  <FaSearch className="text-2xl" />
                </button>
              )}
              <button
                onClick={() => navigate("/user")}
                className={`focus:outline-none p-2 rounded ${getButtonClass(
                  "/user"
                )} transition duration-300`}
                title="Profile"
              >
                <FaUser className="text-2xl" />
              </button>
              <button
                onClick={handleLogout}
                className="focus:outline-none p-2 rounded hover:bg-color2 transition duration-300"
                title="Logout"
              >
                <FaSignOutAlt className="text-2xl" />
              </button>
            </div>
          </div>
        </motion.nav>
        <div className="h-16"></div>
      </div>
    );
  }
};

export default Navbar;
