import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();
  const hasToken = localStorage.getItem('token');

  const handleButtonClick = () => {
    if (hasToken) {
      navigate('/dashboard');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-white my-44">
      <motion.div
        className="bg-white text-black p-8 rounded-lg shadow-lg text-center flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaExclamationTriangle className="text-6xl text-yellow-500 mb-4" />
        <h1 className="text-5xl font-bold mb-4">404 - Página no encontrada</h1>
        <p className="text-lg mb-8">La página que estás buscando no existe :(</p>
        <button
          onClick={handleButtonClick}
          className="bg-buttonColor text-white py-2 px-6 rounded-full hover:bg-buttonHover transition duration-300"
        >
          {hasToken ? 'Ir al Dashboard' : 'Ir al Login'}
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
