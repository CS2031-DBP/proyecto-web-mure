import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../../img/Logo_Fondo-removebg-preview.png';
import { FaHome, FaMusic, FaPlusSquare, FaSignOutAlt, FaUser } from "react-icons/fa";

// Componente Navbar para la navegación principal de la aplicación
const Navbar = () => {
  const navigate = useNavigate(); // Hook de navegación para redirigir a otras páginas
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    navigate("/auth/login"); 
    localStorage.removeItem("token"); // Elimina el token de autenticación del almacenamiento local
// Redirige a la página de login
  };

  // Función para obtener la clase del botón basado en la ubicación actual
  const getButtonClass = (path) => {
    return location.pathname === path
      ? "bg-color2 shadow-inner" // Clase para el botón activo
      : "hover:bg-color2"; // Clase para el botón inactivo
  };

  // Función para obtener el nombre de la página actual
  const getCurrentPage = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/songs":
        return "Songs";
      case "/post/create":
        return "Create Post";
      case "/profile":
        return "Profile";
      default:
        return "App";
    }
  };

  // Verifica si el usuario está autenticado
  if (localStorage.getItem("token") === null) {
    return <div></div>; // Si no está autenticado, no muestra la navbar
  } else {
    return (
      <div className="w-full">
        <nav className="fixed top-0 left-0 right-0 bg-color1 text-white shadow-lg z-50 rounded-b-3xl">
          <div className="container mx-auto flex justify-between items-center px-4 py-2">
            <div className="flex items-center space-x-4">
              {/* Botón para navegar al Dashboard */}
              <button
                onClick={() => navigate("/dashboard")}
                className={`focus:outline-none p-2 rounded ${getButtonClass("/dashboard")}`}
                title="Dashboard"
              >
                <FaHome className="text-2xl" />
              </button>
              {/* Botón para navegar a la lista de canciones */}
              <button
                onClick={() => navigate("/songs")}
                className={`focus:outline-none p-2 rounded ${getButtonClass("/songs")}`}
                title="Songs"
              >
                <FaMusic className="text-2xl" />
              </button>
              {/* Botón para crear un nuevo post */}
              <button
                onClick={() => navigate("/post/create")}
                className={`focus:outline-none p-2 rounded ${getButtonClass("/post/create")}`}
                title="Create Post"
              >
                <FaPlusSquare className="text-2xl" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Logo" className="w-16 h-16" />
              <div className="text-lg font-bold">{`Mure - ${getCurrentPage()}`}</div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Botón para navegar al perfil del usuario */}
              <button
                onClick={() => navigate("/profile")}
                className={`focus:outline-none p-2 rounded ${getButtonClass("/profile")}`}
                title="Profile"
              >
                <FaUser className="text-2xl" />
              </button>
              {/* Botón para cerrar sesión */}
              <button
                onClick={handleLogout}
                className="focus:outline-none p-2 rounded hover:bg-color2"
                title="Logout"
              >
                <FaSignOutAlt className="text-2xl" />
              </button>
            </div>
          </div>
        </nav>
        {/* Espacio para empujar el contenido hacia abajo y evitar que se cubra con la navbar */}
        <div className="h-16"></div>
      </div>
    );
  }
};

export default Navbar;
