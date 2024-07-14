import React from 'react';
import { useNavigate } from 'react-router-dom';

//todo

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
    <div className="flex flex-col items-center justify-center bg-gradient-to-br text-white">
      <div className="bg-color1 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-5xl font-bold mb-4">404 - Página no encontrada</h1>
        <p className="text-lg mb-8">La página que estás buscando no existe :(</p>
        <button
          onClick={handleButtonClick}
          className="bg-color3 text-white py-2 px-4 rounded-full hover:bg-color4 transition duration-300"
        >
          {hasToken ? 'Ir al Dashboard' : 'Ir al Login'}
        </button>
      </div>
    </div>
  );
};

export default NotFound;
